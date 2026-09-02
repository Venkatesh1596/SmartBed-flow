import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone

from app.main import app
from app.db.base import Base
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.facility import Bed, Ward
from app.models.enums import BedState
from app.models.event import BedStateEvent, HospitalEvent
from app.models.encounter import Encounter

from sqlalchemy.pool import StaticPool

test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="module")
def db_session():
    db = TestSessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=test_engine)
    def override_get_db():
        db = TestSessionLocal()
        try:
            yield db
        finally:
            db.close()

    def override_get_current_user():
        return User(id=1, email="test@example.com", role_id=1)

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    with TestClient(app) as c:
        yield c
        
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="module")
def unauth_client():
    # Don't override get_current_user for unauth
    def override_get_db():
        db = TestSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_unauthenticated_requests(unauth_client):
    endpoints = [
        "/api/capacity/summary",
        "/api/capacity/wards",
        "/api/capacity/available-soon",
        "/api/capacity/trends?start_date=2024-01-01T00:00:00&end_date=2024-01-02T00:00:00",
        "/api/capacity/priorities",
        "/api/capacity/pressure"
    ]
    for endpoint in endpoints:
        response = unauth_client.get(endpoint)
        assert response.status_code == 401

def test_zero_beds_math(client, db_session):
    # DB is empty initially
    response = client.get("/api/capacity/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_beds"] == 0
    assert data["occupancy_rate"] == 0.0
    
    response = client.get("/api/capacity/pressure")
    assert response.status_code == 200
    assert response.json()["pressure_score"] == 0.0

def test_fully_available_occupied_pressure_bounds(client, db_session):
    ward = Ward(name="Capacity Ward")
    db_session.add(ward)
    db_session.commit()
    
    bed1 = Bed(name="C1", ward_id=ward.id, state=BedState.AVAILABLE)
    bed2 = Bed(name="C2", ward_id=ward.id, state=BedState.AVAILABLE)
    db_session.add_all([bed1, bed2])
    db_session.commit()
    
    # Fully available
    response = client.get("/api/capacity/summary")
    data = response.json()
    assert data["total_beds"] == 2
    assert data["available_beds"] == 2
    assert data["occupancy_rate"] == 0.0
    
    response = client.get("/api/capacity/pressure")
    assert response.json()["pressure_score"] == 0.0
    
    response = client.get("/api/capacity/priorities")
    assert response.json()["level"] == "INFO"
    
    # Fully occupied
    bed1.state = BedState.OCCUPIED
    bed2.state = BedState.OCCUPIED
    db_session.commit()
    
    response = client.get("/api/capacity/summary")
    data = response.json()
    assert data["occupied_beds"] == 2
    assert data["occupancy_rate"] == 1.0
    
    response = client.get("/api/capacity/pressure")
    assert response.json()["pressure_score"] == 100.0
    
    response = client.get("/api/capacity/priorities")
    assert response.json()["level"] == "CRITICAL"

def test_date_validation(client):
    response = client.get("/api/capacity/trends?start_date=2024-01-02T00:00:00&end_date=2024-01-01T00:00:00")
    assert response.status_code == 400
    
    response = client.get("/api/capacity/trends?start_date=2024-01-01T00:00:00&end_date=2024-01-02T00:00:00")
    assert response.status_code == 200
    
def test_available_soon_structure(client, db_session):
    bed = db_session.query(Bed).first()
    event = BedStateEvent(
        bed_id=bed.id,
        new_state=BedState.CLEANING,
        timestamp=datetime.now(timezone.utc)
    )
    db_session.add(event)
    db_session.commit()
    
    response = client.get("/api/capacity/available-soon")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        item = data[0]
        assert "bed_id" in item
        assert "bed_name" in item
        assert "ward_id" in item
        assert "ward_name" in item
        assert "available_in_hours" in item
        assert "confidence" in item
        assert item["available_in_hours"] >= 0.0

def test_no_mutation_endpoints(client):
    response = client.post("/api/capacity/summary")
    assert response.status_code == 405
    response = client.put("/api/capacity/wards")
    assert response.status_code == 405
    response = client.delete("/api/capacity/available-soon")
    assert response.status_code == 405
    response = client.patch("/api/capacity/priorities")
    assert response.status_code == 405


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
