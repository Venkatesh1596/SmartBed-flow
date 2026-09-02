import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

from app.core.config import settings

def get_auth_headers():
    response = client.post("/api/auth/login", data={"username": "admin", "password": settings.ADMIN_PASSWORD})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_simulation_auth():
    # 401 Without auth
    response = client.get("/api/simulation/summary")
    assert response.status_code == 401

def test_simulation_summary():
    headers = get_auth_headers()
    response = client.get("/api/simulation/summary", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "available_presets" in data
    assert "current_baseline" in data

def test_simulation_baseline():
    headers = get_auth_headers()
    response = client.get("/api/simulation/baseline", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "occupancy_rate" in data
    assert "cleaning_pressure" in data

def test_simulation_presets():
    headers = get_auth_headers()
    response = client.get("/api/simulation/presets", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_simulation_scenario():
    headers = get_auth_headers()
    response = client.get(
        "/api/simulation/scenario?staffing_multiplier=1.0&admission_surge=1.5",
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "projection" in data
    # Check 0-100 limits for some projection fields
    assert 0.0 <= data["projection"]["occupancy_rate"] <= 1.0
    assert 0.0 <= data["projection"]["cleaning_pressure"] <= 100.0
    assert 0.0 <= data["projection"]["sla_pressure"] <= 100.0

def test_simulation_invalid_bounds():
    headers = get_auth_headers()
    # Test invalid bounds (e.g. out of 0-5 for multiplier)
    response = client.get(
        "/api/simulation/scenario?staffing_multiplier=6.0",
        headers=headers
    )
    assert response.status_code == 422

def test_simulation_compare():
    headers = get_auth_headers()
    response = client.get(
        "/api/simulation/compare?base_staffing=1.0&alt_staffing=0.8&base_surge=1.0&alt_surge=1.5",
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "baseline_scenario" in data
    assert "alternative_scenario" in data

def test_simulation_mutation_not_allowed():
    headers = get_auth_headers()
    response = client.post("/api/simulation/scenario", headers=headers, json={"staffing_multiplier": 1.0})
    # Must return 405 Method Not Allowed
    assert response.status_code == 405
