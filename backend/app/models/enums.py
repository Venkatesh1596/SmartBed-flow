import enum

class BedState(str, enum.Enum):
    OCCUPIED = "OCCUPIED"
    CLINICAL_REVIEW = "CLINICAL_REVIEW"
    DISCHARGE_PREP = "DISCHARGE_PREP"
    CLEANING = "CLEANING"
    AVAILABLE = "AVAILABLE"

class UrgencyLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    URGENT = "URGENT"
    ROUTINE = "ROUTINE"

class EncounterStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    DISCHARGED = "DISCHARGED"
    CANCELLED = "CANCELLED"
