from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from .enums import UrgencyLevel, BedState

class HospitalEvent(Base):
    __tablename__ = "hospital_events"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSON)
    
    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'hospital_event'
    }

class ClinicalEvent(HospitalEvent):
    __tablename__ = "clinical_events"
    id = Column(Integer, ForeignKey("hospital_events.id"), primary_key=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"))
    urgency = Column(SQLEnum(UrgencyLevel))
    notes = Column(Text)
    
    __mapper_args__ = {
        'polymorphic_identity': 'clinical_event'
    }

class DischargeEvent(HospitalEvent):
    __tablename__ = "discharge_events"
    id = Column(Integer, ForeignKey("hospital_events.id"), primary_key=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"))
    readiness_score = Column(Integer)
    
    __mapper_args__ = {
        'polymorphic_identity': 'discharge_event'
    }

class CleaningEvent(HospitalEvent):
    __tablename__ = "cleaning_events"
    id = Column(Integer, ForeignKey("hospital_events.id"), primary_key=True)
    bed_id = Column(Integer, ForeignKey("beds.id"))
    staff_id = Column(Integer, ForeignKey("users.id"))
    
    __mapper_args__ = {
        'polymorphic_identity': 'cleaning_event'
    }

class BedStateEvent(HospitalEvent):
    __tablename__ = "bed_state_events"
    id = Column(Integer, ForeignKey("hospital_events.id"), primary_key=True)
    bed_id = Column(Integer, ForeignKey("beds.id"))
    old_state = Column(SQLEnum(BedState))
    new_state = Column(SQLEnum(BedState))
    
    __mapper_args__ = {
        'polymorphic_identity': 'bed_state_event'
    }
