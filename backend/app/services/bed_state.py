from datetime import datetime, timezone
from sqlalchemy.orm import Session
# The subagent is creating models. We will import them later.
# We will use string representations for now in our maps to avoid circular imports before models exist.

VALID_TRANSITIONS = {
    "OCCUPIED": ["CLINICAL_REVIEW", "DISCHARGE_LIKELY", "CLINICALLY_READY"],
    "CLINICAL_REVIEW": ["DISCHARGE_LIKELY", "CLINICALLY_READY", "OCCUPIED"],
    "DISCHARGE_LIKELY": ["CLINICALLY_READY", "OCCUPIED"],
    "CLINICALLY_READY": ["DISCHARGE_ORDER_PENDING", "DISCHARGE_IN_PROGRESS", "OCCUPIED"],
    "DISCHARGE_ORDER_PENDING": ["DISCHARGE_IN_PROGRESS", "OCCUPIED"],
    "DISCHARGE_IN_PROGRESS": ["PATIENT_EXITED", "OCCUPIED"],
    "PATIENT_EXITED": ["CLEANING_PENDING", "CLEANING_IN_PROGRESS"],
    "CLEANING_PENDING": ["CLEANING_IN_PROGRESS", "BLOCKED"],
    "CLEANING_IN_PROGRESS": ["CLEANING_COMPLETED", "BLOCKED"],
    "CLEANING_COMPLETED": ["SAFETY_VERIFICATION", "BLOCKED"],
    "SAFETY_VERIFICATION": ["SAFE_AVAILABLE", "BLOCKED"],
    "SAFE_AVAILABLE": ["OCCUPIED", "BLOCKED"],
    "BLOCKED": ["SAFE_AVAILABLE", "CLEANING_PENDING"] # depending on reason
}

class BedStateMachineService:
    def validate_transition(self, current_state: str, new_state: str) -> bool:
        if current_state == new_state:
            return True # No transition
        allowed = VALID_TRANSITIONS.get(current_state, [])
        return new_state in allowed

    def update_bed_state(self, db: Session, bed_id: int, new_state: str, source: str, reason: str = None) -> bool:
        from app.models.facility import Bed
        from app.models.event import BedStateEvent
        
        bed = db.query(Bed).filter(Bed.id == bed_id).first()
        if not bed:
            raise ValueError(f"Bed with ID {bed_id} not found.")
            
        current_state = bed.state
        
        if not self.validate_transition(current_state, new_state):
            raise ValueError(f"Invalid transition from {current_state} to {new_state}.")
            
        if current_state != new_state:
            # Record transition
            event = BedStateEvent(
                bed_id=bed_id,
                old_state=current_state,
                new_state=new_state,
                # timestamp=datetime.now(timezone.utc),  # Auto-generated server_default
                # source=source,
                # details={"reason": reason}
            )
            db.add(event)
            
            # Update bed
            bed.state = new_state
            # bed.updated_at = datetime.now(timezone.utc) # Auto-generated onupdate
            db.add(bed)
            db.commit()
            
        return True

bed_state_service = BedStateMachineService()
