# Final Operational Acceptance Report

## 1. Scope
End-to-End business workflow verification of SmartBed Flow. 

## 2. Test Environment
- Backend Validation: Pytest 
- Database Validation: Alembic / SQLite (Test) / PostgreSQL (Prod Config)
- Frontend Validation: TypeScript AST / Vite Build
- Graphical UAT: Headless Container OS (Blocked)

## 3. Users Tested
`SYSTEM_ADMIN`, `REGIONAL_DIRECTOR`, `FACILITY_MANAGER`, `STAFF` successfully executed and isolated via `test_auth.py` and `test_roles.py`.

## 4. Core Bed-Flow Workflow
Admission → Readiness → Discharge → Cleaning → Available → Allocation is programmatically **VERIFIED_BY_AUTOMATION**. The state machine rejects invalid skips (e.g., OCCUPIED directly to AVAILABLE).

## 5. Multi-User Workflow
Handoffs persist immediately to the database and invalidate downstream queries. **SOURCE_VERIFIED** via React Query invalidation logic and **VERIFIED_BY_AUTOMATION** via DB commit testing.

## 6. Concurrency
Double-click/race conditions are prevented by SQLAlchemy `with_for_update()` row-level locks on beds and EVS tasks, safely returning HTTP 409 on collisions. **VERIFIED_BY_AUTOMATION**.

## 7. RBAC & Facility Isolation
Verified passing. No cross-facility leakage occurs.

## 8. Defects Found
0 new defects found in underlying logic. 

## 9. Environment Limitations
- **BROWSER UAT:** Playwright Chromium binary blocked by OS dependencies.
- **REALTIME WEBSOCKET DUAL-SESSION:** Cannot physically emulate two separate browser viewports in this headless environment.

## 10. Final Categorical Acceptance
**VERIFIED WITH DOCUMENTED ENVIRONMENT LIMITATIONS**
