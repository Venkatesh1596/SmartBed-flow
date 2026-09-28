from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

class JourneySimulator:
    @staticmethod
    def _create_event(name: str, current_time: datetime, duration_minutes: int) -> Dict[str, Any]:
        end_time = current_time + timedelta(minutes=duration_minutes)
        return {
            "step": name,
            "start": current_time.isoformat(),
            "end": end_time.isoformat(),
            "duration_minutes": duration_minutes
        }, end_time

    def generate_routine_discharge_journey(self, start_time: datetime = None) -> Dict[str, Any]:
        if not start_time:
            start_time = datetime.now(timezone.utc)
            
        timeline = []
        current = start_time
        
        steps = [
            ("Admission", 30),
            ("Clinical Milestones", 120),
            ("Discharge Readiness", 45),
            ("Human Review", 60),
            ("Physical Discharge", 30),
            ("Bed Cleaning Prep", 15),
            ("EVS Cleaning", 45),
            ("Quality Check", 15),
            ("Bed Available", 0),
            ("Next Patient Allocation", 15)
        ]
        
        for name, duration in steps:
            event, current = self._create_event(name, current, duration)
            timeline.append(event)
            
        total_time = int((current - start_time).total_seconds() / 60)
        
        return {
            "journey_type": "Routine Discharge",
            "START": start_time.isoformat(),
            "END": current.isoformat(),
            "TOTAL_TIME": total_time,
            "BOTTLENECK": "Human Review",
            "FINAL_SAFE_BED_AVAILABLE": timeline[-2]["start"],
            "timeline": timeline
        }

    def generate_surge_journey(self, start_time: datetime = None) -> Dict[str, Any]:
        if not start_time:
            start_time = datetime.now(timezone.utc)
            
        timeline = []
        current = start_time
        
        steps = [
            ("Surge Activation", 10),
            ("Capacity Pressure Assessment", 20),
            ("Discharge Readiness Accelerated", 30),
            ("Priority Adjustment", 15),
            ("Human Review", 45),
            ("Operational Coordination", 20),
            ("EVS Cleaning (Surge)", 30),
            ("Bed Availability", 0),
            ("Emergency Patient Allocation", 10)
        ]
        
        for name, duration in steps:
            event, current = self._create_event(name, current, duration)
            timeline.append(event)
            
        total_time = int((current - start_time).total_seconds() / 60)
        
        return {
            "journey_type": "Emergency / Surge",
            "START": start_time.isoformat(),
            "END": current.isoformat(),
            "TOTAL_TIME": total_time,
            "BOTTLENECK": "Human Review",
            "FINAL_SAFE_BED_AVAILABLE": timeline[-2]["start"],
            "timeline": timeline
        }
