from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class BenchmarkMetric(BaseModel):
    name: str = Field(..., description="Operational metric name")
    current_value: float
    previous_value: Optional[float] = None
    target_value: Optional[float] = None
    percentile: Optional[float] = None
    trend_direction: str = Field("neutral", description="up, down, or neutral")
    is_favorable: bool = True

class BenchmarkScore(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    occupancy_component: float = Field(..., ge=0, le=100)
    availability_component: float = Field(..., ge=0, le=100)
    turnover_component: float = Field(..., ge=0, le=100)
    sla_component: float = Field(..., ge=0, le=100)
    workflow_component: float = Field(..., ge=0, le=100)
    cleaning_component: float = Field(..., ge=0, le=100)
    capacity_component: float = Field(..., ge=0, le=100)
    predictive_component: float = Field(..., ge=0, le=100)
    workload_component: float = Field(..., ge=0, le=100)
    calculated_at: datetime

class BenchmarkDimension(BaseModel):
    name: str
    score: float = Field(..., ge=0, le=100)
    weight: float = Field(..., ge=0, le=1)
    metrics: List[BenchmarkMetric] = []

class PerformanceGap(BaseModel):
    area: str
    current_performance: float
    target_performance: float
    gap_magnitude: float
    impact_level: str = Field(..., description="high, medium, low")

class OptimizationOpportunity(BaseModel):
    title: str
    description: str
    potential_score_impact: float
    effort_required: str = Field(..., description="high, medium, low")
    recommended_actions: List[str]

class StrategicPriority(BaseModel):
    priority_level: int
    focus_area: str
    rationale: str
    target_timeline_days: int

class BenchmarkTrendPoint(BaseModel):
    timestamp: datetime
    score: float = Field(..., ge=0, le=100)
    dimensions: Dict[str, float]

class BenchmarkComparison(BaseModel):
    entity_id: str
    entity_name: str
    entity_type: str = Field(..., description="facility, ward, unit")
    overall_score: float
    percentile_rank: float
    dimensions: Dict[str, float]

class WardBenchmark(BaseModel):
    ward_id: str
    ward_name: str
    score: BenchmarkScore
    dimensions: List[BenchmarkDimension]
    gaps: List[PerformanceGap]
    rank: Optional[int] = None

class FacilityBenchmark(BaseModel):
    facility_id: str
    facility_name: str
    score: BenchmarkScore
    dimensions: List[BenchmarkDimension]
    gaps: List[PerformanceGap]
    opportunities: List[OptimizationOpportunity]
    priorities: List[StrategicPriority]
    percentile_rank: Optional[float] = None

class BenchmarkSummary(BaseModel):
    facility: FacilityBenchmark
    top_performing_wards: List[WardBenchmark]
    wards_needing_attention: List[WardBenchmark]
    trends: List[BenchmarkTrendPoint]
    comparison_period_days: int
