from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from .enums import BedState

class Ward(Base):
    __tablename__ = "wards"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    beds = relationship("Bed", back_populates="ward")

class Bed(Base):
    __tablename__ = "beds"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    state = Column(SQLEnum(BedState), default=BedState.AVAILABLE)
    ward = relationship("Ward", back_populates="beds")
    encounters = relationship("Encounter", back_populates="bed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
