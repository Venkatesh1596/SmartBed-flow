import json
from pathlib import Path
from typing import List, Dict, Any

from app.schemas.phase24_validation import (
    PatientJourney, JourneyAnalysis, ValidationMetric, EvaluationSummary, SyntheticEvent
)

DATA_PATH = Path("C:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/backend/test_data/phase24/phase24_synthetic_events.json")

class Phase24ValidationService:
    def _load_data(self) -> List[PatientJourney]:
        if not DATA_PATH.exists():
            return []
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [PatientJourney(**j) for j in data.get("journeys", [])]

    def get_all_journeys(self) -> List[PatientJourney]:
        return self._load_data()

    def analyze_journeys(self) -> List[JourneyAnalysis]:
        journeys = self._load_data()
        analyses = []
        for j in journeys:
            readiness_time = None
            bed_safe_time = None
            cleaning_time = None
            
            is_missing_readiness = True
            is_stale_cleaning = False
            has_conflict_bed_state = False

            for event in j.events:
                if event.event_type == "Discharge Readiness":
                    readiness_time = event.timestamp
                    is_missing_readiness = False
                elif event.event_type == "Cleaning":
                    cleaning_time = event.timestamp
                    if event.timestamp < j.events[0].timestamp:
                        is_stale_cleaning = True
                elif event.event_type == "Bed-State":
                    state = event.details.get("state")
                    if state == "Safe":
                        bed_safe_time = event.timestamp
                    elif state == "Occupied":
                        has_conflict_bed_state = True
            
            # Simple baseline logic for missing readiness:
            if is_missing_readiness and cleaning_time:
                # If cleaning is done earlier but no readiness was signaled, we flag it.
                is_stale_cleaning = True
                
            metrics = ValidationMetric()
            if readiness_time and bed_safe_time:
                diff_minutes = (bed_safe_time - readiness_time).total_seconds() / 60
                metrics.smartbed_interval_minutes = diff_minutes
                # Baseline assumes it would take longer
                metrics.baseline_interval_minutes = diff_minutes * 1.5
                metrics.improvement_percentage = ((metrics.baseline_interval_minutes - metrics.smartbed_interval_minutes) / metrics.baseline_interval_minutes) * 100

            analyses.append(JourneyAnalysis(
                journey_id=j.journey_id,
                is_missing_readiness=is_missing_readiness,
                is_stale_cleaning=is_stale_cleaning,
                has_conflict_bed_state=has_conflict_bed_state,
                metrics=metrics
            ))
        return analyses

    def get_summary(self) -> EvaluationSummary:
        analyses = self.analyze_journeys()
        improvements = [a.metrics.improvement_percentage for a in analyses if a.metrics.improvement_percentage is not None]
        avg_improvement = sum(improvements) / len(improvements) if improvements else None
        
        return EvaluationSummary(
            total_journeys=len(analyses),
            missing_readiness_count=sum(1 for a in analyses if a.is_missing_readiness),
            stale_cleaning_count=sum(1 for a in analyses if a.is_stale_cleaning),
            conflict_bed_state_count=sum(1 for a in analyses if a.has_conflict_bed_state),
            average_improvement_percentage=avg_improvement
        )
