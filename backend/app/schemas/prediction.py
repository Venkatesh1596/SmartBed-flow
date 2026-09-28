from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BedAvailabilityPrediction(BaseModel):
    bed_id: int
    predicted_available_at: datetime
    confidence_score: float

class BottleneckAlert(BaseModel):
    department: str
    severity: str
    description: str

class OperationalRecommendation(BaseModel):
    action: str
    reason: str

from app.schemas.freshness import FreshnessMixin

class PredictionSummary(FreshnessMixin):
    total_beds_predicted_available: int
    active_bottlenecks: int
    recommendations_count: int

class PredictionResponse(BaseModel):
    summary: PredictionSummary
    bed_availability: List[BedAvailabilityPrediction]
    bottlenecks: List[BottleneckAlert]
    recommendations: List[OperationalRecommendation]
