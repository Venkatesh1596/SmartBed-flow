from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.enums import BedState

class WardBase(BaseModel):
    name: str

class WardCreate(WardBase):
    pass

class WardResponse(WardBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BedBase(BaseModel):
    name: str
    ward_id: int
    state: BedState = BedState.AVAILABLE

class BedCreate(BedBase):
    pass

class BedUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[BedState] = None

class BedStatusUpdate(BaseModel):
    state: BedState

class BedResponse(BedBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
