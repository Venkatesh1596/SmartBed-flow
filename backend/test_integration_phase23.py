import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_required():
    response = client.get("/api/benchmarking/summary")
    assert response.status_code == 401
    
    response = client.get("/api/benchmarking/facility")
    assert response.status_code == 401

@pytest.fixture
def auth_headers():
    return {"Authorization": "Bearer test_token"}

def test_mutations_not_allowed(auth_headers, monkeypatch):
    from app.api.deps import get_current_user
    app.dependency_overrides[get_current_user] = lambda: {"id": 1, "username": "test"}

    response = client.post("/api/benchmarking/summary", headers=auth_headers)
    assert response.status_code == 405
    
    response = client.delete("/api/benchmarking/facility", headers=auth_headers)
    assert response.status_code == 405

def test_get_summary_bounds_and_empty_db(auth_headers, monkeypatch):
    from app.api.deps import get_current_user
    app.dependency_overrides[get_current_user] = lambda: {"id": 1, "username": "test"}

    response = client.get("/api/benchmarking/summary?period_days=30", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "facility" in data
    assert "score" in data["facility"]
    
    overall_score = data["facility"]["score"]["overall_score"]
    assert 0 <= overall_score <= 100

def test_period_comparisons(auth_headers, monkeypatch):
    from app.api.deps import get_current_user
    app.dependency_overrides[get_current_user] = lambda: {"id": 1, "username": "test"}
    
    for period in [7, 14, 30, 90]:
        response = client.get(f"/api/benchmarking/summary?period_days={period}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["comparison_period_days"] == period

def test_score_bounds(auth_headers, monkeypatch):
    from app.api.deps import get_current_user
    app.dependency_overrides[get_current_user] = lambda: {"id": 1, "username": "test"}
    
    response = client.get("/api/benchmarking/score", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["overall_score"] <= 100
    assert 0 <= data["occupancy_component"] <= 100
    assert 0 <= data["availability_component"] <= 100
    assert 0 <= data["turnover_component"] <= 100
    assert 0 <= data["sla_component"] <= 100
    assert 0 <= data["workflow_component"] <= 100
    assert 0 <= data["cleaning_component"] <= 100
    assert 0 <= data["capacity_component"] <= 100
    assert 0 <= data["predictive_component"] <= 100
    assert 0 <= data["workload_component"] <= 100


import pytest
@pytest.fixture(autouse=True, scope='module')
def cleanup_overrides_for_module():
    yield
    from app.main import app
    app.dependency_overrides.clear()
