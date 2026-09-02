import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_audit_logs_unauthenticated():
    response = client.get("/api/audit/")
    assert response.status_code == 401

def test_audit_logs_no_put_delete():
    response = client.put("/api/audit/1")
    assert response.status_code == 404
    response = client.delete("/api/audit/1")
    assert response.status_code == 404
