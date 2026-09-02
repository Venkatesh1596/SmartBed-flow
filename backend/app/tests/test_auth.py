import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.api.deps import get_db
from app.models.user import User, Role
from app.core.security import get_password_hash
from app.core.config import settings

# Setup in-memory SQLite database for testing
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



@pytest.fixture(scope="module", autouse=True)
def setup_overrides():
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.fixture(scope="module")
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Create Role
    role = Role(name="ADMIN")
    db.add(role)
    db.commit()
    db.refresh(role)
    
    # Create User
    user = User(
        username="testadmin",
        hashed_password=get_password_hash("testpassword"),
        role_id=role.id
    )
    db.add(user)
    db.commit()
    
    yield
    
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(setup_db):
    with TestClient(app) as c:
        yield c

def test_login_success(client):
    response = client.post(
        "/api/auth/login", # Wait, need to check prefix
        data={"username": "testadmin", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_failure(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "testadmin", "password": "wrongpassword"},
    )
    assert response.status_code == 401

def test_read_me(client):
    # Login first
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testadmin", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]
    
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testadmin"
    assert "hashed_password" not in data

def test_protected_endpoint_without_token(client):
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 401


import pytest

