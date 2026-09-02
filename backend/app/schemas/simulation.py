from pydantic import BaseModel, Field
from typing import List, Optional

class SimulationInput(BaseModel):
    staffing_multiplier: float = Field(1.0, ge=0.0, le=5.0)
    admission_surge: float = Field(1.0, ge=0.0, le=5.0)
    cleaning_efficiency: float = Field(1.0, ge=0.0, le=5.0)
    transfer_delay: float = Field(1.0, ge=0.0, le=5.0)
    discharge_volume: float = Field(1.0, ge=0.0, le=5.0)

class SimulationBaseline(BaseModel):
    occupancy_rate: float
    cleaning_pressure: float
    sla_pressure: float
    workflow_pressure: float
    early_warning_score: float
    operational_performance_index: float

class SimulationProjection(BaseModel):
    occupancy_rate: float
    cleaning_pressure: float
    sla_pressure: float
    workflow_pressure: float
    early_warning_score: float
    operational_performance_index: float

class SimulationDelta(BaseModel):
    occupancy_rate: float
    cleaning_pressure: float
    sla_pressure: float
    workflow_pressure: float
    early_warning_score: float
    operational_performance_index: float

class SimulationMetric(BaseModel):
    name: str
    baseline: float
    projected: float
    delta: float

class SimulationWarning(BaseModel):
    severity: str
    message: str
    metric: str

class SimulationRecommendation(BaseModel):
    action: str
    impact: str
    effort: str

class SimulationComparison(BaseModel):
    metrics: List[SimulationMetric]

class SimulationResult(BaseModel):
    scenario: SimulationInput
    baseline: SimulationBaseline
    projection: SimulationProjection
    delta: SimulationDelta
    comparison: SimulationComparison
    warnings: List[SimulationWarning]
    recommendations: List[SimulationRecommendation]

class ScenarioPreset(BaseModel):
    id: str
    name: str
    description: str
    inputs: SimulationInput

class SimulationSummary(BaseModel):
    available_presets: List[ScenarioPreset]
    current_baseline: SimulationBaseline
