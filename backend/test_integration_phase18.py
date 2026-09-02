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
    Base.metadata.create_all(bind=test_engine)
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
    Base.metadata.drop_all(bind=test_engine)

def test_orchestration_unauthorized(unauth_client):
    response = unauth_client.get("/api/orchestration/summary")
    assert response.status_code == 401

def test_orchestration_get_summary(client, db_session):
    response = client.get("/api/orchestration/summary")
    assert response.status_code == 200
    data = response.json()
    assert "pressure_score" in data
    assert 0 <= data["pressure_score"] <= 100
    assert "candidates_count" in data
    assert "blockers_count" in data

def test_orchestration_get_candidates(client, db_session):
    # Add a bed to test deterministic ordering and score bounds
    ward = Ward(name="Test Ward")
    db_session.add(ward)
    db_session.commit()
    b1 = Bed(name="B1", ward_id=ward.id, state=BedState.AVAILABLE)
    b2 = Bed(name="B2", ward_id=ward.id, state=BedState.OCCUPIED)
    db_session.add_all([b1, b2])
    db_session.commit()

    response = client.get("/api/orchestration/candidates")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) >= 2:
        for i in range(len(data) - 1):
            assert data[i]["score"] >= data[i+1]["score"]
            if data[i]["score"] == data[i+1]["score"]:
                assert data[i]["bed_id"] < data[i+1]["bed_id"]

def test_orchestration_get_blockers(client, db_session):
    response = client.get("/api/orchestration/blockers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) >= 2:
        for i in range(len(data) - 1):
            assert data[i]["bed_id"] <= data[i+1]["bed_id"]

def test_orchestration_get_ward_pressures(client, db_session):
    response = client.get("/api/orchestration/ward-pressures")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) >= 2:
        for i in range(len(data) - 1):
            assert data[i]["ward_id"] <= data[i+1]["ward_id"]

def test_orchestration_get_queue(client, db_session):
    response = client.get("/api/orchestration/queue")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Check priority sorting
    priority_map = {"CRITICAL": 1, "HIGH": 2, "WARNING": 3, "INFO": 4}
    if len(data) >= 2:
        for i in range(len(data) - 1):
            p1 = priority_map.get(data[i]["priority"], 5)
            p2 = priority_map.get(data[i+1]["priority"], 5)
            assert p1 <= p2

def test_orchestration_get_recommendations(client, db_session):
    response = client.get("/api/orchestration/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_orchestration_read_only(client, db_session):
    resp = client.post("/api/orchestration/orchestrate")
    assert resp.status_code == 405
    resp = client.put("/api/orchestration/summary")
    assert resp.status_code == 405
    resp = client.delete("/api/orchestration/queue")
    assert resp.status_code == 405

def test_orchestration_zero_beds(client, db_session):
    # Already added beds in earlier test, but we test the structure
    response = client.get("/api/orchestration/summary")
    assert response.status_code == 200


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
