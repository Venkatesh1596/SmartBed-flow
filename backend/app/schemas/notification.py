from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: int
    notification_type: str
    severity: str
    title: str
    message: str
    entity_type: str
    entity_id: int
    is_read: bool = False

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationSummary(BaseModel):
    total: int
    unread: int

class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    summary: NotificationSummary

class NotificationMarkReadRequest(BaseModel):
    is_read: bool = True
