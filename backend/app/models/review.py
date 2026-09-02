from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class HumanReview(Base):
    __tablename__ = "human_reviews"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("hospital_events.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    action_taken = Column(String)
    comments = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

