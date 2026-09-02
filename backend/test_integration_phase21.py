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

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_get_current_user():
    return User(id=1, username="testadmin", role=Role(id=1, name="ADMIN"))

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
    response = client.get("/api/control-tower/summary")
    assert response.status_code == 401
    app.dependency_overrides[get_current_user] = override_get_current_user

def test_mutations_not_allowed():
    response = client.post("/api/control-tower/summary", json={"data": "test"})
    assert response.status_code == 405

def test_empty_db():
    endpoints = [
        "/api/control-tower/summary",
        "/api/control-tower/bed-board",
        "/api/control-tower/ward-control",
        "/api/control-tower/attention",
        "/api/control-tower/queue",
        "/api/control-tower/activity",
        "/api/control-tower/trends",
        "/api/control-tower/changes",
        "/api/control-tower/priorities"
    ]
    for ep in endpoints:
        response = client.get(ep)
        assert response.status_code == 200, f"Failed at {ep}"
        assert response.json()["success"] == True

def test_bounds_occupancy():
    response = client.get("/api/control-tower/summary")
    data = response.json()["data"]["metrics"]
    assert 0 <= data["system_occupancy_rate"] <= 100


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
