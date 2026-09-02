from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SyntheticEvent(BaseModel):
    event_id: str
    event_type: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = Field(default_factory=dict)

class PatientJourney(BaseModel):
    journey_id: str
    type: str
    patient_id: str
    bed_id: str
    events: List[SyntheticEvent]
    
class ValidationMetric(BaseModel):
    baseline_interval_minutes: Optional[float] = None
    smartbed_interval_minutes: Optional[float] = None
    improvement_percentage: Optional[float] = None
    
class JourneyAnalysis(BaseModel):
    journey_id: str
    is_missing_readiness: bool = False
    is_stale_cleaning: bool = False
    has_conflict_bed_state: bool = False
    metrics: ValidationMetric
    
class EvaluationSummary(BaseModel):
    total_journeys: int
    missing_readiness_count: int
    stale_cleaning_count: int
    conflict_bed_state_count: int
    average_improvement_percentage: Optional[float] = None
