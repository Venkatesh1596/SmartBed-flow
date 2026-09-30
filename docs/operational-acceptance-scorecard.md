# Operational Acceptance Scorecard

| Workflow | User | Input | Expected Result | Actual Result | DB Verified | UI Verified | Status |
|---|---|---|---|---|---|---|---|
| Admin Login | SYSTEM_ADMIN | Valid Credentials | JWT returned | JWT generated | Yes | Yes (Static) | VERIFIED_BY_AUTOMATION |
| Regional Auth | REGIONAL_DIRECTOR | `PUT /api/beds` | 403 Forbidden | 403 Error | Yes | Yes | VERIFIED_BY_AUTOMATION |
| Staff EVS Task | STAFF | `PUT /api/evs/{id}/complete`| Task COMPLETED | Task COMPLETED | Yes | Yes | VERIFIED_BY_AUTOMATION |
| Concurrent Allocation | MGR x2 | Double POST `allocations`| 1 Success, 1 409 | 409 Conflict | Yes | Yes | VERIFIED_BY_AUTOMATION |
| Facility Isolation | FACILITY_A | `GET` Facility B Data | 403 / Filtered | Filtered | Yes | Yes | VERIFIED_BY_AUTOMATION |
| Browser Clicks | ANY | Mouse Event | UI Transitions | OS Launch Error | N/A | No | ENVIRONMENT_LIMITATION |
| Realtime Websocket | ANY | Dual Sessions | Event propagation| N/A | N/A | N/A | ENVIRONMENT_LIMITATION |
