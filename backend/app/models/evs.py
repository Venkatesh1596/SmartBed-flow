from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum

class EVSTaskStatus(str, enum.Enum):
    PENDING = 'PENDING'
    ACCEPTED = 'ACCEPTED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    QUALITY_CHECK = 'QUALITY_CHECK'
    READY = 'READY'
    CANCELLED = 'CANCELLED'

class EVSPriority(str, enum.Enum):
    URGENT = 'URGENT'
    HIGH = 'HIGH'
    NORMAL = 'NORMAL'
    LOW = 'LOW'

class EVSTask(Base):
    __tablename__ = 'evs_tasks'
    
    id = Column(Integer, primary_key=True, index=True)
    bed_id = Column(Integer, ForeignKey('beds.id'), index=True)
    encounter_id = Column(Integer, ForeignKey('encounters.id'), nullable=True)
    status = Column(SQLEnum(EVSTaskStatus), default=EVSTaskStatus.PENDING)
    priority = Column(SQLEnum(EVSPriority), default=EVSPriority.NORMAL)
    
    assigned_to = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    quality_checked_at = Column(DateTime(timezone=True), nullable=True)
    
    notes = Column(String, nullable=True)
