import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict

class SyntheticDataGenerator:
    def __init__(self, seed: int = 42):
        random.seed(seed)
        self.patient_seq = 10000
        self.encounter_seq = 20000

    def generate_patient_token(self) -> str:
        self.patient_seq += 1
        return f"P{self.patient_seq}"

    def generate_encounter_token(self) -> str:
        self.encounter_seq += 1
        return f"E{self.encounter_seq}"

    def generate_journey(self, start_time: datetime, urgency: str) -> List[Dict]:
        """
        Generates a sequence of events for a single encounter/bed turnover cycle.
        """
        events = []
        current_time = start_time
        
        # 1. ADMISSION
        events.append({
            "type": "ADMISSION",
            "time": current_time,
            "metadata": {"urgency": urgency}
        })
        
        # 2. CLINICAL_MILESTONE (1-3 days later)
        current_time += timedelta(hours=random.randint(24, 72))
        events.append({
            "type": "CLINICAL_MILESTONE",
            "time": current_time,
            "metadata": {"milestone": "Treatment Progressing"}
        })
        
        # 3. DISCHARGE_READINESS (12-24 hours later)
        current_time += timedelta(hours=random.randint(12, 24))
        events.append({
            "type": "DISCHARGE_READINESS",
            "time": current_time,
            "metadata": {"readiness": True}
        })
        
        # 4. DISCHARGE_ORDER (1-4 hours later)
        current_time += timedelta(hours=random.randint(1, 4))
        events.append({
            "type": "DISCHARGE_ORDER",
            "time": current_time,
            "metadata": {}
        })
        
        # 5. PATIENT_EXIT (2-6 hours later)
        current_time += timedelta(hours=random.randint(2, 6))
        events.append({
            "type": "PATIENT_EXIT",
            "time": current_time,
            "metadata": {}
        })
        
        # 6. CLEANING_REQUESTED (immediate to 1 hour later)
        current_time += timedelta(minutes=random.randint(5, 60))
        events.append({
            "type": "CLEANING_REQUESTED",
            "time": current_time,
            "metadata": {}
        })
        
        # 7. CLEANING_STARTED (10-60 mins later)
        current_time += timedelta(minutes=random.randint(10, 60))
        events.append({
            "type": "CLEANING_STARTED",
            "time": current_time,
            "metadata": {}
        })
        
        # 8. CLEANING_COMPLETED (30-90 mins later)
        current_time += timedelta(minutes=random.randint(30, 90))
        events.append({
            "type": "CLEANING_COMPLETED",
            "time": current_time,
            "metadata": {}
        })
        
        # 9. BED_VERIFIED (10-30 mins later)
        current_time += timedelta(minutes=random.randint(10, 30))
        events.append({
            "type": "BED_VERIFIED",
            "time": current_time,
            "metadata": {}
        })
        
        # 10. BED_AVAILABLE (immediate)
        current_time += timedelta(minutes=random.randint(1, 5))
        events.append({
            "type": "BED_AVAILABLE",
            "time": current_time,
            "metadata": {}
        })
        
        return events
