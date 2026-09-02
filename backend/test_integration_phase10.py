import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.api.deps import get_db, get_current_user
from app.models.user import User

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

def override_get_current_user():
    return User(id=1, email="test@example.com")

@pytest.fixture(autouse=True)
def setup_db():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()

client = TestClient(app)

def test_command_center_summary_unauthorized():
    response = client.get("/api/command-center/summary")
    assert response.status_code == 401

def test_command_center_summary_authorized():
    app.dependency_overrides[get_current_user] = override_get_current_user
    response = client.get("/api/command-center/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_occupancy_percent" in data
    assert "total_available_beds" in data
    assert "total_active_encounters" in data

def test_command_center_wards():
    app.dependency_overrides[get_current_user] = override_get_current_user
    response = client.get("/api/command-center/wards")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_command_center_bed_priority():
    app.dependency_overrides[get_current_user] = override_get_current_user
    response = client.get("/api/command-center/bed-priority")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_command_center_discharge_queue():
    app.dependency_overrides[get_current_user] = override_get_current_user
    response = client.get("/api/command-center/discharge-queue")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_command_center_priorities():
    app.dependency_overrides[get_current_user] = override_get_current_user
    response = client.get("/api/command-center/priorities")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
