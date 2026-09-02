import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User, Role
from app.core.security import get_password_hash

client = TestClient(app)

@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def admin_token(db_session):
    user = db_session.query(User).filter(User.username == "admin").first()
    if not user:
        role = db_session.query(Role).filter(Role.name == "ADMIN").first()
        if not role:
            role = Role(name="ADMIN")
            db_session.add(role)
        user = User(username="admin", email="admin@test.com", role_id=role.id, hashed_password=get_password_hash("supersecretadmin"))
        db_session.add(user)
        db_session.commit()
    else:
        user.hashed_password = get_password_hash("supersecretadmin")
        db_session.commit()
        
    response = client.post("/api/auth/login", data={"username": "admin", "password": "supersecretadmin"})
    if "access_token" not in response.json():
        print(f"FAILED TO LOGIN: {response.json()}")
    return response.json()["access_token"]

@pytest.fixture(scope="module")
def non_admin_token(db_session):
    user = db_session.query(User).filter(User.username == "nurse").first()
    if not user:
        role = db_session.query(Role).filter(Role.name == "NURSE").first()
        if not role:
            role = Role(name="NURSE")
            db_session.add(role)
            db_session.commit()
            db_session.refresh(role)
            
        user = User(username="nurse", email="nurse@test.com", role_id=role.id, hashed_password=get_password_hash("password"))
        db_session.add(user)
        db_session.commit()
        
    user.hashed_password = get_password_hash("password")
    db_session.commit()
        
    response = client.post("/api/auth/login", data={"username": "nurse", "password": "password"})
    return response.json()["access_token"]

def test_get_health(admin_token):
    response = client.get("/api/admin/health", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["db_connection"] is True

def test_get_config(admin_token):
    response = client.get("/api/admin/config", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert "maintenance_mode" in response.json()

def test_put_config(admin_token):
    response = client.put(
        "/api/admin/config", 
        json={"maintenance_mode": True, "max_capacity": 200, "emergency_override": True},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 400

def test_list_users(admin_token):
    response = client.get("/api/admin/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert "users" in response.json()
    assert len(response.json()["users"]) > 0

def test_non_admin_forbidden(non_admin_token):
    response = client.get("/api/admin/health", headers={"Authorization": f"Bearer {non_admin_token}"})
    assert response.status_code == 403

def test_self_lockout_blocked(admin_token, db_session):
    admin = db_session.query(User).filter(User.username == "admin").first()
    response = client.put(
        f"/api/admin/users/{admin.id}/status",
        json={"is_active": False},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 400
    assert "Cannot deactivate yourself" in response.json()["detail"]

def test_deactivate_other_user(admin_token, db_session):
    nurse = db_session.query(User).filter(User.username == "nurse").first()
    response = client.put(
        f"/api/admin/users/{nurse.id}/status",
        json={"is_active": False},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    
    # Check if they can login
    login_response = client.post("/api/auth/login", data={"username": "nurse", "password": "password"})
    assert login_response.status_code == 401
    
    # Reactivate
    response = client.put(
        f"/api/admin/users/{nurse.id}/status",
        json={"is_active": True},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
