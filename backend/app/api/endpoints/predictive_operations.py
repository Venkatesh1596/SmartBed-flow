from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.services.predictive_operations_service import PredictiveOperationsService
from app.schemas.predictive_operations import (
    PredictiveOperationsSummary, FacilityEarlyWarning, WardEarlyWarning,
    OperationalWarning, PredictivePriority, PredictiveRecommendation,
    PredictiveTrendPoint, CleaningRisk, DischargeAgingRisk, CapacityRisk,
    SLATrend, WorkflowTrend
)

router = APIRouter()

@router.get("/summary", response_model=PredictiveOperationsSummary)
def get_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_summary()

@router.get("/facility", response_model=FacilityEarlyWarning)
def get_facility(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_facility_warning()

@router.get("/wards", response_model=List[WardEarlyWarning])
def get_wards(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_ward_warnings()

@router.get("/warnings", response_model=List[OperationalWarning])
def get_warnings(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_warnings()

@router.get("/priorities", response_model=List[PredictivePriority])
def get_priorities(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_priorities()

@router.get("/recommendations", response_model=List[PredictiveRecommendation])
def get_recommendations(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_recommendations()

@router.get("/trends", response_model=List[PredictiveTrendPoint])
def get_trends(
    days: int = Query(7, ge=1, le=90),
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    service = PredictiveOperationsService(db)
    return service.get_trends(days)

@router.get("/cleaning-risk", response_model=CleaningRisk)
def get_cleaning_risk(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_cleaning_risk()

@router.get("/discharge-aging", response_model=DischargeAgingRisk)
def get_discharge_aging(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_discharge_aging()

@router.get("/capacity-risk", response_model=CapacityRisk)
def get_capacity_risk(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_capacity_risk()

@router.get("/sla-trend", response_model=SLATrend)
def get_sla_trend(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_sla_trend()

@router.get("/workflow-trend", response_model=WorkflowTrend)
def get_workflow_trend(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = PredictiveOperationsService(db)
    return service.get_workflow_trend()
