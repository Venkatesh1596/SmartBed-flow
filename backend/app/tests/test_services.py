import pytest
from app.services.bed_state import bed_state_service
from app.services.freshness import freshness_service, FreshnessState
from datetime import datetime, timedelta, timezone

def test_bed_state_transitions():
    assert bed_state_service.validate_transition("OCCUPIED", "CLINICALLY_READY") == True
    assert bed_state_service.validate_transition("OCCUPIED", "SAFE_AVAILABLE") == False
    assert bed_state_service.validate_transition("CLEANING_COMPLETED", "SAFETY_VERIFICATION") == True
    assert bed_state_service.validate_transition("CLEANING_PENDING", "CLEANING_IN_PROGRESS") == True

def test_freshness_logic():
    now = datetime.now(timezone.utc)
    
    fresh_time = now - timedelta(minutes=10)
    aging_time = now - timedelta(minutes=40)
    stale_time = now - timedelta(minutes=130)
    
    assert freshness_service.calculate_freshness(fresh_time) == FreshnessState.FRESH
    assert freshness_service.calculate_freshness(aging_time) == FreshnessState.AGING
    assert freshness_service.calculate_freshness(stale_time) == FreshnessState.STALE
    assert freshness_service.calculate_freshness(None) == FreshnessState.MISSING
