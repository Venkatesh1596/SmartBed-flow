import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, create_access_token
from datetime import datetime, timedelta, timezone

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
        
    user = db.query(User).filter(User.username == "report_admin").first()
    if not user:
        user = User(
            username="report_admin",
            email="report_admin@example.com",
            hashed_password=get_password_hash("password"),
            role=admin_role
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    yield
    # We could drop but it's an integration DB
    db.close()

@pytest.fixture(scope="module")
def admin_token():
    db = SessionLocal()
    user = db.query(User).filter(User.username == "report_admin").first()
    db.close()
    token = create_access_token(
        subject=user.username, expires_delta=timedelta(minutes=30)
    )
    return token

def test_reports_unauthorized():
    endpoints = [
        "/api/reports/summary",
        "/api/reports/occupancy",
        "/api/reports/flow",
        "/api/reports/turnover",
        "/api/reports/sla",
        "/api/reports/notifications",
        "/api/reports/audit",
        "/api/reports/export/csv",
        "/api/reports/export/pdf"
    ]
    for ep in endpoints:
        resp = client.get(ep)
        assert resp.status_code == 401

def test_reports_authorized_json(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    endpoints = [
        "/api/reports/summary",
        "/api/reports/occupancy",
        "/api/reports/flow",
        "/api/reports/turnover",
        "/api/reports/sla",
        "/api/reports/notifications",
        "/api/reports/audit"
    ]
    for ep in endpoints:
        resp = client.get(ep, headers=headers)
        assert resp.status_code == 200, f"Failed on {ep}"
        assert resp.headers["content-type"] == "application/json"

def test_reports_export_csv(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/reports/export/csv", headers=headers)
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "text/csv; charset=utf-8"
    assert "attachment; filename=report_" in resp.headers["content-disposition"]
    content = resp.content.decode("utf-8")
    assert "Total Admissions" in content

def test_reports_export_pdf(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/reports/export/pdf", headers=headers)
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"
    assert "attachment; filename=report_" in resp.headers["content-disposition"]
    # check for PDF magic bytes
    assert resp.content.startswith(b"%PDF-")
