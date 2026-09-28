# Full Application Reverification Plan

## 1. Discovered Frontend Routes
- `/` (Dashboard)
- `/login`
- `/register`
- `/beds`
- `/capacity`
- `/predictive-operations`
- `/evaluation`
- `/simulation`
- `/workload`
- `/events`
- `/executive`
- `/command-center`
- `/orchestration`
- `/reports`
- `/admin`

## 2. Discovered Backend Endpoints
Based on OpenAPI and backend router:
- `/api/auth/*`
- `/api/audit/*`
- `/api/beds/*`
- `/api/capacity/*`
- `/api/command-center/*`
- `/api/dashboard/*`
- `/api/encounters/*`
- `/api/events/*`
- `/api/executive/*`
- `/api/notifications/*`
- `/api/orchestration/*`
- `/api/predictions/*`
- `/api/reports/*`
- `/api/simulation/*`
- `/api/sla/*`
- `/api/workload/*`
- `/api/validation/*`

## 3. Frontend API Modules
- `frontend/src/api/dashboardApi.ts`
- `frontend/src/api/authApi.ts`

## 4. Important Models
- `User`, `Role`
- `Bed`, `Facility`, `Ward`
- `Encounter`, `HospitalEvent` (Polymorphic: `MaintenanceEvent`, `ClinicalEvent`, etc.)
- `Notification`
- `AuditLog`

## 5. Important Services
- `capacity_service.py`
- `predictive_service.py`
- `executive_service.py`
- `orchestration_service.py`
- `simulation_service.py`

## 6. Authentication & RBAC Flow
- Standard OAuth2 password flow generating JWT tokens.
- Frontend uses context/hooks for JWT storage and interceptors.
- Backend RBAC enforces strict Role checks (e.g., `SYSTEM_ADMIN`, `FACILITY_MANAGER`).

## 7. WebSocket Flow
- Backend provides real-time updates via WebSocket for notifications and events.

## 8. Database Flow
- PostgreSQL using SQLAlchemy ORM.
- Alembic handles migrations.

## 9. Existing Tests
- Backend `test_integration_phase*.py` regression suites.

## 10. Known Runtime Problems
- Component mapping over dictionary structures natively returned by FastAPI (e.g., `/executive/trends`).
- Discrepancy between TS expected array structures and actual Pydantic serialized outputs.
- Destructuring empty objects unsafely.

## 11. Verification Strategy
1. Programmatically extract the OpenAPI Schema and compare every TS API function return type directly against the expected FastAPI response shapes via a Python cross-reference script.
2. Produce a comprehensive mapping table to identify all structural mismatches.
3. Update `dashboardApi.ts` so that it normalizes the API responses strictly to what components require or corrects the TS interfaces.
4. Modify components throwing React rendering exceptions (e.g. `.map is not a function`).
5. Guarantee empty, loading, and error states gracefully fallback without crashing the React virtual DOM.
6. Emulate actual runtime testing via headless HTTP verification across every endpoint.
