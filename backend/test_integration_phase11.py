import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.main import app
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.facility import Ward, Bed
from app.models.encounter import Encounter
from app.models.event import BedStateEvent
from app.models.enums import BedState, EncounterStatus
from app.db.session import SessionLocal

@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def test_user(db_session: Session):
    from app.models.user import Role
    admin_role = db_session.query(Role).filter(Role.name == "ADMIN").first()
    if not admin_role:
        admin_role = Role(name="ADMIN")
        db_session.add(admin_role)
        db_session.commit()

    user = db_session.query(User).filter(User.username == "test_phase11_user").first()
    if not user:
        user = User(
            username="test_phase11_user",
            hashed_password="fakehashedpassword",
            role_id=admin_role.id
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    return user

@pytest.fixture(scope="module")
def auth_headers(test_user):
    # Overriding dependency for the test
    app.dependency_overrides[get_current_user] = lambda: test_user
    return {"Authorization": "Bearer fake_token"}

def test_sla_unauthorized(client):
    response = client.get("/api/sla/summary")
    assert response.status_code == 401

def test_sla_endpoints_authenticated(client, db_session, test_user, auth_headers):
    # Setup test data
    ward = Ward(name="SLA Ward Phase 11")
    db_session.add(ward)
    db_session.commit()
    
    bed = Bed(name="SLA Bed 1", ward_id=ward.id, state=BedState.CLEANING)
    db_session.add(bed)
    db_session.commit()
    
    now = datetime.now(timezone.utc)
    
    # Cleaning event - Overdue (46 minutes ago)
    event_time = now - timedelta(minutes=46)
    event = BedStateEvent(bed_id=bed.id, old_state=BedState.DISCHARGE_PREP, new_state=BedState.CLEANING, timestamp=event_time)
    db_session.add(event)
    
    # Encounter - Critical (73 hours ago)
    enc_time = now - timedelta(hours=73)
    enc = Encounter(patient_name="SLA Patient", bed_id=bed.id, status=EncounterStatus.ACTIVE, created_at=enc_time)
    db_session.add(enc)
    
    db_session.commit()

    # Get summary
    res = client.get("/api/sla/summary", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert data["summary"]["overdue_count"] >= 1 # Cleaning
    assert data["summary"]["critical_count"] >= 1 # Encounter
    
    # Get workflows
    res = client.get("/api/sla/workflows", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 2
    
    # Get overdue
    res = client.get("/api/sla/overdue", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 2
    
    # Get bed
    res = client.get(f"/api/sla/bed/{bed.id}", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2 # 1 cleaning, 1 encounter
    
    # Clean up dependency override
    app.dependency_overrides.clear()


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
