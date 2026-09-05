import sys
import json
import asyncio
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import create_access_token
from backend.app.db.session import SessionLocal

def get_token():
    return create_access_token(subject="1", role="SYSTEM_ADMIN", facility_id=1)

client = TestClient(app)
routes = [route.path for route in app.routes if hasattr(route, 'path')]

frontend_paths = [
    '/api/dashboard/summary',
    '/api/beds',
    '/api/events',
    '/api/dashboard/occupancy-trend',
    '/api/dashboard/flow',
    '/api/dashboard/turnover',
    '/api/dashboard/alerts',
    '/api/predictions/summary',
    '/api/predictions/bed-availability',
    '/api/predictions/bottlenecks',
    '/api/predictions/recommendations',
    '/api/command-center/summary',
    '/api/command-center/wards',
    '/api/command-center/bed-priority',
    '/api/command-center/discharge-queue',
    '/api/command-center/priorities',
    '/api/sla/summary',
    '/api/sla/workflows',
    '/api/sla/workflows/overdue',
    '/api/notifications',
    '/api/notifications/unread-count',
    '/api/notifications/read-all',
    '/api/audit/summary',
    '/api/admin/health',
    '/api/admin/config',
    '/api/admin/users',
    '/api/capacity/summary',
    '/api/capacity/wards',
    '/api/capacity/available-soon',
    '/api/capacity/trends',
    '/api/capacity/priorities',
    '/api/capacity/pressure',
    '/api/orchestration/summary',
    '/api/orchestration/allocation-candidates',
    '/api/orchestration/workflow-blockers',
    '/api/orchestration/ward-pressure',
    '/api/orchestration/operational-queue',
    '/api/orchestration/recommendations',
    '/api/orchestration/pressure',
    '/api/predictive-operations/summary',
    '/api/predictive-operations/trends',
    '/api/predictive-operations/wards',
    '/api/predictive-operations/warnings',
    '/api/predictive-operations/recommendations',
    '/api/simulation/scenario',
    '/api/simulation/compare',
    '/api/validation/phase24/summary'
]

missing = []
for p in frontend_paths:
    matched = False
    for r in routes:
        prefix = r.split('/{')[0]
        if p == r or p == prefix:
            matched = True
            break
    if not matched:
        missing.append(p)

print("Missing API Endpoints:")
for m in missing:
    print(m)
