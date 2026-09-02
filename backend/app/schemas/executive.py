from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class PerformanceTrendPoint(BaseModel):
    timestamp: datetime
    value: float
    target: float

class PerformanceComparison(BaseModel):
    current_value: float
    previous_value: float
    percentage_change: float
    trend: str # "up", "down", "stable"

class ExecutivePriority(BaseModel):
    priority_level: str # "high", "medium", "low"
    area: str
    description: str
    recommended_action: str

class OperationalAttention(BaseModel):
    ward_id: str
    ward_name: str
    attention_score: float
    reasons: List[str]

class WardPerformance(BaseModel):
    ward_id: str
    ward_name: str
    occupancy_rate: float
    avg_turnaround_time: float
    sla_compliance_rate: float
    critical_incidents: int
    operational_index: float

class FacilityPerformance(BaseModel):
    facility_id: str
    facility_name: str
    total_beds: int
    occupied_beds: int
    overall_occupancy_rate: float
    overall_operational_index: float
    wards: List[WardPerformance]

class ExecutiveSummary(BaseModel):
    generated_at: datetime
    facilities: List[FacilityPerformance]
    top_priorities: List[ExecutivePriority]
    areas_requiring_attention: List[OperationalAttention]
    trends: Dict[str, List[PerformanceTrendPoint]]
    comparisons: Dict[str, PerformanceComparison]
