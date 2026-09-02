from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.notification import Notification
from app.models.user import User
from app.services.sla_service import get_workflows, SLAStatus
from datetime import datetime

class NotificationService:
    def get_notifications(self, db: Session, user_id: int):
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    def get_unread_count(self, db: Session, user_id: int):
        return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()

    def generate_notifications(self, db: Session):
        users = db.query(User).all()
        # For SLAs
        workflows = get_workflows(db)
        for w in workflows:
            if w.status in (SLAStatus.OVERDUE, SLAStatus.CRITICAL):
                severity = "CRITICAL" if w.status == SLAStatus.CRITICAL else "WARNING"
                title = f"{w.workflow_type} SLA {severity}"
                message = f"Workflow {w.workflow_type} is {severity.lower()} (elapsed: {w.elapsed_minutes}m, target: {w.target_minutes}m)."
                for u in users:
                    self._create_notification_if_not_exists(
                        db,
                        user_id=u.id,
                        notif_type="SLA_ALERT",
                        severity=severity,
                        title=title,
                        message=message,
                        entity_type=w.workflow_type,
                        entity_id=w.bed_id if w.bed_id else (w.encounter_id if hasattr(w, 'encounter_id') else 0)
                    )

    def _create_notification_if_not_exists(self, db: Session, user_id: int, notif_type: str, severity: str, title: str, message: str, entity_type: str, entity_id: int):
        existing = db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.notification_type == notif_type,
            Notification.entity_type == entity_type,
            Notification.entity_id == entity_id
        ).first()
        
        if not existing:
            notif = Notification(
                user_id=user_id,
                notification_type=notif_type,
                severity=severity,
                title=title,
                message=message,
                entity_type=entity_type,
                entity_id=entity_id,
                is_read=False
            )
            db.add(notif)
            db.commit()
            db.refresh(notif)
            return notif
        return None

    def mark_read(self, db: Session, notification_id: int, user_id: int):
        notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if notif and not notif.is_read:
            notif.is_read = True
            notif.read_at = func.now()
            db.commit()
        return notif

    def mark_all_read(self, db: Session, user_id: int):
        db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).update(
            {"is_read": True, "read_at": func.now()}
        )
        db.commit()

notification_service = NotificationService()
