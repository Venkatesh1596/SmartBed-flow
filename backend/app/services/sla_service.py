from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.facility import Bed
from app.models.event import BedStateEvent
from app.models.encounter import Encounter
from app.schemas.sla import WorkflowSLA, SLASummary, SLAResponse, SLAStatus

# Thresholds
CLEANING_TARGET_MIN = 30
CLEANING_WARNING_MIN = 45
CLEANING_CRITICAL_MIN = 60

DISCHARGE_APPROACHING_MIN = 1440
DISCHARGE_OVERDUE_MIN = 2880
DISCHARGE_CRITICAL_MIN = 4320

def _get_cleaning_status(elapsed: int) -> tuple[SLAStatus, int]:
    if elapsed >= CLEANING_CRITICAL_MIN:
        return SLAStatus.CRITICAL, CLEANING_TARGET_MIN
    if elapsed >= CLEANING_WARNING_MIN:
        return SLAStatus.OVERDUE, CLEANING_TARGET_MIN
    if elapsed >= CLEANING_TARGET_MIN:
        return SLAStatus.APPROACHING_SLA, CLEANING_TARGET_MIN
    return SLAStatus.ON_TRACK, CLEANING_TARGET_MIN

def _get_discharge_status(elapsed: int) -> tuple[SLAStatus, int]:
    if elapsed >= DISCHARGE_CRITICAL_MIN:
        return SLAStatus.CRITICAL, DISCHARGE_OVERDUE_MIN
    if elapsed >= DISCHARGE_OVERDUE_MIN:
        return SLAStatus.OVERDUE, DISCHARGE_OVERDUE_MIN
    if elapsed >= DISCHARGE_APPROACHING_MIN:
        return SLAStatus.APPROACHING_SLA, DISCHARGE_OVERDUE_MIN
    return SLAStatus.ON_TRACK, DISCHARGE_OVERDUE_MIN


def get_workflows(db: Session, current_time: datetime = None) -> List[WorkflowSLA]:
    if current_time is None:
        current_time = datetime.now(timezone.utc)
    workflows = []
    
    # Cleaning SLAs (Beds in CLEANING state)
    beds_in_cleaning = db.query(Bed).filter(Bed.state == "CLEANING").all()
    for bed in beds_in_cleaning:
        # Get the latest CLEANING event
        event = db.query(BedStateEvent).filter(
            BedStateEvent.bed_id == bed.id,
            BedStateEvent.new_state == "CLEANING"
        ).order_by(BedStateEvent.timestamp.desc()).first()
        
        if event:
            # handle timezone
            start_time = event.timestamp
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            elapsed = int((current_time - start_time).total_seconds() / 60)
            status, target = _get_cleaning_status(elapsed)
            
            workflows.append(WorkflowSLA(
                workflow_type="CLEANING",
                bed_id=bed.id,
                start_time=start_time,
                elapsed_minutes=elapsed,
                status=status,
                target_minutes=target
            ))

    # Discharge Review SLAs (Encounters in DISCHARGE_REVIEW or active encounters maybe?)
    # "Discharge Review (Approaching 24h/1440m, Overdue 48h/2880m, Critical 72h/4320m)." based on admission time?
    # The prompt says: "Calculate elapsed time dynamically using BedStateEvent (for CLEANING state transitions) and Encounter (for discharge review based on admission time)."
    
    # Assuming we look at all active encounters? Or just a specific state? Let's check `Encounter` model.
    # Usually encounters have `status` like "ACTIVE". Let's get all active encounters.
    # We don't have the encounter schema yet, let me use `status == "ACTIVE"`.
    active_encounters = db.query(Encounter).filter(Encounter.status == "ACTIVE").all()
    for enc in active_encounters:
        start_time = enc.created_at
        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=timezone.utc)
        elapsed = int((current_time - start_time).total_seconds() / 60)
        status, target = _get_discharge_status(elapsed)
        
        workflows.append(WorkflowSLA(
            workflow_type="DISCHARGE_REVIEW",
            encounter_id=enc.id,
            bed_id=enc.bed_id,
            start_time=start_time,
            elapsed_minutes=elapsed,
            status=status,
            target_minutes=target
        ))
        
    return workflows

def get_sla_summary(db: Session, current_time: datetime = None) -> SLAResponse:
    workflows = get_workflows(db, current_time)
    
    summary = SLASummary(
        on_track_count=sum(1 for w in workflows if w.status == SLAStatus.ON_TRACK),
        approaching_sla_count=sum(1 for w in workflows if w.status == SLAStatus.APPROACHING_SLA),
        overdue_count=sum(1 for w in workflows if w.status == SLAStatus.OVERDUE),
        critical_count=sum(1 for w in workflows if w.status == SLAStatus.CRITICAL)
    )
    return SLAResponse(summary=summary, workflows=workflows)

def get_overdue_workflows(db: Session, current_time: datetime = None) -> List[WorkflowSLA]:
    workflows = get_workflows(db, current_time)
    return [w for w in workflows if w.status in (SLAStatus.OVERDUE, SLAStatus.CRITICAL)]

def get_bed_sla(db: Session, bed_id: int, current_time: datetime = None) -> List[WorkflowSLA]:
    workflows = get_workflows(db, current_time)
    return [w for w in workflows if w.bed_id == bed_id]
