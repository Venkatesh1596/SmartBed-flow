from pydantic import BaseModel
from typing import List, Optional

class WardOperationalSummary(BaseModel):
    ward_id: int
    ward_name: str
    total_beds: int
    available_beds: int
    occupied_beds: int
    cleaning_beds: int
    blocked_beds: int
    occupancy_percent: float
    active_encounters: int
    admissions_today: int
    discharges_today: int
    avg_turnover_minutes: float
    delayed_cleaning: int
    status: str

class BedPriority(BaseModel):
    bed_id: int
    bed_name: str
    ward_name: str
    state: str
    rank: str

class DischargeQueueItem(BaseModel):
    encounter_id: int
    patient_name: str
    bed_id: int
    bed_name: str
    ward_name: str
    elapsed_stay_hours: float

class CommandCenterPriority(BaseModel):
    id: int
    type: str
    level: str
    message: str

from app.schemas.freshness import FreshnessMixin

class CommandCenterSummary(FreshnessMixin):
    total_occupancy_percent: float
    total_available_beds: int
    total_active_encounters: int
    critical_alerts: int
    warning_alerts: int

class CommandCenterResponse(BaseModel):
    summary: CommandCenterSummary
    wards: List[WardOperationalSummary]
    priorities: List[CommandCenterPriority]
    discharge_queue: List[DischargeQueueItem]
