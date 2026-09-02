import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta, timezone, date
from app.main import app
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.facility import Bed, Ward
from app.models.encounter import Encounter
from app.models.event import BedStateEvent, DischargeEvent, ClinicalEvent
from app.models.user import User
from app.models.enums import BedState
from app.core.security import create_access_token

client = TestClient(app)

@pytest.fixture(scope="module")
def db_session():
    import app.models
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    yield db
    db.close()
    # Don't drop all for now to avoid breaking other tests or re-create
    # We will use transactional cleanup or just keep it simple

@pytest.fixture(scope="module")
def auth_headers(db_session):
    user = db_session.query(User).filter(User.username == "test_dashboard").first()
    if not user:
        from app.models.user import Role
        role = db_session.query(Role).filter(Role.name == "ADMIN").first()
        if not role:
            role = Role(name="ADMIN")
            db_session.add(role)
            db_session.commit()
        user = User(username="test_dashboard", email="test_dash@test.com", role_id=role.id)
        db_session.add(user)
        db_session.commit()
    token = create_access_token(subject=user.username)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(autouse=True)
def setup_data(db_session):
    # clear events and beds
    db_session.query(BedStateEvent).delete()
    db_session.query(DischargeEvent).delete()
    db_session.query(ClinicalEvent).delete()
    db_session.query(Encounter).delete()
    db_session.query(Bed).delete()
    db_session.query(Ward).delete()
    db_session.commit()

    ward = Ward(name="Dash Ward")
    db_session.add(ward)
    db_session.commit()

    b1 = Bed(name="B1", ward_id=ward.id, state=BedState.OCCUPIED)
    b2 = Bed(name="B2", ward_id=ward.id, state=BedState.CLEANING)
    b3 = Bed(name="B3", ward_id=ward.id, state=BedState.AVAILABLE)
    b4 = Bed(name="B4", ward_id=ward.id, state=BedState.AVAILABLE)
    db_session.add_all([b1, b2, b3, b4])
    db_session.commit()

    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(days=1)
    
    # Bed 2 in cleaning for 65 minutes
    db_session.add(BedStateEvent(bed_id=b2.id, old_state=BedState.DISCHARGE_PREP, new_state=BedState.CLEANING, timestamp=now - timedelta(minutes=65)))

    # turnover for B3
    # Discharged -> Cleaning -> Available
    db_session.add(BedStateEvent(bed_id=b3.id, old_state=BedState.OCCUPIED, new_state=BedState.CLEANING, timestamp=yesterday))
    db_session.add(BedStateEvent(bed_id=b3.id, old_state=BedState.CLEANING, new_state=BedState.AVAILABLE, timestamp=yesterday + timedelta(minutes=45)))

    # flow
    db_session.add(Encounter(patient_name="P1", bed_id=b1.id, created_at=now))
    db_session.add(DischargeEvent(encounter_id=None, timestamp=now))
    
    db_session.commit()
    yield

def test_unauthorized():
    assert client.get("/api/dashboard/summary").status_code == 401
    assert client.get("/api/dashboard/occupancy-trend").status_code == 401
    assert client.get("/api/dashboard/flow").status_code == 401
    assert client.get("/api/dashboard/turnover").status_code == 401
    assert client.get("/api/dashboard/alerts").status_code == 401

def test_summary(auth_headers):
    resp = client.get("/api/dashboard/summary", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "capacity" in data
    assert data["capacity"]["total"] == 4
    assert data["occupancy_percentage"] == 25.0

def test_occupancy_trend(auth_headers):
    resp = client.get("/api/dashboard/occupancy-trend?days=2", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    # Verify current state matches
    today = [d for d in data if d["date"] == date.today().isoformat()][0]
    assert today["occupied"] == 1
    assert today["total"] == 4
    assert today["occupancy_percentage"] == 25.0

def test_flow(auth_headers):
    resp = client.get("/api/dashboard/flow?days=2", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2

def test_turnover(auth_headers):
    resp = client.get("/api/dashboard/turnover", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["average_minutes"] == 45.0
    assert len(data["records"]) == 1
    assert data["records"][0]["turnover_minutes"] == 45

def test_alerts(auth_headers):
    resp = client.get("/api/dashboard/alerts", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
    types = [a["type"] for a in data]
    assert "CLEANING_DELAY" in types
