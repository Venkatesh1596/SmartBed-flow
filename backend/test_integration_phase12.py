import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User, Role
from app.models.notification import Notification
from app.main import app
from app.db.session import SessionLocal

@pytest.fixture(scope="module")
def db():
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

from app.core.security import get_password_hash

def test_notification_endpoints(client: TestClient, db: Session):
    # Ensure role
    role = db.query(Role).filter_by(name="NURSE").first()
    if not role:
        role = Role(name="NURSE")
        db.add(role)
        db.commit()

    user1 = db.query(User).filter_by(username="nurse1_p12").first()
    if user1:
        db.delete(user1)
        db.commit()
    user2 = db.query(User).filter_by(username="nurse2_p12").first()
    if user2:
        db.delete(user2)
        db.commit()

    user1 = User(username="nurse1_p12", email="nurse1_p12@test.com", hashed_password=get_password_hash("pw"), role_id=role.id)
    db.add(user1)
    user2 = User(username="nurse2_p12", email="nurse2_p12@test.com", hashed_password=get_password_hash("pw"), role_id=role.id)
    db.add(user2)
    db.commit()

    # Login user 1
    resp = client.post("/api/auth/login", data={"username": "nurse1_p12", "password": "pw"})
    token1 = resp.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Login user 2
    resp = client.post("/api/auth/login", data={"username": "nurse2_p12", "password": "pw"})
    token2 = resp.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # Generate notifications
    resp = client.post("/api/notifications/generate", headers=headers1)
    assert resp.status_code == 200

    # Ensure duplicate generate is idempotent
    resp = client.post("/api/notifications/generate", headers=headers1)
    assert resp.status_code == 200

    # Fetch notifications for user 1
    resp = client.get("/api/notifications/", headers=headers1)
    assert resp.status_code == 200
    data1 = resp.json()
    assert "items" in data1
    
    # We can create a manual notification to ensure data isolation
    n1 = Notification(user_id=user1.id, notification_type="TEST", severity="INFO", title="T", message="M", entity_type="Bed", entity_id=999)
    n2 = Notification(user_id=user2.id, notification_type="TEST", severity="INFO", title="T", message="M", entity_type="Bed", entity_id=888)
    db.add_all([n1, n2])
    db.commit()

    # Check unread count
    resp = client.get("/api/notifications/unread-count", headers=headers1)
    assert resp.json()["unread_count"] >= 1

    resp2 = client.get("/api/notifications/unread-count", headers=headers2)
    assert resp2.json()["unread_count"] >= 1

    # Mark as read for user 1
    resp = client.put(f"/api/notifications/{n1.id}/read", headers=headers1)
    assert resp.status_code == 200
    assert resp.json()["is_read"] is True

    # User 2 cannot mark User 1's notification as read
    resp = client.put(f"/api/notifications/{n1.id}/read", headers=headers2)
    assert resp.status_code == 404

    # Mark all read user 2
    resp = client.put("/api/notifications/read-all", headers=headers2)
    assert resp.status_code == 200
    resp = client.get("/api/notifications/unread-count", headers=headers2)
    assert resp.json()["unread_count"] == 0
