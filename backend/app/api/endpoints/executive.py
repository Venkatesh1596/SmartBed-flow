from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.executive import (
    ExecutiveSummary,
    FacilityPerformance,
    WardPerformance,
    PerformanceTrendPoint,
    PerformanceComparison,
    OperationalAttention,
    ExecutivePriority
)
from app.services import executive_service

router = APIRouter()

@router.get("/summary", response_model=ExecutiveSummary)
def get_executive_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_executive_summary(db)

@router.get("/performance", response_model=FacilityPerformance)
def get_facility_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_facility_performance(db)

@router.get("/wards", response_model=List[WardPerformance])
def get_ward_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_ward_performance(db)

@router.get("/trends", response_model=Dict[str, List[PerformanceTrendPoint]])
def get_trends(
    period: str = Query("7d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_trends(db, period=period)

@router.get("/comparison", response_model=Dict[str, PerformanceComparison])
def get_comparison(
    period: str = Query("7d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_comparison(db, period=period)

@router.get("/attention", response_model=List[OperationalAttention])
def get_attention(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_operational_attention(db)

@router.get("/priorities", response_model=List[ExecutivePriority])
def get_priorities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return executive_service.get_priorities(db)
