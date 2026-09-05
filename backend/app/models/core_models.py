from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)

class EquipmentState(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    IN_USE = "IN_USE"
    CLEANING = "CLEANING"
    MAINTENANCE = "MAINTENANCE"
    RETIRED = "RETIRED"

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    state = Column(SQLEnum(EquipmentState), default=EquipmentState.AVAILABLE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class IncidentStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVATING = "ACTIVATING"
    ACTIVE = "ACTIVE"
    CONTAINMENT = "CONTAINMENT"
    DEESCALATING = "DEESCALATING"
    RECOVERY = "RECOVERY"
    CLOSED = "CLOSED"

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    priority = Column(String)
    description = Column(String)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    status = Column(SQLEnum(IncidentStatus), default=IncidentStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
