from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
import math

def safe_float(v: float) -> float:
    if v is None:
        return 0.0
    if math.isnan(v) or math.isinf(v):
        return 0.0
    return v

class EarlyWarningScore(BaseModel):
    score: float = Field(..., ge=0, le=100)
    category: str  # Normal, Watch, Elevated, High

    @field_validator('score', mode='before')
    def validate_score(cls, v):
        return max(0.0, min(100.0, safe_float(v)))

class CleaningRisk(BaseModel):
    score: float = Field(..., ge=0, le=100)
    dirty_beds: int
    avg_cleaning_time: float

    @field_validator('score', 'avg_cleaning_time', mode='before')
    def validate_floats(cls, v):
        return safe_float(v)

class DischargeAgingRisk(BaseModel):
    score: float = Field(..., ge=0, le=100)
    delayed_discharges: int
    avg_delay_hours: float

    @field_validator('score', 'avg_delay_hours', mode='before')
    def validate_floats(cls, v):
        return safe_float(v)

class CapacityRisk(BaseModel):
    score: float = Field(..., ge=0, le=100)
    available_beds: int
    occupancy_rate: float

    @field_validator('score', 'occupancy_rate', mode='before')
    def validate_floats(cls, v):
        return safe_float(v)

class SLATrend(BaseModel):
    score: float = Field(..., ge=0, le=100)
    missed_slas: int
    compliance_rate: float

    @field_validator('score', 'compliance_rate', mode='before')
    def validate_floats(cls, v):
        return safe_float(v)

class WorkflowTrend(BaseModel):
    score: float = Field(..., ge=0, le=100)
    bottlenecks: int
    throughput_rate: float

    @field_validator('score', 'throughput_rate', mode='before')
    def validate_floats(cls, v):
        return safe_float(v)

class FacilityEarlyWarning(BaseModel):
    warning_score: EarlyWarningScore
    capacity_risk: CapacityRisk
    sla_trend: SLATrend
    cleaning_risk: CleaningRisk
    workflow_trend: WorkflowTrend

class WardEarlyWarning(BaseModel):
    ward_id: str
    ward_name: str
    warning_score: EarlyWarningScore
    capacity_risk: CapacityRisk
    cleaning_risk: CleaningRisk
    discharge_aging: DischargeAgingRisk

class PredictiveTrendPoint(BaseModel):
    timestamp: str
    score: float = Field(..., ge=0, le=100)

    @field_validator('score', mode='before')
    def validate_score(cls, v):
        return max(0.0, min(100.0, safe_float(v)))

class OperationalWarning(BaseModel):
    warning_id: str
    severity: str
    message: str
    affected_areas: List[str]

class PredictivePriority(BaseModel):
    priority_id: str
    level: str
    description: str
    impact_score: float = Field(..., ge=0, le=100)

    @field_validator('impact_score', mode='before')
    def validate_score(cls, v):
        return max(0.0, min(100.0, safe_float(v)))

class PredictiveRecommendation(BaseModel):
    recommendation_id: str
    action: str
    expected_benefit: str
    effort_level: str

class PredictiveOperationsSummary(BaseModel):
    facility_warning: FacilityEarlyWarning
    ward_warnings: List[WardEarlyWarning]
    active_warnings: List[OperationalWarning]
    top_priorities: List[PredictivePriority]
    recommendations: List[PredictiveRecommendation]
    trend_data: List[PredictiveTrendPoint]
