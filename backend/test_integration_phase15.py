import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, create_access_token
from datetime import timedelta

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Create test user
    from app.models.user import Role
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        admin_role = Role(name="admin")
        db.add(admin_role)
        db.commit()
        
    user = db.query(User).filter(User.username == "exec_admin").first()
    if not user:
        user = User(
            username="exec_admin",
            email="exec_admin@example.com",
            hashed_password=get_password_hash("password"),
            role=admin_role
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    yield
    db.close()

@pytest.fixture(scope="module")
def admin_token():
    db = SessionLocal()
    user = db.query(User).filter(User.username == "exec_admin").first()
    db.close()
    token = create_access_token(
        subject=user.username, expires_delta=timedelta(minutes=30)
    )
    return token

def test_executive_unauthorized():
    endpoints = [
        "/api/executive/summary",
        "/api/executive/performance",
        "/api/executive/wards",
        "/api/executive/trends",
        "/api/executive/comparison",
        "/api/executive/attention",
        "/api/executive/priorities"
    ]
    for ep in endpoints:
        resp = client.get(ep)
        assert resp.status_code == 401

def test_executive_authorized_and_math_safety(admin_token):
    # Testing endpoints which rely on math (zero division safety)
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Summary
    resp = client.get("/api/executive/summary", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "facilities" in data
    assert "top_priorities" in data
    
    # Performance
    resp = client.get("/api/executive/performance", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_occupancy_rate" in data
    assert "overall_operational_index" in data
    assert isinstance(data["overall_occupancy_rate"], float)
    
    # Wards
    resp = client.get("/api/executive/wards", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    
    # Trends
    resp = client.get("/api/executive/trends", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "occupancy" in data
    
    # Comparison
    resp = client.get("/api/executive/comparison", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "opi" in data
    assert data["opi"]["percentage_change"] == 0.0
    
    # Attention
    resp = client.get("/api/executive/attention", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    
    # Priorities
    resp = client.get("/api/executive/priorities", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

