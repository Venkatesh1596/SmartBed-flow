from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime, timedelta
from app.schemas.dashboard import (
    OccupancyTrendPoint, 
    FlowTrendPoint, 
    TurnoverSummary, 
    TurnoverRecord, 
    OperationalAlert
)
from app.models.event import HospitalEvent, BedStateEvent, ClinicalEvent, DischargeEvent
from app.models.encounter import Encounter

from app.db.session import SessionLocal
from app.models.facility import Bed
from app.models.enums import BedState
from app.services.freshness import freshness_service, FreshnessState

router = APIRouter()

from app.api.deps import get_db, get_current_user
from app.models.user import User

# Pydantic Schemas for Dashboard Response
class CapacitySummary(BaseModel):
    total: int
    occupied: int
    ready: int
    turnover: int
    available: int

class BedDashboardRow(BaseModel):
    bed_id: str
    ward: str
    readiness: str
    turnover: str
    freshness: str
    eta_minutes: Optional[int]
    blocker: str

class EmergencyDemand(BaseModel):
    critical: int
    urgent: int
    routine: int

from app.schemas.freshness import FreshnessMixin

class DashboardSummary(FreshnessMixin):
    occupancy_percentage: float
    capacity: CapacitySummary
    beds: List[BedDashboardRow]
    emergency_demand: EmergencyDemand

def calculate_eta(state: BedState) -> Optional[int]:
    # Simple deterministic operational estimate
    etas = {
        BedState.CLEANING: 15,
        BedState.DISCHARGE_PREP: 30,
        BedState.AVAILABLE: 0,
        BedState.OCCUPIED: None,
        BedState.CLINICAL_REVIEW: 45
    }
    return etas.get(state)

def map_readiness(state: BedState) -> str:
    if state == BedState.AVAILABLE:
        return "AVAILABLE"
    elif state == BedState.DISCHARGE_PREP:
        return "READY"
    elif state == BedState.CLINICAL_REVIEW:
        return "REVIEW"
    elif state == BedState.CLEANING:
        return "EXITED"
    return "OCCUPIED"

def map_turnover(state: BedState) -> str:
    if state == BedState.CLEANING:
        return "Cleaning"
    elif state == BedState.DISCHARGE_PREP:
        return "Order Pending"
    elif state == BedState.AVAILABLE:
        return "Complete"
    return "—"

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    beds = db.query(Bed).all()
    
    total = len(beds)
    occupied = sum(1 for b in beds if b.state == BedState.OCCUPIED)
    ready = sum(1 for b in beds if b.state == BedState.DISCHARGE_PREP)
    turnover = sum(1 for b in beds if b.state == BedState.CLEANING)
    available = sum(1 for b in beds if b.state == BedState.AVAILABLE)
    
    bed_rows = []
    for bed in beds:
        fresh_state = freshness_service.calculate_freshness(bed.updated_at)
        
        eta = calculate_eta(bed.state)
        # If stale, ETA is unreliable
        if fresh_state == FreshnessState.STALE:
            eta = None
            
        blocker = "—"
        if fresh_state == FreshnessState.STALE:
            blocker = "Data stale — human verification required"
        elif fresh_state == FreshnessState.MISSING:
            blocker = "Data missing"
        elif bed.state == BedState.CLEANING:
            blocker = "Cleaning"
        elif bed.state == BedState.DISCHARGE_PREP:
            blocker = "Discharge Order"
            
        bed_rows.append(BedDashboardRow(
            bed_id=bed.name,
            ward=bed.ward.name if bed.ward else "UNKNOWN",
            readiness=map_readiness(bed.state),
            turnover=map_turnover(bed.state),
            freshness=fresh_state.value,
            eta_minutes=eta,
            blocker=blocker
        ))
        
    from app.schemas.freshness import calculate_freshness
    freshness_info = calculate_freshness()
    
    return DashboardSummary(
        occupancy_percentage=(occupied/total*100) if total > 0 else 0.0,
        capacity=CapacitySummary(
            total=total,
            occupied=occupied,
            ready=ready,
            turnover=turnover,
            available=available
        ),
        beds=bed_rows,
        # Mocking emergency demand since it comes from an external/different source conceptually
        emergency_demand=EmergencyDemand(
            critical=2,
            urgent=5,
            routine=8
        ),
        **freshness_info
    )


@router.get("/occupancy-trend", response_model=List[OccupancyTrendPoint])
def get_occupancy_trend(days: int = 7, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from datetime import datetime, timedelta, date
    today = date.today()
    trend = []
    
    for i in range(days):
        d = today - timedelta(days=i)
        
        end_of_day = datetime.combine(d, datetime.max.time())
        # To reconstruct, for each bed find the last state event before end_of_day
        beds = db.query(Bed).all()
        occupied = 0
        available = 0
        cleaning = 0
        total = len(beds)
        for b in beds:
            last_event = db.query(BedStateEvent).filter(
                BedStateEvent.bed_id == b.id,
                BedStateEvent.timestamp <= end_of_day
            ).order_by(BedStateEvent.timestamp.desc()).first()
            
            state = last_event.new_state if last_event else b.state
            if state == BedState.OCCUPIED:
                occupied += 1
            elif state == BedState.AVAILABLE:
                available += 1
            elif state == BedState.CLEANING:
                cleaning += 1
                
        occ_pct = (occupied / total * 100) if total > 0 else 0.0
        trend.append(OccupancyTrendPoint(
            date=d,
            occupied=occupied,
            available=available,
            cleaning=cleaning,
            total=total,
            occupancy_percentage=occ_pct
        ))
    
    return trend

@router.get("/flow", response_model=List[FlowTrendPoint])
def get_flow_trend(days: int = 7, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from datetime import datetime, timedelta, date
    today = date.today()
    trend = []
    for i in range(days):
        d = today - timedelta(days=i)
        start_of_day = datetime.combine(d, datetime.min.time())
        end_of_day = datetime.combine(d, datetime.max.time())
        
        admissions = db.query(func.count(Encounter.id)).filter(
            Encounter.created_at >= start_of_day,
            Encounter.created_at <= end_of_day
        ).scalar() or 0
        
        discharges = db.query(func.count(DischargeEvent.id)).filter(
            DischargeEvent.timestamp >= start_of_day,
            DischargeEvent.timestamp <= end_of_day
        ).scalar() or 0
        
        trend.append(FlowTrendPoint(
            date=d,
            admissions=admissions,
            discharges=discharges
        ))
    return trend

@router.get("/turnover", response_model=TurnoverSummary)
def get_turnover(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    events = db.query(BedStateEvent).order_by(BedStateEvent.bed_id, BedStateEvent.timestamp).all()
    records = []
    
    current_cleaning_start = {}
    for ev in events:
        if ev.new_state == BedState.CLEANING:
            current_cleaning_start[ev.bed_id] = ev.timestamp
        elif ev.new_state == BedState.AVAILABLE and ev.bed_id in current_cleaning_start:
            start_t = current_cleaning_start.pop(ev.bed_id)
            end_t = ev.timestamp
            minutes = int((end_t - start_t).total_seconds() / 60)
            
            bed = db.query(Bed).filter(Bed.id == ev.bed_id).first()
            ward_name = bed.ward.name if bed and bed.ward else "UNKNOWN"
            
            records.append(TurnoverRecord(
                bed_id=ev.bed_id,
                ward_name=ward_name,
                discharge_time=start_t,
                available_time=end_t,
                turnover_minutes=minutes
            ))
            
    if not records:
        return TurnoverSummary(average_minutes=0.0, min_minutes=0, max_minutes=0, records=[])
        
    mins = [r.turnover_minutes for r in records]
    
    return TurnoverSummary(
        average_minutes=sum(mins) / len(mins),
        min_minutes=min(mins),
        max_minutes=max(mins),
        records=records
    )

@router.get("/alerts", response_model=List[OperationalAlert])
def get_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alerts = []
    
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    
    cleaning_beds = db.query(Bed).filter(Bed.state == BedState.CLEANING).all()
    for b in cleaning_beds:
        last_ev = db.query(BedStateEvent).filter(
            BedStateEvent.bed_id == b.id,
            BedStateEvent.new_state == BedState.CLEANING
        ).order_by(BedStateEvent.timestamp.desc()).first()
        
        if last_ev:
            ts = last_ev.timestamp
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            mins_in_cleaning = (now - ts).total_seconds() / 60
            if mins_in_cleaning > 60:
                alerts.append(OperationalAlert(
                    severity="WARNING",
                    type="CLEANING_DELAY",
                    message=f"Bed {b.name} has been in cleaning for {int(mins_in_cleaning)} minutes.",
                    timestamp=now
                ))
                
    beds = db.query(Bed).all()
    total = len(beds)
    occupied = sum(1 for b in beds if b.state == BedState.OCCUPIED)
    occ_pct = (occupied / total * 100) if total > 0 else 0
    if occ_pct > 80:
        alerts.append(OperationalAlert(
            severity="WARNING",
            type="HIGH_OCCUPANCY",
            message=f"Hospital occupancy is currently at {occ_pct:.1f}%.",
            timestamp=now
        ))
        
    return alerts
