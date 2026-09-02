from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from .enums import EncounterStatus

class Encounter(Base):
    __tablename__ = "encounters"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String, index=True)
    bed_id = Column(Integer, ForeignKey("beds.id"))
    status = Column(SQLEnum(EncounterStatus), default=EncounterStatus.ACTIVE)
    
    bed = relationship("Bed", back_populates="encounters")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    discharged_at = Column(DateTime(timezone=True), nullable=True)
