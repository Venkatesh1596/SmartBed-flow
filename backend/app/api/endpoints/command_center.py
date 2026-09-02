from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.schemas.command_center import (
    CommandCenterResponse,
    CommandCenterSummary,
    WardOperationalSummary,
    BedPriority,
    DischargeQueueItem,
    CommandCenterPriority
)
from app.services.command_center_service import get_command_center_data

router = APIRouter()

@router.get("/summary", response_model=CommandCenterSummary)
def get_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resp, _ = get_command_center_data(db)
    return resp.summary

@router.get("/wards", response_model=List[WardOperationalSummary])
def get_wards(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resp, _ = get_command_center_data(db)
    return resp.wards

@router.get("/bed-priority", response_model=List[BedPriority])
def get_bed_priority(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    _, beds = get_command_center_data(db)
    return beds

@router.get("/discharge-queue", response_model=List[DischargeQueueItem])
def get_discharge_queue(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resp, _ = get_command_center_data(db)
    return resp.discharge_queue

@router.get("/priorities", response_model=List[CommandCenterPriority])
def get_priorities(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resp, _ = get_command_center_data(db)
    return resp.priorities
