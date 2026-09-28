# API Reference

SmartBed Flow's RESTful API is built on FastAPI and follows strict OpenAPI specifications. All endpoints are protected by JWT authentication and Role-Based Access Control unless specified otherwise.

## Domain API Overview

| Domain | Main API Area | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Login and JWT issuance |
| Beds | `/api/beds` | Bed management and state tracking |
| Readiness | `/api/encounters` | Discharge readiness checklists |
| EVS | `/api/evs` | Environmental services cleaning workflow |
| Transport | `/api/transport` | Patient transport request lifecycle |
| Allocation | `/api/allocation` | Bed allocation and constraint checking |
| Prediction | `/api/prediction` | Operational forecasting and bottlenecks |
| Simulation | `/api/simulation` | Synthetic digital twin scenarios |
| Analytics | `/api/analytics` | Utilization and KPI aggregation |
| Admin | `/api/admin` | System user and role administration |

---

## Detailed Endpoint Reference

### Authentication
**`POST /api/auth/login`**
- **Purpose:** Issue a JWT access token for a valid username/password.
- **Authentication:** None (Public)
- **Request Body:** OAuth2 `username` and `password` form data.
- **Response:** `{"access_token": "...", "token_type": "bearer", "user": {...}}`
- **Important Status Codes:** `200 OK`, `401 Unauthorized` (Invalid credentials).

### Beds
**`GET /api/beds/`**
- **Purpose:** Retrieve a list of beds filtered by status, ward, or facility.
- **Authentication:** Required (`get_current_user`)
- **Roles:** `STAFF`, `FACILITY_MANAGER`, `SYSTEM_ADMIN`
- **Response:** Array of `BedResponse` models.

**`PUT /api/beds/{bed_id}/status`**
- **Purpose:** Mutate a bed's operational state (e.g., `CLEANING` -> `AVAILABLE`).
- **Roles:** `STAFF`, `FACILITY_MANAGER`
- **Important Status Codes:** `409 Conflict` if the transition violates the state machine.

### Discharge Readiness
**`PUT /api/encounters/{encounter_id}/readiness`**
- **Purpose:** Update the clinical readiness milestone checklist.
- **Authentication:** Required
- **Request Body:** `ReadinessUpdateRequest` (boolean flags for milestones).
- **Response:** Re-calculated readiness percentage and status (e.g., `READY`).

### EVS (Environmental Services)
**`POST /api/evs/tasks`**
- **Purpose:** Generate a new bed-cleaning task.
- **Important Status Codes:** `422 Validation Error` if the bed is not in a discharged state.

**`PUT /api/evs/tasks/{task_id}/status`**
- **Purpose:** Update EVS task progress (`ASSIGNED` -> `IN_PROGRESS` -> `COMPLETED`).

### Bed Allocation
**`GET /api/allocation/recommendations`**
- **Purpose:** Query the optimization engine for eligible beds based on patient constraints.
- **Roles:** `FACILITY_MANAGER`, `STAFF`
- **Response:** Array of prioritized bed matches with soft/hard constraint scores.

**`POST /api/allocation/approve`**
- **Purpose:** Human-in-the-loop authorization to assign a recommended bed.
- **Important Status Codes:** `409 Conflict` (if another user just allocated the same bed).

### Predictive Operations
**`GET /api/prediction/summary`**
- **Purpose:** Retrieve forecasting insights for upcoming discharge availability and EVS workload.
- **Roles:** `REGIONAL_DIRECTOR`, `FACILITY_MANAGER`

### Simulation (Digital Twin)
**`POST /api/simulation/scenarios/{scenario_id}/run`**
- **Purpose:** Execute an isolated, in-memory synthetic operational scenario.
- **Security Scope:** Isolated transaction scope. Will not commit to `beds` or `encounters` tables.

### Administration
**`GET /api/admin/users`**
- **Purpose:** List system accounts.
- **Roles:** `SYSTEM_ADMIN` ONLY.
- **Important Status Codes:** `403 Forbidden` if a non-admin attempts access.
