from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime

class AuditLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    module: str
    previous_state: Optional[Dict[str, Any]] = None
    new_state: Optional[Dict[str, Any]] = None
    details: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    user_id: Optional[int] = None

class AuditLogResponse(AuditLogBase):
    id: int
    user_id: Optional[int]
    created_at: datetime

    class Config:
        orm_mode = True

class AuditLogListResponse(BaseModel):
    total: int
    items: List[AuditLogResponse]

class AuditSummary(BaseModel):
    module: str
    action: str
    count: int
