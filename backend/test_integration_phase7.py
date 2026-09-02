import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.base import Base
from sqlalchemy import create_engine
from app.core.config import settings

client = TestClient(app)

def test_crud_workflow():
    db = SessionLocal()
    from app.models.user import User, Role
    from app.core.security import get_password_hash
    user_role = db.query(Role).filter(Role.name == "STAFF").first()
    if not user_role:
        user_role = Role(name="STAFF")
        db.add(user_role)
        db.commit()
    test_user = db.query(User).filter(User.username == "testuser").first()
    if not test_user:
        test_user = User(username="testuser", hashed_password=get_password_hash("password"), role_id=user_role.id)
        db.add(test_user)
        db.commit()
        
    from app.models.facility import Ward
    ward = db.query(Ward).filter(Ward.id == 1).first()
    if not ward:
        ward = Ward(name="Test Ward")
        db.add(ward)
        db.commit()
    ward_id = ward.id
    db.close()

    # 1. Login as ADMIN
    response = client.post("/api/auth/login", data={"username": "admin", "password": "supersecretadmin"})
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Login as USER to check 403
    response_user = client.post("/api/auth/login", data={"username": "testuser", "password": "password"})
    assert response_user.status_code == 200, response_user.text
    token_user = response_user.json()["access_token"]
    headers_user = {"Authorization": f"Bearer {token_user}"}
    
    # 3. Create a Bed (Admin)
    bed_data = {"name": "Test Bed 7", "ward_id": ward_id, "state": "AVAILABLE"}
    response = client.post("/api/beds/", json=bed_data, headers=headers)
    assert response.status_code == 200, response.text
    bed_id = response.json()["id"]
    
    # 4. Create Bed (User) -> 403
    response = client.post("/api/beds/", json=bed_data, headers=headers_user)
    assert response.status_code == 403
    
    # 5. Encounter Admission
    encounter_data = {"patient_name": "John Doe", "bed_id": bed_id}
    response = client.post("/api/encounters/", json=encounter_data, headers=headers)
    assert response.status_code == 200, response.text
    encounter_id = response.json()["id"]
    
    # Verify Bed is OCCUPIED
    response = client.get(f"/api/beds/{bed_id}", headers=headers)
    assert response.json()["state"] == "OCCUPIED"
    
    # 6. Discharge
    response = client.put(f"/api/encounters/{encounter_id}/discharge", headers=headers)
    assert response.status_code == 200, response.text
    assert response.json()["status"] == "DISCHARGED"
    
    # Verify Bed is CLEANING
    response = client.get(f"/api/beds/{bed_id}", headers=headers)
    assert response.json()["state"] == "CLEANING"
    
    # 7. Create Event
    event_data = {"type": "MAINTENANCE", "details": {"reason": "check"}}
    response = client.post("/api/events/", json=event_data, headers=headers)
    assert response.status_code == 200, response.text
    
    # 8. Unauthenticated
    response = client.get("/api/beds/")
    assert response.status_code == 401
