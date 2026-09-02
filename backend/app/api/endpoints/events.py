from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.services.bed_state import bed_state_service

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.event import HospitalEventResponse, HospitalEventCreate, HospitalEventUpdate
from app.models.event import HospitalEvent

router = APIRouter()

@router.get("/", response_model=List[HospitalEventResponse])
def get_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(HospitalEvent).order_by(HospitalEvent.timestamp.desc()).limit(100).all()

@router.post("/", response_model=HospitalEventResponse)
def create_event(event_in: HospitalEventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Basic synthetic event processor
    # For bed state changes we invoke the bed state machine service
    if event_in.type == "BED_STATE_CHANGED" and event_in.details:
        bed_id = event_in.details.get("bed_id")
        new_state = event_in.details.get("new_state")
        source = event_in.details.get("source", "system")
        try:
            if bed_id is not None and new_state is not None:
                bed_state_service.update_bed_state(db, bed_id, new_state, source)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    new_event = HospitalEvent(**event_in.model_dump())
    if not new_event.type:
        new_event.type = 'hospital_event'
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.put("/{event_id}", response_model=HospitalEventResponse)
def update_event(event_id: int, event_in: HospitalEventUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = db.query(HospitalEvent).filter(HospitalEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(event, k, v)
        
    db.commit()
    db.refresh(event)
    return event
