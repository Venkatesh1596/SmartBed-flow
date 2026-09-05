# Known Issues & Pending Work

This document catalogues unresolved defects, architecture drift, or feature gaps documented during the final stabilization phase.

1. **Environmental Tests (`pytest`)**: The automated CI suite fails to mount configurations correctly outside of Docker because it expects `.env` secrets (`POSTGRES_USER`, `SECRET_KEY`, etc.) that are natively injected via `docker-compose`. `conftest.py` needs a mock database override to run unit tests purely in-memory (SQLite) during local Windows `pytest` runs.
2. **Missing Live Browser Test Automation**: End-to-end clicks using Playwright/Selenium were not natively available in this phase, blocking physical DOM traversal verification.
3. **Incomplete Backend Mappings**: The `WardOperationalSummary` in the frontend expects a `status` field, which the backend `command_center.py` endpoint does not natively serve (it relies on `occupancy_percent` and derived critical scores). This does not crash the UI because of strict defensive typing (`ward.status || 'Normal'`), but should be reconciled in Phase 2 for richer dashboard alerts.
4. **API Client Inconsistency**: The new `provisioningApi.ts` currently bypasses the standard `axios` instance because `axios` was physically absent from the node modules environment, causing `tsc -b` failures. A future phase should standardize entirely on `fetch` or properly install `axios`.

5. **Automated Testing Blockers:** Windows Execution Policies block native npm scripts; pytest fails because .env variables required by pydantic are omitted in non-Docker execution contexts.
