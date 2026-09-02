from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.control_tower import (
    ControlTowerSummary,
    ControlTowerBed,
    ControlTowerWard,
    ControlTowerQueueItem,
    ControlTowerActivity,
    ControlTowerTrendPoint,
    ControlTowerPriority,
    ControlTowerResponse
)
from app.services import control_tower_service

router = APIRouter()

@router.get("/summary", response_model=ControlTowerResponse)
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_control_tower_summary(db)
    return ControlTowerResponse(success=True, message="Success", data=data.model_dump())

@router.get("/bed-board", response_model=ControlTowerResponse)
def get_bed_board(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_live_bed_board(db)
    return ControlTowerResponse(success=True, message="Success", data={"beds": [d.model_dump() for d in data]})

@router.get("/ward-control", response_model=ControlTowerResponse)
def get_ward_control(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_ward_control(db)
    return ControlTowerResponse(success=True, message="Success", data={"wards": [d.model_dump() for d in data]})

@router.get("/attention", response_model=ControlTowerResponse)
def get_attention(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_operational_attention(db)
    return ControlTowerResponse(success=True, message="Success", data={"attention_beds": [d.model_dump() for d in data]})

@router.get("/queue", response_model=ControlTowerResponse)
def get_queue(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_control_tower_queue(db)
    return ControlTowerResponse(success=True, message="Success", data={"queue": [d.model_dump() for d in data]})

@router.get("/activity", response_model=ControlTowerResponse)
def get_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_recent_activity(db)
    return ControlTowerResponse(success=True, message="Success", data={"activity": [d.model_dump() for d in data]})

@router.get("/trends", response_model=ControlTowerResponse)
def get_trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_control_tower_trends(db)
    return ControlTowerResponse(success=True, message="Success", data={"trends": [d.model_dump() for d in data]})

@router.get("/changes", response_model=ControlTowerResponse)
def get_changes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_recent_changes(db)
    return ControlTowerResponse(success=True, message="Success", data={"changes": [d.model_dump() for d in data]})

@router.get("/priorities", response_model=ControlTowerResponse)
def get_priorities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = control_tower_service.get_control_tower_priorities(db)
    return ControlTowerResponse(success=True, message="Success", data={"priorities": [d.model_dump() for d in data]})

@router.post("/{path:path}")
@router.put("/{path:path}")
@router.delete("/{path:path}")
@router.patch("/{path:path}")
def prevent_mutations(path: str):
    raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Mutations not allowed on Control Tower")
