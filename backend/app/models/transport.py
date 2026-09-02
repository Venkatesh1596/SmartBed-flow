from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum

class TransportStatus(str, enum.Enum):
    REQUESTED = 'REQUESTED'
    QUEUED = 'QUEUED'
    ASSIGNED = 'ASSIGNED'
    ACCEPTED = 'ACCEPTED'
    IN_PROGRESS = 'IN_PROGRESS'
    ARRIVED = 'ARRIVED'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'

class TransportPriority(str, enum.Enum):
    ROUTINE = 'ROUTINE'
    PRIORITY = 'PRIORITY'
    URGENT = 'URGENT'
    STAT = 'STAT'

class TransportType(str, enum.Enum):
    WHEELCHAIR = 'WHEELCHAIR'
    STRETCHER = 'STRETCHER'
    WALKING_ASSIST = 'WALKING_ASSIST'
    BED_TRANSPORT = 'BED_TRANSPORT'
    ESCORT = 'ESCORT'
    OTHER_OPERATIONAL = 'OTHER_OPERATIONAL'

class TransportRequest(Base):
    __tablename__ = 'transport_requests'
    
    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey('encounters.id'), nullable=False)
    facility_id = Column(Integer, ForeignKey('facilities.id'), nullable=False)
    
    origin_location = Column(String, nullable=False)
    destination_location = Column(String, nullable=False)
    
    transport_type = Column(SQLEnum(TransportType), nullable=False)
    priority = Column(SQLEnum(TransportPriority), default=TransportPriority.ROUTINE)
    
    requested_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_porter_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    status = Column(SQLEnum(TransportStatus), default=TransportStatus.REQUESTED)
    
    required_equipment = Column(String, nullable=True)
    special_requirements = Column(String, nullable=True)
    
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    arrived_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
