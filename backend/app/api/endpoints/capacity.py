from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.capacity import (
    CapacitySummary,
    WardCapacity,
    AvailableSoonBed,
    CapacityTrendPoint,
    CapacityPriority
)
from app.services.capacity_service import CapacityService

router = APIRouter()

@router.get("/summary", response_model=CapacitySummary)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CapacityService(db)
    return service.get_facility_summary()

@router.get("/wards", response_model=List[WardCapacity])
def get_wards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CapacityService(db)
    return service.get_ward_summaries()

@router.get("/available-soon", response_model=List[AvailableSoonBed])
def get_available_soon(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CapacityService(db)
    return service.get_available_soon_beds()

@router.get("/trends", response_model=List[CapacityTrendPoint])
def get_trends(
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CapacityService(db)
    try:
        return service.get_historical_trends(start_date, end_date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/priorities", response_model=CapacityPriority)
def get_priorities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CapacityService(db)
    return service.get_priorities()

@router.get("/pressure")
def get_pressure(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CapacityService(db)
    return {"pressure_score": service.get_pressure_score()}
