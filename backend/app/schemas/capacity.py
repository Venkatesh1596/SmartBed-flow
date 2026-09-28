from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.schemas.freshness import FreshnessMixin

class CapacitySummary(FreshnessMixin):
    model_config = ConfigDict(from_attributes=True)
    total_beds: int
    occupied_beds: int
    available_beds: int
    occupancy_rate: float

class WardCapacity(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    ward_id: int
    ward_name: str
    total_beds: int
    occupied_beds: int
    available_beds: int
    occupancy_rate: float

class AvailableSoonBed(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    bed_id: int
    bed_name: str
    ward_id: int
    ward_name: str
    available_in_hours: float
    confidence: float

class CapacityTrendPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    timestamp: datetime
    total_beds: int
    occupied_beds: int
    occupancy_rate: float

class CapacityPriority(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    level: str
    message: str
