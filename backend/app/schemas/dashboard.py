from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class OccupancyTrendPoint(BaseModel):
    date: date
    occupied: int
    available: int
    cleaning: int
    total: int
    occupancy_percentage: float

class FlowTrendPoint(BaseModel):
    date: date
    admissions: int
    discharges: int

class TurnoverRecord(BaseModel):
    bed_id: int
    ward_name: str
    discharge_time: datetime
    available_time: datetime
    turnover_minutes: int

class TurnoverSummary(BaseModel):
    average_minutes: float
    min_minutes: int
    max_minutes: int
    records: List[TurnoverRecord]

class OperationalAlert(BaseModel):
    severity: str
    type: str
    message: str
    timestamp: datetime
