from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.services.prediction_service import PredictionService
from app.schemas.prediction import (
    BedAvailabilityPrediction,
    BottleneckAlert,
    OperationalRecommendation,
    PredictionSummary
)

router = APIRouter()

@router.get("/summary", response_model=PredictionSummary)
def get_predictions_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = PredictionService(db)
    return service.get_summary()

@router.get("/bed-availability", response_model=List[BedAvailabilityPrediction])
def get_bed_availability_predictions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = PredictionService(db)
    return service.get_bed_availability_predictions()

@router.get("/bottlenecks", response_model=List[BottleneckAlert])
def get_bottlenecks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = PredictionService(db)
    return service.get_bottlenecks()

@router.get("/recommendations", response_model=List[OperationalRecommendation])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = PredictionService(db)
    return service.get_recommendations()
