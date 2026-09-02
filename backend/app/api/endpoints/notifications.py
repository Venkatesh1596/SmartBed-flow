from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.api.deps import get_db, get_current_user
from app.schemas.notification import NotificationResponse, NotificationListResponse, NotificationSummary
from app.services.notification_service import notification_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=NotificationListResponse)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    notifications = notification_service.get_notifications(db, current_user.id)
    unread_count = notification_service.get_unread_count(db, current_user.id)
    return NotificationListResponse(
        items=notifications,
        summary=NotificationSummary(total=len(notifications), unread=unread_count)
    )

@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return {"unread_count": notification_service.get_unread_count(db, current_user.id)}

@router.post("/generate")
def generate_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Just trigger generation
    notification_service.generate_notifications(db)
    return {"status": "success"}

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    notif = notification_service.mark_read(db, notification_id, current_user.id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.put("/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    notification_service.mark_all_read(db, current_user.id)
    return {"status": "success"}
