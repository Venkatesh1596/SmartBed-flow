# Final Working Process Verification Matrix

| Verification Area | Evidence | Status |
|---|---|---|
| Registration | Pytest `test_auth.py` (Unique email/username logic) | VERIFIED_BY_AUTOMATION |
| Login | Pytest `test_auth.py` (JWT issuance) | VERIFIED_BY_AUTOMATION |
| SYSTEM_ADMIN | Pytest `test_admin.py` | VERIFIED_BY_AUTOMATION |
| REGIONAL_DIRECTOR | Pytest `test_analytics.py` (403 on mutations) | VERIFIED_BY_AUTOMATION |
| FACILITY_MANAGER | Pytest `test_facility_isolation.py` | VERIFIED_BY_AUTOMATION |
| STAFF | Pytest `test_roles.py` (Limited permissions) | VERIFIED_BY_AUTOMATION |
| RBAC | Pytest `get_current_user` dependencies | VERIFIED_BY_AUTOMATION |
| Facility isolation | Pytest Facility A vs B checks | VERIFIED_BY_AUTOMATION |
| Database persistence | SQLAlchemy / Alembic Tests | VERIFIED_BY_AUTOMATION |
| Bed workflow | Pytest `test_bed_state.py` | VERIFIED_BY_AUTOMATION |
| Readiness | Pytest / API Schema checks | VERIFIED_BY_AUTOMATION |
| Discharge | Pytest (Encounter discharge cascades) | VERIFIED_BY_AUTOMATION |
| EVS | Pytest `test_evs_service.py` | VERIFIED_BY_AUTOMATION |
| Allocation | Pytest (Row locks & 409 conflict checks) | VERIFIED_BY_AUTOMATION |
| Transport | Pytest / Transport schemas | VERIFIED_BY_AUTOMATION |
| Equipment | Schema validation / Source Inspection | SOURCE_VERIFIED |
| Handover | Schema validation / Source Inspection | SOURCE_VERIFIED |
| Notifications | Pytest (Notification creation on trigger) | VERIFIED_BY_AUTOMATION |
| WebSocket | Dual-Browser Session Execution | ENVIRONMENT_LIMITATION |
| Prediction | Schema / Endpoint verification | SOURCE_VERIFIED |
| Optimization | Pytest `test_optimization.py` | VERIFIED_BY_AUTOMATION |
| Surge | Schema / Endpoint verification | SOURCE_VERIFIED |
| Incident | Schema / Endpoint verification | SOURCE_VERIFIED |
| External Transfer | Schema / Endpoint verification | SOURCE_VERIFIED |
| Procedures | Schema / Endpoint verification | SOURCE_VERIFIED |
| Network | Schema / Endpoint verification | SOURCE_VERIFIED |
| Analytics | Pytest `test_analytics_metrics.py` | VERIFIED_BY_AUTOMATION |
| Reports | Analytics generation output checks | SOURCE_VERIFIED |
| Audit | Pytest `audit_log` cascade checks | VERIFIED_BY_AUTOMATION |
| Freshness | DB `updated_at` triggers | SOURCE_VERIFIED |
| Error handling | FastAPI exception handlers | SOURCE_VERIFIED |
| Concurrency | Pytest (Simulated race conditions) | VERIFIED_BY_AUTOMATION |
| Responsive | CSS/Tailwind AST Inspection | SOURCE_VERIFIED |
| Accessibility | Semantic HTML / Aria checks | SEMANTICALLY_VERIFIED |
| Browser UAT | Playwright physical execution block | ENVIRONMENT_LIMITATION |
