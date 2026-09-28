from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class WorkloadCategory(str, Enum):
    NORMAL = "NORMAL"
    WATCH = "WATCH"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class WorkloadQueueType(str, Enum):
    SLA = "SLA"
    CAPACITY = "CAPACITY"
    WORKFLOW = "WORKFLOW"
    CLEANING = "CLEANING"
    PREDICTIVE = "PREDICTIVE"

class WorkloadPriority(BaseModel):
    score: float = Field(..., ge=0, le=100)
    category: WorkloadCategory
    sla_component: float
    capacity_component: float
    workflow_component: float
    cleaning_component: float
    predictive_component: float
    age_component: float

class WorkloadItem(BaseModel):
    id: str
    queue_type: WorkloadQueueType
    title: str
    description: str
    priority: WorkloadPriority
    created_at: datetime
    metadata_data: Dict[str, Any] = Field(default_factory=dict)

class WorkloadQueue(BaseModel):
    queue_type: WorkloadQueueType
    item_count: int
    avg_priority: float
    max_priority: float
    items: List[WorkloadItem] = Field(default_factory=list)

from app.schemas.freshness import FreshnessMixin

class WorkloadSummary(FreshnessMixin):
    total_items: int
    critical_items: int
    high_items: int
    avg_priority: float
    by_queue: Dict[str, int]

class WorkloadTrendPoint(BaseModel):
    timestamp: datetime
    total_items: int
    avg_priority: float

class WorkloadRecommendation(BaseModel):
    id: str
    action: str
    target_id: str
    priority_score: float
    description: str
    queue_type: WorkloadQueueType

class WorkloadDistribution(BaseModel):
    by_category: Dict[str, int]
    by_queue: Dict[str, int]
    by_ward: Dict[str, int]
