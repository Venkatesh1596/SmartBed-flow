from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class LiveOperationalMetric(BaseModel):
    total_beds_system: int
    total_occupied_system: int
    system_occupancy_rate: float
    total_pending_admissions: int
    total_pending_discharges: int
    average_wait_time: float
    critical_alerts_count: int

    model_config = ConfigDict(from_attributes=True)

class ControlTowerWard(BaseModel):
    ward_id: int
    ward_name: str
    total_beds: int
    occupied_beds: int
    available_beds: int
    pending_admissions: int
    pending_discharges: int
    occupancy_rate: float

    model_config = ConfigDict(from_attributes=True)

class ControlTowerBed(BaseModel):
    bed_id: int
    status: str
    ward_name: str
    is_attention_needed: bool

    model_config = ConfigDict(from_attributes=True)

class ControlTowerAlert(BaseModel):
    alert_id: int
    severity: str
    message: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class ControlTowerQueueItem(BaseModel):
    item_id: int
    type: str
    status: str
    wait_time_minutes: int
    priority: str

    model_config = ConfigDict(from_attributes=True)

class ControlTowerActivity(BaseModel):
    activity_id: int
    action: str
    timestamp: datetime
    details: str

    model_config = ConfigDict(from_attributes=True)

class ControlTowerPriority(BaseModel):
    priority_id: int
    type: str
    description: str
    urgency_level: str

    model_config = ConfigDict(from_attributes=True)

class ControlTowerTrendPoint(BaseModel):
    timestamp: datetime
    occupancy_rate: float
    wait_time_avg: float

    model_config = ConfigDict(from_attributes=True)

class ControlTowerSummary(BaseModel):
    metrics: LiveOperationalMetric
    wards: List[ControlTowerWard]

    model_config = ConfigDict(from_attributes=True)

class ControlTowerResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: str

    model_config = ConfigDict(from_attributes=True)
