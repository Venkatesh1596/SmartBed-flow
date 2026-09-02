from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.enums import BedState, UrgencyLevel, EncounterStatus
from app.schemas.facility import BedBase, BedCreate, BedResponse

class UserBase(BaseModel):
    username: str
    email: str
    role_id: int

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
