from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user, RoleChecker
from app.models.user import User
from app.schemas.facility import BedResponse, BedCreate, BedUpdate, BedStatusUpdate
from app.models.facility import Bed, Ward
from app.models.enums import BedState
from app.models.event import BedStateEvent

router = APIRouter()

@router.get("", response_model=List[BedResponse])
def get_beds(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Bed).all()

@router.get("/{bed_id}", response_model=BedResponse)
def get_bed(bed_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bed = db.query(Bed).filter(Bed.id == bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    return bed

@router.get("/{bed_id}/history")
def get_bed_history(bed_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    events = db.query(BedStateEvent).filter(BedStateEvent.bed_id == bed_id).order_by(BedStateEvent.timestamp.desc()).all()
    return events

@router.post("", response_model=BedResponse, dependencies=[Depends(RoleChecker(["ADMIN"]))])
def create_bed(bed_in: BedCreate, db: Session = Depends(get_db)):
    ward = db.query(Ward).filter(Ward.id == bed_in.ward_id).first()
    if not ward:
         raise HTTPException(status_code=404, detail="Ward not found")
    new_bed = Bed(**bed_in.model_dump())
    db.add(new_bed)
    db.commit()
    db.refresh(new_bed)
    return new_bed

@router.put("/{bed_id}", response_model=BedResponse, dependencies=[Depends(RoleChecker(["ADMIN"]))])
def update_bed(bed_id: int, bed_in: BedUpdate, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.id == bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    update_data = bed_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(bed, k, v)
    db.commit()
    db.refresh(bed)
    return bed

@router.put("/{bed_id}/status", response_model=BedResponse, dependencies=[Depends(RoleChecker(["ADMIN", "FACILITY_MANAGER"]))])
def update_bed_status(bed_id: int, status_in: BedStatusUpdate, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.id == bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    
    if bed.state != status_in.state:
        event = BedStateEvent(bed_id=bed.id, old_state=bed.state, new_state=status_in.state, type="bed_state_event")
        db.add(event)
        bed.state = status_in.state
        db.commit()
        db.refresh(bed)
        
    return bed
