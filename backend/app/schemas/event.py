from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, Union
from datetime import datetime

class HospitalEventBase(BaseModel):
    type: str
    details: Optional[Dict[str, Any]] = None

class HospitalEventCreate(HospitalEventBase):
    pass

class HospitalEventUpdate(BaseModel):
    type: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class HospitalEventResponse(HospitalEventBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
