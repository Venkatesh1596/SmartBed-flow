from pydantic import BaseModel, Field
from typing import List, Optional

class AllocationCandidate(BaseModel):
    bed_id: int
    ward_id: int
    score: float = Field(..., ge=0, le=100)
    status_category: str  # e.g., "AVAILABLE", "AVAILABLE_SOON"

class WorkflowBlocker(BaseModel):
    bed_id: int
    blocker_type: str  # e.g., "SLA_OVERDUE", "CAPACITY_CRITICAL"
    description: str

class WardAllocationPressure(BaseModel):
    ward_id: int
    pressure_category: str  # NORMAL, BUSY, HIGH, CRITICAL

class OperationalQueueItem(BaseModel):
    priority: str  # CRITICAL, HIGH, WARNING, INFO
    task_type: str
    bed_id: Optional[int] = None
    description: str

class AllocationRecommendation(BaseModel):
    recommendation_text: str

class OrchestrationSummary(BaseModel):
    pressure_score: float = Field(..., ge=0, le=100)
    candidates_count: int
    blockers_count: int

class OrchestrationResponse(BaseModel):
    summary: OrchestrationSummary
    candidates: List[AllocationCandidate]
    blockers: List[WorkflowBlocker]
    ward_pressures: List[WardAllocationPressure]
    operational_queue: List[OperationalQueueItem]
    recommendations: List[AllocationRecommendation]
