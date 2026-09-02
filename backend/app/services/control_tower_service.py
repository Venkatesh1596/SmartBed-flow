from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import List

from app.models.facility import Ward, Bed
from app.models.encounter import Encounter
from app.models.event import HospitalEvent
from app.models.enums import BedState, EncounterStatus
from app.models.notification import Notification

from app.schemas.control_tower import (
    ControlTowerSummary,
    LiveOperationalMetric,
    ControlTowerWard,
    ControlTowerBed,
    ControlTowerAlert,
    ControlTowerQueueItem,
    ControlTowerActivity,
    ControlTowerPriority,
    ControlTowerTrendPoint
)

def get_control_tower_summary(db: Session) -> ControlTowerSummary:
    wards = db.query(Ward).all()
    
    total_beds_system = 0
    total_occupied_system = 0
    total_pending_admissions = 0
    total_pending_discharges = 0
    
    ward_summaries = []
    
    for ward in wards:
        beds = db.query(Bed).filter(Bed.ward_id == ward.id).all()
        encounters = db.query(Encounter).join(Bed).filter(Bed.ward_id == ward.id, Encounter.status == EncounterStatus.ACTIVE).all()
        
        total_beds = len(beds)
        occupied_beds = sum(1 for b in beds if b.state == BedState.OCCUPIED)
        available_beds = sum(1 for b in beds if b.state == BedState.AVAILABLE)
        
        pending_discharges = sum(1 for b in beds if b.state == BedState.DISCHARGE_PREP)
        # We can mock pending admissions if we don't have a clear model for it, or just use 0
        pending_admissions = sum(1 for b in beds if b.state == BedState.CLEANING) # just as an operational metric proxy
        
        occupancy_rate = (occupied_beds / total_beds * 100) if total_beds > 0 else 0.0
        # bounds
        occupancy_rate = max(0.0, min(100.0, occupancy_rate))

        total_beds_system += total_beds
        total_occupied_system += occupied_beds
        total_pending_discharges += pending_discharges
        total_pending_admissions += pending_admissions
        
        ward_summaries.append(
            ControlTowerWard(
                ward_id=ward.id,
                ward_name=ward.name,
                total_beds=total_beds,
                occupied_beds=occupied_beds,
                available_beds=available_beds,
                pending_admissions=pending_admissions,
                pending_discharges=pending_discharges,
                occupancy_rate=occupancy_rate
            )
        )
        
    system_occupancy_rate = (total_occupied_system / total_beds_system * 100) if total_beds_system > 0 else 0.0
    system_occupancy_rate = max(0.0, min(100.0, system_occupancy_rate))

    # critical alerts
    critical_alerts = db.query(Notification).filter(Notification.severity == "CRITICAL", Notification.is_read == False).count()
    
    # average wait time mock
    active_encounters = db.query(Encounter).filter(Encounter.status == EncounterStatus.ACTIVE).all()
    avg_wait = 0.0
    if active_encounters:
        now = datetime.now(timezone.utc)
        total_hours = sum((now - e.created_at).total_seconds() / 3600 for e in active_encounters if e.created_at)
        avg_wait = total_hours / len(active_encounters)
        
    metrics = LiveOperationalMetric(
        total_beds_system=total_beds_system,
        total_occupied_system=total_occupied_system,
        system_occupancy_rate=system_occupancy_rate,
        total_pending_admissions=total_pending_admissions,
        total_pending_discharges=total_pending_discharges,
        average_wait_time=avg_wait,
        critical_alerts_count=critical_alerts
    )
    
    return ControlTowerSummary(metrics=metrics, wards=ward_summaries)

def get_live_bed_board(db: Session) -> List[ControlTowerBed]:
    beds = db.query(Bed).all()
    result = []
    for b in beds:
        is_attention = b.state in (BedState.CLEANING, BedState.DISCHARGE_PREP)
        result.append(ControlTowerBed(
            bed_id=b.id,
            status=b.state.value,
            ward_name=b.ward.name if b.ward else "Unknown",
            is_attention_needed=is_attention
        ))
    return result

def get_ward_control(db: Session) -> List[ControlTowerWard]:
    return get_control_tower_summary(db).wards

def get_operational_attention(db: Session) -> List[ControlTowerBed]:
    board = get_live_bed_board(db)
    return [b for b in board if b.is_attention_needed]

def get_control_tower_queue(db: Session) -> List[ControlTowerQueueItem]:
    # Mocking queue items from encounters
    encounters = db.query(Encounter).filter(Encounter.status == EncounterStatus.ACTIVE).all()
    now = datetime.now(timezone.utc)
    queue = []
    for e in encounters:
        wait_time = int((now - e.created_at).total_seconds() / 60) if e.created_at else 0
        priority = "HIGH" if wait_time > 120 else "MEDIUM"
        queue.append(ControlTowerQueueItem(
            item_id=e.id,
            type="discharge" if e.bed and e.bed.state == BedState.DISCHARGE_PREP else "admission",
            status="WAITING",
            wait_time_minutes=wait_time,
            priority=priority
        ))
    return queue

def get_recent_activity(db: Session) -> List[ControlTowerActivity]:
    events = db.query(HospitalEvent).order_by(HospitalEvent.timestamp.desc()).limit(20).all()
    result = []
    for evt in events:
        result.append(ControlTowerActivity(
            activity_id=evt.id,
            action=evt.type,
            timestamp=evt.timestamp or datetime.now(timezone.utc),
            details=str(evt.details) if evt.details else "System activity"
        ))
    return result

def get_recent_changes(db: Session) -> List[ControlTowerActivity]:
    return get_recent_activity(db)

def get_control_tower_trends(db: Session) -> List[ControlTowerTrendPoint]:
    # mock trends
    now = datetime.now(timezone.utc)
    return [
        ControlTowerTrendPoint(timestamp=now - timedelta(hours=2), occupancy_rate=75.0, wait_time_avg=2.0),
        ControlTowerTrendPoint(timestamp=now - timedelta(hours=1), occupancy_rate=80.0, wait_time_avg=2.5),
        ControlTowerTrendPoint(timestamp=now, occupancy_rate=85.0, wait_time_avg=3.0)
    ]

def get_control_tower_priorities(db: Session) -> List[ControlTowerPriority]:
    notifications = db.query(Notification).filter(Notification.is_read == False).all()
    result = []
    for n in notifications:
        result.append(ControlTowerPriority(
            priority_id=n.id,
            type=n.notification_type or "GENERAL",
            description=n.message or "Action required",
            urgency_level=n.severity or "MEDIUM"
        ))
    return result
