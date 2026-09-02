import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.db.base import Base
from app.api.deps import get_db, get_current_user
from app.models.user import User, Role

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

class MockRole:
    name = "ADMIN"

class MockUser:
    id = 1
    username = "testadmin"
    role = MockRole()

def override_get_current_user():
    return MockUser()
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    db = TestingSessionLocal()
    yield db
    db.close()
    
    app.dependency_overrides.clear()

def test_auth_required():
    app.dependency_overrides.pop(get_current_user, None)
    response = client.get("/api/workload/summary")
    assert response.status_code == 401
    app.dependency_overrides[get_current_user] = override_get_current_user

def test_mutations_not_allowed():
    response = client.post("/api/workload/summary", json={"data": "test"})
    assert response.status_code == 405
    response = client.put("/api/workload/items", json={})
    assert response.status_code == 405

def test_empty_db():
    endpoints = [
        "/api/workload/summary",
        "/api/workload/items",
        "/api/workload/queues",
        "/api/workload/distribution",
        "/api/workload/priorities",
        "/api/workload/recommendations",
        "/api/workload/trends",
        "/api/workload/pressure",
        "/api/workload/critical"
    ]
    for ep in endpoints:
        response = client.get(ep)
        assert response.status_code == 200, f"Failed at {ep}"

def test_score_bounds_and_pagination(setup_db):
    from app.models.facility import Bed, Ward
    from app.models.enums import BedState
    db = setup_db
    ward = Ward(name="Test Ward")
    db.add(ward)
    db.commit()
    
    bed = Bed(name="B1", ward_id=ward.id, state=BedState.CLEANING)
    db.add(bed)
    db.commit()
    
    response = client.get("/api/workload/items?limit=10&offset=0")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    for item in data:
        assert 0 <= item["priority"]["score"] <= 100
        assert item["priority"]["category"] in ["NORMAL", "WATCH", "HIGH", "CRITICAL"]

def test_filters(setup_db):
    from app.models.facility import Bed, Ward
    from app.models.enums import BedState
    db = setup_db
    ward = Ward(name="Test Ward")
    db.add(ward)
    db.commit()
    
    bed = Bed(name="B1", ward_id=ward.id, state=BedState.CLEANING)
    db.add(bed)
    db.commit()
    
    response = client.get("/api/workload/items?queue_type=CLEANING")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

    response = client.get("/api/workload/queue/CLEANING")
    assert response.status_code == 200
    assert response.json()["queue_type"] == "CLEANING"


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
