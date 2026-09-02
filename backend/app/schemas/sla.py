from enum import Enum
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class SLAStatus(str, Enum):
    ON_TRACK = "ON_TRACK"
    APPROACHING_SLA = "APPROACHING_SLA"
    OVERDUE = "OVERDUE"
    CRITICAL = "CRITICAL"

class WorkflowSLA(BaseModel):
    workflow_type: str
    bed_id: Optional[int] = None
    encounter_id: Optional[int] = None
    start_time: datetime
    elapsed_minutes: int
    status: SLAStatus
    target_minutes: int
    
class SLASummary(BaseModel):
    on_track_count: int
    approaching_sla_count: int
    overdue_count: int
    critical_count: int

class SLAResponse(BaseModel):
    summary: SLASummary
    workflows: List[WorkflowSLA]
