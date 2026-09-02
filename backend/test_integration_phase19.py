import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timezone, timedelta
from app.main import app
from app.api.deps import get_db, get_current_user
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.facility import Bed, Ward
from app.models.enums import BedState
from app.models.encounter import Encounter
from app.models.event import BedStateEvent
from pydantic import ValidationError

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_phase19.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {"username": "test_user"}

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()

def test_auth():
    app.dependency_overrides.pop(get_current_user, None)
    response = client.get("/api/predictive-operations/summary")
    assert response.status_code == 401
    app.dependency_overrides[get_current_user] = override_get_current_user

def test_mutations_405():
    response = client.post("/api/predictive-operations/summary")
    assert response.status_code == 405

def test_empty_db_safely():
    response = client.get("/api/predictive-operations/summary")
    assert response.status_code == 200
    data = response.json()
    assert "facility_warning" in data
    
    fac = data["facility_warning"]
    assert fac["warning_score"]["score"] == 5.0 # Trend 10% * 50 = 5.0
    assert fac["capacity_risk"]["score"] == 0.0
    assert fac["sla_trend"]["score"] == 0.0
    assert fac["cleaning_risk"]["score"] == 0.0
    
    assert data["ward_warnings"] == []
    
    response2 = client.get("/api/predictive-operations/cleaning-risk")
    assert response2.status_code == 200
    assert response2.json()["score"] == 0.0

def test_score_limits():
    db = TestingSessionLocal()
    
    # Create ward & beds
    ward = Ward(name="Test Ward")
    db.add(ward)
    db.commit()
    db.refresh(ward)
    
    for i in range(10):
        bed = Bed(name=f"Bed {i}", ward_id=ward.id, state=BedState.OCCUPIED)
        db.add(bed)
        db.commit()
        
    response = client.get("/api/predictive-operations/capacity-risk")
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["score"] <= 100
    assert data["score"] == 100.0
    
    # Test bounds of EarlyWarningScore directly via validation error or checking output
    from app.schemas.predictive_operations import EarlyWarningScore
    score_model = EarlyWarningScore(score=150.0, category="High")
    assert score_model.score == 100.0 # because we cap it in the validator
    
    score_model2 = EarlyWarningScore(score=-10.0, category="Normal")
    assert score_model2.score == 0.0

def test_trends():
    response = client.get("/api/predictive-operations/trends?days=7")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 7
    for pt in data:
        assert 0 <= pt["score"] <= 100

def test_operational_terms_only():
    response = client.get("/api/predictive-operations/summary")
    assert response.status_code == 200
    text = response.text.lower()
    assert "patient" not in text
    assert "clinical" not in text
    assert "diagnosis" not in text


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
