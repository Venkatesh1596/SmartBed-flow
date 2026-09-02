from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=True, index=True)
    entity_type = Column(String, nullable=True, index=True)
    entity_id = Column(Integer, nullable=True, index=True)
    changes = Column(JSON, nullable=True)
    created_at = Column("timestamp", DateTime(timezone=True), server_default=func.now())

    @property
    def module(self):
        return self.changes.get("module") if self.changes else None

    @property
    def previous_state(self):
        return self.changes.get("previous_state") if self.changes else None

    @property
    def new_state(self):
        return self.changes.get("new_state") if self.changes else None

    @property
    def details(self):
        return self.changes.get("details") if self.changes else None
