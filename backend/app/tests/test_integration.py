import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.main import app
from app.db.session import SessionLocal
from app.api.endpoints.dashboard import get_db
from app.models.facility import Bed, Ward
from app.models.enums import BedState
import json

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

from app.api.endpoints.dashboard import get_db as get_dashboard_db
from app.api.endpoints.events import get_db as get_events_db
from app.api.endpoints.beds import get_db as get_beds_db

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()




@pytest.fixture(scope="module", autouse=True)
def setup_overrides():
    app.dependency_overrides[get_dashboard_db] = override_get_db
    app.dependency_overrides[get_events_db] = override_get_db
    app.dependency_overrides[get_beds_db] = override_get_db
    from app.api.deps import get_db
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed data
    ward = Ward(name="TEST-WARD")
    db.add(ward)
    db.commit()
    db.refresh(ward)
    

    bed = Bed(name="T101", ward_id=ward.id, state=BedState.OCCUPIED)
    db.add(bed)
    db.commit()

    from app.models.user import User, Role
    role = Role(name="ADMIN")
    db.add(role)
    db.commit()
    db.refresh(role)
    user = User(username="testadmin", hashed_password="dummy", role_id=role.id)
    db.add(user)
    db.commit()

    db.close()
    yield


def get_auth_token():
    from app.core.security import create_access_token
    from datetime import timedelta
    return create_access_token("testadmin", timedelta(minutes=15))

def test_dashboard_summary_integration():
    token = get_auth_token()
    response = client.get("/api/dashboard/summary", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["capacity"]["total"] == 1

def test_event_processing():
    token = get_auth_token()
    response = client.post("/api/events/", json={
        "type": "BED_STATE_CHANGED",
        "bed_id": 1,
        "new_state": "DISCHARGE_PREP"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200



import pytest

