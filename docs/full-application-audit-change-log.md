# Full Application Audit Change Log

| Issue | Root Cause | File | Change | Why | Test | Result |
|---|---|---|---|---|---|---|
| Multiple `.map is not a function` errors | Mismatch between expected array and returned dict API objects | `frontend/src/api/dashboardApi.ts`, `frontend/src/components/*.tsx` | Re-typed the interfaces and safely destructured nested FastAPI payloads (`fetchPredictiveSummary`, etc) | React crashed on render due to iterating over dicts. | Render pages | Passed |
| Missing Polymorphic Identity | SQLAlchemy ORM lacked `MAINTENANCE` type | `backend/app/models/event.py` | Registered `MaintenanceEvent` inherited from `HospitalEvent` | Queries threw 500 when instantiating raw DB rows | Pytest Event DB test | Passed |
| Secret Leakage / Pytest Failure | Fake test scripts colliding with Pytest autodiscovery and duplicating `.env` | `test_endpoints.py`, `test_apis.py`, `backend/app/core/config.py` | Renamed fake scripts to `script_*.py`. Refactored `config.py` `env_file` to absolute path. Deleted root `.env`. | Prevent secrets leaking in root, and fix collection collisions | Pytest | 95/95 Passed |
| Missing UI Safe States | Unhandled API delays/errors | `frontend/src/components/ui/` | Created `LoadingState`, `ErrorState`, `EmptyState`, `FreshnessIndicator` | Prevent blank screen of death | Typescript compilation | Passed |

*Note: All architectural and deep code fixes listed above were completed successfully in the preceding Phase 57 and Runtime API Repair iterations.*
