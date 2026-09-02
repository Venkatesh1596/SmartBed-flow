from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api.deps import get_db, get_current_user, RoleChecker
from app.models.user import User
from app.schemas.encounter import EncounterCreate, EncounterResponse, EncounterStatus
from app.models.encounter import Encounter
from app.models.facility import Bed
from app.models.enums import BedState
from app.models.event import BedStateEvent, ClinicalEvent, DischargeEvent

router = APIRouter()

@router.get("/", response_model=List[EncounterResponse])
def get_encounters(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Encounter).all()

@router.get("/{encounter_id}", response_model=EncounterResponse)
def get_encounter(encounter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")
    return encounter

@router.post("/", response_model=EncounterResponse)
def create_encounter(encounter_in: EncounterCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bed = db.query(Bed).filter(Bed.id == encounter_in.bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    if bed.state != BedState.AVAILABLE:
        raise HTTPException(status_code=400, detail="Bed is not AVAILABLE")
    
    # create encounter
    new_encounter = Encounter(**encounter_in.model_dump(), status=EncounterStatus.ACTIVE)
    db.add(new_encounter)
    
    # Update bed state
    event = BedStateEvent(bed_id=bed.id, old_state=bed.state, new_state=BedState.OCCUPIED, type="bed_state_event")
    db.add(event)
    bed.state = BedState.OCCUPIED
    
    db.commit()
    db.refresh(new_encounter)
    return new_encounter

@router.put("/{encounter_id}/discharge", response_model=EncounterResponse)
def discharge_encounter(encounter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")
    
    if encounter.status == EncounterStatus.DISCHARGED:
        raise HTTPException(status_code=400, detail="Encounter is already discharged")
        
    encounter.status = EncounterStatus.DISCHARGED
    encounter.discharged_at = datetime.utcnow()
    
    bed = db.query(Bed).filter(Bed.id == encounter.bed_id).first()
    if bed:
        event = BedStateEvent(bed_id=bed.id, old_state=bed.state, new_state=BedState.CLEANING, type="bed_state_event")
        db.add(event)
        bed.state = BedState.CLEANING
    
    # Create Discharge event
    discharge_event = DischargeEvent(encounter_id=encounter.id, readiness_score=100, type="discharge_event")
    db.add(discharge_event)
    
    db.commit()
    db.refresh(encounter)
    return encounter
