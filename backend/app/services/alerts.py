import logging
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional
from app.models.notification import Notification

logger = logging.getLogger(__name__)

def generate_alert(
    db: Session,
    title: str,
    message: str,
    severity: str,
    category: str,
    related_entity: str = None,
    related_id: int = None
) -> Optional[Notification]:
    """
    Generates a smart operational alert with strict deduplication logic.
    Only one unresolved alert of the same category and related_entity/id is permitted.
    """
    try:
        # Deduplication check
        existing = db.execute(
            select(Notification).where(
                Notification.category == category,
                Notification.related_entity == related_entity,
                Notification.related_id == related_id,
                Notification.status.in_(['NEW', 'READ', 'ACKNOWLEDGED'])
            )
        ).scalars().first()
        
        if existing:
            # We don't spam duplicate alerts.
            logger.info(f"Alert deduplicated: {category} for {related_entity}_{related_id}")
            return existing
            
        new_alert = Notification(
            title=title,
            message=message,
            severity=severity,
            category=category,
            related_entity=related_entity,
            related_id=related_id,
            status='NEW'
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        
        # In a full run, we would emit a WebSocket broadcast here
        # manager.broadcast({"type": "notification.created", "data": ...})
        return new_alert
    except Exception as e:
        db.rollback()
        logger.error(f"Error generating alert: {e}")
        return None
