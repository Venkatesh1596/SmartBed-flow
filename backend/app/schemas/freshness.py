from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field

class FreshnessMixin(BaseModel):
    last_updated: Optional[datetime] = None
    freshness_state: Optional[str] = None
    age_seconds: Optional[int] = None

def calculate_freshness(last_updated: Optional[datetime] = None) -> dict:
    if not last_updated:
        # Mocking for testing if not provided
        last_updated = datetime.now(timezone.utc)
    
    if last_updated.tzinfo is None:
        last_updated = last_updated.replace(tzinfo=timezone.utc)
    
    now = datetime.now(timezone.utc)
    age_seconds = int((now - last_updated).total_seconds())
    
    # In case age is negative due to slight time drifts
    age_seconds = max(0, age_seconds)
    
    if age_seconds < 60:
        freshness_state = "FRESH"
    elif age_seconds < 300:
        freshness_state = "AGING"
    elif age_seconds < 3600:
        freshness_state = "STALE"
    else:
        freshness_state = "MISSING"
        
    return {
        "last_updated": last_updated,
        "freshness_state": freshness_state,
        "age_seconds": age_seconds
    }
