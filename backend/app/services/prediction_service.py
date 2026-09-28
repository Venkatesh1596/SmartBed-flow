from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.models.event import BedStateEvent
from app.models.encounter import Encounter
from app.models.enums import BedState
from app.schemas.prediction import (
    BedAvailabilityPrediction,
    BottleneckAlert,
    OperationalRecommendation,
    PredictionSummary,
    PredictionResponse
)

class PredictionService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_historical_cleaning_duration(self) -> timedelta:
        events = self.db.query(BedStateEvent).order_by(BedStateEvent.bed_id, BedStateEvent.timestamp).all()
        durations = []
        last_cleaning_time = {}
        for event in events:
            if event.new_state == BedState.CLEANING:
                last_cleaning_time[event.bed_id] = event.timestamp
            elif event.new_state == BedState.AVAILABLE and event.bed_id in last_cleaning_time:
                durations.append(event.timestamp - last_cleaning_time[event.bed_id])
                del last_cleaning_time[event.bed_id]
        
        if durations:
            return sum(durations, timedelta()) / len(durations)
        return timedelta(hours=1)

    def calculate_historical_occupancy_duration(self) -> timedelta:
        encounters = self.db.query(Encounter).filter(Encounter.discharged_at.isnot(None)).all()
        durations = [e.discharged_at - e.created_at for e in encounters if e.discharged_at and e.created_at]
        if durations:
            return sum(durations, timedelta()) / len(durations)
        return timedelta(days=3)

    def get_bed_availability_predictions(self) -> List[BedAvailabilityPrediction]:
        cleaning_duration = self.calculate_historical_cleaning_duration()
        
        latest_states = {}
        all_events = self.db.query(BedStateEvent).order_by(BedStateEvent.timestamp.desc()).all()
        for e in all_events:
            if e.bed_id not in latest_states:
                latest_states[e.bed_id] = e
        
        predictions = []
        for bed_id, event in latest_states.items():
            if event.new_state == BedState.CLEANING:
                predicted_time = event.timestamp + cleaning_duration
                predictions.append(
                    BedAvailabilityPrediction(
                        bed_id=bed_id,
                        predicted_available_at=predicted_time,
                        confidence_score=0.85
                    )
                )
            elif event.new_state == BedState.OCCUPIED:
                occupancy_dur = self.calculate_historical_occupancy_duration()
                predicted_time = event.timestamp + occupancy_dur
                predictions.append(
                    BedAvailabilityPrediction(
                        bed_id=bed_id,
                        predicted_available_at=predicted_time,
                        confidence_score=0.60
                    )
                )
        return predictions

    def get_bottlenecks(self) -> List[BottleneckAlert]:
        alerts = []
        latest_states = {}
        all_events = self.db.query(BedStateEvent).order_by(BedStateEvent.timestamp.desc()).all()
        for e in all_events:
            if e.bed_id not in latest_states:
                latest_states[e.bed_id] = e
        
        cleaning_count = sum(1 for e in latest_states.values() if e.new_state == BedState.CLEANING)
        if cleaning_count >= 2:
            alerts.append(BottleneckAlert(
                department="Housekeeping",
                severity="HIGH",
                description=f"{cleaning_count} beds currently waiting for cleaning."
            ))
            
        return alerts

    def get_recommendations(self) -> List[OperationalRecommendation]:
        recs = []
        bottlenecks = self.get_bottlenecks()
        for b in bottlenecks:
            if b.department == "Housekeeping":
                recs.append(OperationalRecommendation(
                    action="Assign more staff to housekeeping",
                    reason="High number of beds waiting for cleaning"
                ))
        
        if not recs:
            recs.append(OperationalRecommendation(
                action="Continue normal operations",
                reason="No active bottlenecks"
            ))
            
        return recs

    def get_summary(self) -> PredictionSummary:
        avail = self.get_bed_availability_predictions()
        bottlenecks = self.get_bottlenecks()
        recs = self.get_recommendations()
        
        from app.schemas.freshness import calculate_freshness
        freshness_info = calculate_freshness()
        
        return PredictionSummary(
            total_beds_predicted_available=len(avail),
            active_bottlenecks=len(bottlenecks),
            recommendations_count=len(recs),
            **freshness_info
        )
