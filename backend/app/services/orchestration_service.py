from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional

from app.models.facility import Bed, Ward
from app.models.enums import BedState
from app.schemas.orchestration import (
    AllocationCandidate,
    WorkflowBlocker,
    WardAllocationPressure,
    OperationalQueueItem,
    AllocationRecommendation,
    OrchestrationSummary,
    OrchestrationResponse
)
from app.services.capacity_service import CapacityService
from app.services.sla_service import get_workflows, SLAStatus
from app.services.prediction_service import PredictionService

class OrchestrationService:
    def __init__(self, db: Session):
        self.db = db
        self.capacity_service = CapacityService(db)
        self.prediction_service = PredictionService(db)

    def get_allocation_candidates(self) -> List[AllocationCandidate]:
        beds = self.db.query(Bed).all()
        candidates = []
        
        predictions = {p.bed_id: p for p in self.prediction_service.get_bed_availability_predictions()}
        
        for bed in beds:
            score = 0.0
            status_category = bed.state.value if hasattr(bed.state, 'value') else bed.state
            if bed.state == BedState.AVAILABLE:
                score = 100.0
                status_category = "AVAILABLE"
            elif bed.state == BedState.CLEANING:
                score = 50.0
                status_category = "CLEANING"
            elif bed.id in predictions:
                pred = predictions[bed.id]
                score = pred.confidence_score * 100.0
                if score > 100.0: score = 100.0
                status_category = "AVAILABLE_SOON"
            elif bed.state == "BLOCKED" or (hasattr(bed.state, 'value') and bed.state.value == "BLOCKED"):
                score = 0.0
                status_category = "BLOCKED"
            else:
                score = 20.0
                status_category = "OCCUPIED"
                
            ward_id = bed.ward_id if bed.ward_id else 0
            
            candidates.append(AllocationCandidate(
                bed_id=bed.id,
                ward_id=ward_id,
                score=score,
                status_category=status_category
            ))
            
        candidates.sort(key=lambda x: (-x.score, x.bed_id))
        return candidates

    def get_workflow_blockers(self) -> List[WorkflowBlocker]:
        blockers = []
        workflows = get_workflows(self.db)
        for w in workflows:
            if w.status in (SLAStatus.OVERDUE, SLAStatus.CRITICAL):
                blockers.append(WorkflowBlocker(
                    bed_id=w.bed_id,
                    blocker_type="SLA_OVERDUE",
                    description=f"{w.workflow_type} SLA is overdue by {w.elapsed_minutes - w.target_minutes} minutes"
                ))
        return sorted(blockers, key=lambda x: x.bed_id)

    def get_ward_pressure(self) -> List[WardAllocationPressure]:
        ward_summaries = self.capacity_service.get_ward_summaries()
        pressures = []
        for ws in ward_summaries:
            rate = ws.occupancy_rate
            if rate >= 0.9:
                cat = "CRITICAL"
            elif rate >= 0.8:
                cat = "HIGH"
            elif rate >= 0.6:
                cat = "BUSY"
            else:
                cat = "NORMAL"
            pressures.append(WardAllocationPressure(
                ward_id=ws.ward_id,
                pressure_category=cat
            ))
        return sorted(pressures, key=lambda x: x.ward_id)

    def get_operational_queue(self) -> List[OperationalQueueItem]:
        queue = []
        # Add blockers as CRITICAL/HIGH
        blockers = self.get_workflow_blockers()
        for b in blockers:
            queue.append(OperationalQueueItem(
                priority="CRITICAL",
                task_type=b.blocker_type,
                bed_id=b.bed_id,
                description=b.description
            ))
        
        # Priority mapping for sorting
        priority_map = {"CRITICAL": 1, "HIGH": 2, "WARNING": 3, "INFO": 4}
        queue.sort(key=lambda x: (priority_map.get(x.priority, 5), x.bed_id or 0))
        return queue

    def get_recommendations(self) -> List[AllocationRecommendation]:
        recs = []
        pred_recs = self.prediction_service.get_recommendations()
        for pr in pred_recs:
            recs.append(AllocationRecommendation(recommendation_text=pr.action))
        if not recs:
            recs.append(AllocationRecommendation(recommendation_text="Monitor beds"))
        return recs

    def get_summary(self) -> OrchestrationSummary:
        pressure_score = self.capacity_service.get_pressure_score()
        candidates = self.get_allocation_candidates()
        blockers = self.get_workflow_blockers()
        
        return OrchestrationSummary(
            pressure_score=min(max(pressure_score, 0.0), 100.0),
            candidates_count=len(candidates),
            blockers_count=len(blockers)
        )
