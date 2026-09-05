import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_hospital_event_maintenance_regression():
    # 1. Login as admin
    login_data = {
        "username": "admin",
        "password": settings.ADMIN_PASSWORD
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a generic MAINTENANCE event
    event_data = {
        "type": "MAINTENANCE",
        "details": {"reason": "Regression test for MAINTENANCE polymorphic identity"}
    }
    response = client.post("/api/events/", json=event_data, headers=headers)
    assert response.status_code == 200, f"Failed to create event: {response.text}"

    # 3. Fetch events to prove polymorphic loading does not crash
    response = client.get("/api/events", headers=headers)
    assert response.status_code == 200, f"Failed to load events: {response.text}"
    events = response.json()
    
    # 4. Verify MAINTENANCE event is in the list
    maintenance_events = [e for e in events if e["type"] == "MAINTENANCE"]
    assert len(maintenance_events) > 0, "No MAINTENANCE events found in response"
    
    # 5. Verify the details are correct
    assert "reason" in maintenance_events[0]["details"]
