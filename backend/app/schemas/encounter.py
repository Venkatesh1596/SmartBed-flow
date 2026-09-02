from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.enums import EncounterStatus

class EncounterBase(BaseModel):
    patient_name: str
    bed_id: int

class EncounterCreate(EncounterBase):
    pass

class EncounterResponse(EncounterBase):
    id: int
    status: EncounterStatus
    created_at: datetime
    discharged_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
