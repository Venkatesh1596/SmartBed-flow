from enum import Enum
from datetime import datetime, timezone

class FreshnessState(str, Enum):
    FRESH = "FRESH"
    AGING = "AGING"
    STALE = "STALE"
    MISSING = "MISSING"

class FreshnessConfig:
    def __init__(self, aging_threshold_minutes: int = 30, stale_threshold_minutes: int = 120):
        self.aging_threshold_minutes = aging_threshold_minutes
        self.stale_threshold_minutes = stale_threshold_minutes

class FreshnessService:
    def __init__(self, config: FreshnessConfig):
        self.config = config
        
    def calculate_freshness(self, last_event_time: datetime | None) -> FreshnessState:
        if not last_event_time:
            return FreshnessState.MISSING
            
        now = datetime.now(timezone.utc)
        if last_event_time.tzinfo is None:
            last_event_time = last_event_time.replace(tzinfo=timezone.utc)
            
        age = now - last_event_time
        age_minutes = age.total_seconds() / 60
        
        if age_minutes >= self.config.stale_threshold_minutes:
            return FreshnessState.STALE
        elif age_minutes >= self.config.aging_threshold_minutes:
            return FreshnessState.AGING
        else:
            return FreshnessState.FRESH

# Default instance
default_freshness_config = FreshnessConfig()
freshness_service = FreshnessService(default_freshness_config)
