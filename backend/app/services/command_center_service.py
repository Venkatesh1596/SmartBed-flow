from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import List

from app.models.facility import Ward, Bed
from app.models.encounter import Encounter
from app.models.event import BedStateEvent
from app.models.enums import BedState, EncounterStatus
from app.schemas.command_center import (
    CommandCenterResponse,
    CommandCenterSummary,
    WardOperationalSummary,
    BedPriority,
    DischargeQueueItem,
    CommandCenterPriority,
)

def get_command_center_data(db: Session) -> CommandCenterResponse:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    wards = db.query(Ward).all()
    
    ward_summaries = []
    total_beds_all = 0
    total_occupied_all = 0
    total_available_all = 0
    total_active_enc_all = 0
    
    priorities = []
    discharge_queue = []
    bed_priorities = []
    
    alert_id = 1
    
    for ward in wards:
        beds = db.query(Bed).filter(Bed.ward_id == ward.id).all()
        encounters = db.query(Encounter).join(Bed).filter(Bed.ward_id == ward.id).all()
        
        total_beds = len(beds)
        available_beds = sum(1 for b in beds if b.state == BedState.AVAILABLE)
        occupied_beds = sum(1 for b in beds if b.state == BedState.OCCUPIED)
        cleaning_beds = sum(1 for b in beds if b.state == BedState.CLEANING)
        blocked_beds = 0 # Dummy implementation for blocked beds
        
        active_encounters = sum(1 for e in encounters if e.status == EncounterStatus.ACTIVE)
        admissions_today = sum(1 for e in encounters if e.created_at and e.created_at >= today_start)
        discharges_today = sum(1 for e in encounters if e.discharged_at and e.discharged_at >= today_start)
        
        # Avg Turnover
        avg_turnover = 0.0
        # Dummy delayed cleaning logic - if bed in cleaning state for > 1 hour
        delayed_cleaning = 0
        for b in beds:
            if b.state == BedState.CLEANING:
                # Find when it entered cleaning
                evt = db.query(BedStateEvent).filter(
                    BedStateEvent.bed_id == b.id,
                    BedStateEvent.new_state == BedState.CLEANING
                ).order_by(BedStateEvent.timestamp.desc()).first()
                if evt and (now - evt.timestamp).total_seconds() > 3600:
                    delayed_cleaning += 1
                    
            # Ranking beds
            rank = "AVAILABLE"
            if b.state == BedState.AVAILABLE:
                rank = "AVAILABLE"
            elif b.state == BedState.CLEANING:
                if delayed_cleaning > 0:
                    rank = "DELAYED"
                else:
                    rank = "AVAILABLE_SOON"
            elif b.state in (BedState.DISCHARGE_PREP, BedState.CLINICAL_REVIEW):
                rank = "WAIT"
            else:
                rank = "WAIT"
            
            bed_priorities.append(
                BedPriority(
                    bed_id=b.id,
                    bed_name=b.name,
                    ward_name=ward.name,
                    state=b.state.value,
                    rank=rank
                )
            )

        occupancy_pct = (occupied_beds / total_beds * 100) if total_beds > 0 else 0
        
        # Status calculation
        if delayed_cleaning > 0:
            status = "BOTTLENECK"
            priorities.append(CommandCenterPriority(id=alert_id, type="DELAYED_CLEANING", level="WARNING", message=f"Delayed cleaning in {ward.name}"))
            alert_id += 1
        elif occupancy_pct >= 90:
            status = "CRITICAL"
            priorities.append(CommandCenterPriority(id=alert_id, type="HIGH_OCCUPANCY", level="CRITICAL", message=f"Critical occupancy in {ward.name}"))
            alert_id += 1
        elif occupancy_pct >= 80:
            status = "HIGH_OCCUPANCY"
        elif occupancy_pct >= 70:
            status = "BUSY"
        else:
            status = "NORMAL"
            
        ward_summaries.append(
            WardOperationalSummary(
                ward_id=ward.id,
                ward_name=ward.name,
                total_beds=total_beds,
                available_beds=available_beds,
                occupied_beds=occupied_beds,
                cleaning_beds=cleaning_beds,
                blocked_beds=blocked_beds,
                occupancy_percent=occupancy_pct,
                active_encounters=active_encounters,
                admissions_today=admissions_today,
                discharges_today=discharges_today,
                avg_turnover_minutes=avg_turnover,
                delayed_cleaning=delayed_cleaning,
                status=status
            )
        )
        
        total_beds_all += total_beds
        total_occupied_all += occupied_beds
        total_available_all += available_beds
        total_active_enc_all += active_encounters

    # Discharge queue (active encounters sorted by elapsed stay duration)
    active_encs = db.query(Encounter).filter(Encounter.status == EncounterStatus.ACTIVE).all()
    for e in active_encs:
        stay_hours = (now - e.created_at).total_seconds() / 3600 if e.created_at else 0
        bed = e.bed
        ward_name = bed.ward.name if bed and bed.ward else "Unknown"
        discharge_queue.append(
            DischargeQueueItem(
                encounter_id=e.id,
                patient_name=e.patient_name,
                bed_id=e.bed_id,
                bed_name=bed.name if bed else "Unknown",
                ward_name=ward_name,
                elapsed_stay_hours=stay_hours
            )
        )
    discharge_queue.sort(key=lambda x: x.elapsed_stay_hours, reverse=True)

    # Add SLA priorities
    from app.services.sla_service import get_workflows, SLAStatus
    workflows = get_workflows(db)
    for wf in workflows:
        if wf.status == SLAStatus.CRITICAL:
            priorities.append(CommandCenterPriority(id=alert_id, type=f"{wf.workflow_type}_SLA", level="CRITICAL", message=f"Critical SLA for {wf.workflow_type} (Bed {wf.bed_id})"))
            alert_id += 1
        elif wf.status == SLAStatus.OVERDUE:
            priorities.append(CommandCenterPriority(id=alert_id, type=f"{wf.workflow_type}_SLA", level="WARNING", message=f"Overdue SLA for {wf.workflow_type} (Bed {wf.bed_id})"))
            alert_id += 1
        elif wf.status == SLAStatus.APPROACHING_SLA:
            priorities.append(CommandCenterPriority(id=alert_id, type=f"{wf.workflow_type}_SLA", level="INFO", message=f"Approaching SLA for {wf.workflow_type} (Bed {wf.bed_id})"))
            alert_id += 1

    # Sort priorities
    def prio_sort(p):
        return 0 if p.level == "CRITICAL" else (1 if p.level == "WARNING" else 2)
    priorities.sort(key=prio_sort)

    # Sort beds
    def bed_sort(b):
        ranks = {"AVAILABLE": 0, "AVAILABLE_SOON": 1, "WAIT": 2, "DELAYED": 3}
        return ranks.get(b.rank, 4)
    bed_priorities.sort(key=bed_sort)

    total_occ_pct = (total_occupied_all / total_beds_all * 100) if total_beds_all > 0 else 0
    crit_alerts = sum(1 for p in priorities if p.level == "CRITICAL")
    warn_alerts = sum(1 for p in priorities if p.level == "WARNING")

    from app.schemas.freshness import calculate_freshness
    freshness_info = calculate_freshness()

    summary = CommandCenterSummary(
        total_occupancy_percent=total_occ_pct,
        total_available_beds=total_available_all,
        total_active_encounters=total_active_enc_all,
        critical_alerts=crit_alerts,
        warning_alerts=warn_alerts,
        **freshness_info
    )

    return CommandCenterResponse(
        summary=summary,
        wards=ward_summaries,
        priorities=priorities,
        discharge_queue=discharge_queue
    ), bed_priorities
