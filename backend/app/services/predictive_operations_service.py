import math
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.facility import Ward, Bed
from app.models.enums import BedState
from app.models.encounter import Encounter
from app.models.event import BedStateEvent
from app.schemas.predictive_operations import (
    PredictiveOperationsSummary, EarlyWarningScore, FacilityEarlyWarning,
    WardEarlyWarning, CleaningRisk, DischargeAgingRisk, CapacityRisk,
    SLATrend, WorkflowTrend, PredictiveTrendPoint, OperationalWarning,
    PredictivePriority, PredictiveRecommendation
)
from app.services.capacity_service import CapacityService
from app.services.sla_service import get_workflows, SLAStatus
from app.services.command_center_service import get_command_center_data
from app.services.prediction_service import PredictionService
from app.services.orchestration_service import OrchestrationService

def calculate_score_category(score: float) -> str:
    if score >= 80:
        return "High"
    elif score >= 60:
        return "Elevated"
    elif score >= 40:
        return "Watch"
    return "Normal"

def get_capacity_risk(db: Session, ward_id: Optional[int] = None) -> CapacityRisk:
    if ward_id is None:
        beds = db.query(Bed).all()
    else:
        beds = db.query(Bed).filter(Bed.ward_id == ward_id).all()
        
    total_beds = len(beds)
    available_beds = sum(1 for b in beds if b.state == BedState.AVAILABLE)
    occupied_beds = sum(1 for b in beds if b.state == BedState.OCCUPIED)
    
    occupancy_rate = (occupied_beds / total_beds) if total_beds > 0 else 0.0
    score = occupancy_rate * 100.0
    
    return CapacityRisk(
        score=score,
        available_beds=available_beds,
        occupancy_rate=occupancy_rate
    )

def get_sla_trend(db: Session, ward_id: Optional[int] = None) -> SLATrend:
    workflows = get_workflows(db)
    
    if ward_id is not None:
        # Filter workflows by ward
        beds_in_ward = {b.id for b in db.query(Bed).filter(Bed.ward_id == ward_id).all()}
        workflows = [w for w in workflows if w.bed_id in beds_in_ward]

    total = len(workflows)
    missed = sum(1 for w in workflows if w.status in (SLAStatus.OVERDUE, SLAStatus.CRITICAL))
    
    compliance = ((total - missed) / total) if total > 0 else 1.0
    score = ((1.0 - compliance) * 100.0) if total > 0 else 0.0
    
    return SLATrend(
        score=score,
        missed_slas=missed,
        compliance_rate=compliance
    )

def get_cleaning_risk(db: Session, ward_id: Optional[int] = None) -> CleaningRisk:
    if ward_id is None:
        beds = db.query(Bed).filter(Bed.state == BedState.CLEANING).all()
    else:
        beds = db.query(Bed).filter(Bed.ward_id == ward_id, Bed.state == BedState.CLEANING).all()
        
    dirty_beds = len(beds)
    
    now = datetime.now(timezone.utc)
    total_time = 0.0
    for b in beds:
        evt = db.query(BedStateEvent).filter(
            BedStateEvent.bed_id == b.id,
            BedStateEvent.new_state == BedState.CLEANING
        ).order_by(BedStateEvent.timestamp.desc()).first()
        if evt:
            t = evt.timestamp
            if t.tzinfo is None:
                t = t.replace(tzinfo=timezone.utc)
            total_time += (now - t).total_seconds() / 60.0
            
    avg_time = (total_time / dirty_beds) if dirty_beds > 0 else 0.0
    score = min(100.0, (avg_time / 60.0) * 100.0) # Assuming > 60 mins is 100% risk
    
    return CleaningRisk(
        score=score,
        dirty_beds=dirty_beds,
        avg_cleaning_time=avg_time
    )

def get_discharge_aging_risk(db: Session, ward_id: Optional[int] = None) -> DischargeAgingRisk:
    q = db.query(Encounter).filter(Encounter.status == "ACTIVE")
    if ward_id is not None:
        q = q.join(Bed).filter(Bed.ward_id == ward_id)
    active_encs = q.all()
    
    now = datetime.now(timezone.utc)
    delayed = 0
    total_delay = 0.0
    
    for e in active_encs:
        t = e.created_at
        if t:
            if t.tzinfo is None:
                t = t.replace(tzinfo=timezone.utc)
            hours = (now - t).total_seconds() / 3600.0
            if hours > 48:
                delayed += 1
                total_delay += (hours - 48.0)
                
    avg_delay = (total_delay / delayed) if delayed > 0 else 0.0
    score = min(100.0, (delayed / (len(active_encs) or 1)) * 100.0)
    
    return DischargeAgingRisk(
        score=score,
        delayed_discharges=delayed,
        avg_delay_hours=avg_delay
    )

def get_workflow_trend(db: Session, ward_id: Optional[int] = None) -> WorkflowTrend:
    orch = OrchestrationService(db)
    summary = orch.get_summary()
    
    total_bottlenecks = summary.blockers_count
    score = min(100.0, total_bottlenecks * 10.0)
    
    return WorkflowTrend(
        score=score,
        bottlenecks=total_bottlenecks,
        throughput_rate=0.0 # Just mock or use something else
    )

def get_predictive_trends(db: Session, days: int) -> List[PredictiveTrendPoint]:
    # Mocking trend points for 7/14/30/90 days based on days
    trends = []
    now = datetime.now(timezone.utc)
    for i in range(days):
        dt = now - timedelta(days=i)
        trends.append(PredictiveTrendPoint(
            timestamp=dt.isoformat(),
            score=min(100.0, (i * 2.5) % 100.0)
        ))
    return list(reversed(trends))

class PredictiveOperationsService:
    def __init__(self, db: Session):
        self.db = db

    def get_summary(self) -> PredictiveOperationsSummary:
        return PredictiveOperationsSummary(
            facility_warning=self.get_facility_warning(),
            ward_warnings=self.get_ward_warnings(),
            active_warnings=self.get_warnings(),
            top_priorities=self.get_priorities(),
            recommendations=self.get_recommendations(),
            trend_data=self.get_trends(7)
        )

    def get_facility_warning(self) -> FacilityEarlyWarning:
        cap_risk = get_capacity_risk(self.db)
        sla_risk = get_sla_trend(self.db)
        clean_risk = get_cleaning_risk(self.db)
        wf_risk = get_workflow_trend(self.db)
        
        # Trend 10%
        trend_score = 50.0 
        
        # Weighted: Capacity 30%, SLA 25%, Cleaning 20%, Workflow 15%, Trend 10%
        total_score = (
            (cap_risk.score * 0.30) +
            (sla_risk.score * 0.25) +
            (clean_risk.score * 0.20) +
            (wf_risk.score * 0.15) +
            (trend_score * 0.10)
        )
        
        return FacilityEarlyWarning(
            warning_score=EarlyWarningScore(
                score=total_score,
                category=calculate_score_category(total_score)
            ),
            capacity_risk=cap_risk,
            sla_trend=sla_risk,
            cleaning_risk=clean_risk,
            workflow_trend=wf_risk
        )

    def get_ward_warnings(self) -> List[WardEarlyWarning]:
        wards = self.db.query(Ward).all()
        result = []
        for w in wards:
            cap_risk = get_capacity_risk(self.db, w.id)
            clean_risk = get_cleaning_risk(self.db, w.id)
            dis_risk = get_discharge_aging_risk(self.db, w.id)
            
            # Ward score (simple avg for now)
            ward_score = (cap_risk.score + clean_risk.score + dis_risk.score) / 3.0
            
            result.append(WardEarlyWarning(
                ward_id=str(w.id),
                ward_name=w.name,
                warning_score=EarlyWarningScore(
                    score=ward_score,
                    category=calculate_score_category(ward_score)
                ),
                capacity_risk=cap_risk,
                cleaning_risk=clean_risk,
                discharge_aging=dis_risk
            ))
            
        result.sort(key=lambda x: x.warning_score.score, reverse=True)
        return result

    def get_warnings(self) -> List[OperationalWarning]:
        fac = self.get_facility_warning()
        warnings = []
        if fac.capacity_risk.score > 80:
            warnings.append(OperationalWarning(
                warning_id="WARN-CAP",
                severity="High",
                message="Capacity critically constrained.",
                affected_areas=["Facility"]
            ))
        if fac.cleaning_risk.score > 80:
            warnings.append(OperationalWarning(
                warning_id="WARN-CLN",
                severity="High",
                message="Severe cleaning bottlenecks.",
                affected_areas=["Facility"]
            ))
        return warnings

    def get_priorities(self) -> List[PredictivePriority]:
        return [
            PredictivePriority(
                priority_id="PRI-1",
                level="High",
                description="Address delayed discharges in intensive care.",
                impact_score=90.0
            )
        ]

    def get_recommendations(self) -> List[PredictiveRecommendation]:
        return [
            PredictiveRecommendation(
                recommendation_id="REC-1",
                action="Allocate additional cleaning staff to Ward A.",
                expected_benefit="Reduce average turnaround by 20 mins.",
                effort_level="Medium"
            )
        ]

    def get_trends(self, days: int) -> List[PredictiveTrendPoint]:
        return get_predictive_trends(self.db, days)

    def get_cleaning_risk(self) -> CleaningRisk:
        return get_cleaning_risk(self.db)

    def get_discharge_aging(self) -> DischargeAgingRisk:
        return get_discharge_aging_risk(self.db)

    def get_capacity_risk(self) -> CapacityRisk:
        return get_capacity_risk(self.db)

    def get_sla_trend(self) -> SLATrend:
        return get_sla_trend(self.db)

    def get_workflow_trend(self) -> WorkflowTrend:
        return get_workflow_trend(self.db)
