# API Reference

SmartBed Flow exposes a strict, Pydantic-validated REST API via FastAPI.

## Authentication & Authorization
All secured endpoints require the `Authorization: Bearer <JWT>` header.
Roles: `SYSTEM_ADMIN`, `REGIONAL_DIRECTOR`, `FACILITY_MANAGER`, `STAFF`.

## Core Endpoints

### Auth `[POST] /api/auth/token`
- **Role:** ANY
- **Description:** Accepts OAuth2 password form. Returns JWT `access_token`.

### Beds `[GET, POST, PUT] /api/beds/`
- **Role:** `FACILITY_MANAGER`, `STAFF` (Read-only for some)
- **Description:** Manages bed state. Updates trigger `HospitalEvent` emissions.

### Encounters `[GET, POST, PUT] /api/encounters/`
- **Role:** `FACILITY_MANAGER`, `STAFF`
- **Description:** Tracks patient admission and discharge readiness. 
- **Constraint:** `discharge()` action cascades to set the linked Bed to `CLEANING` and spawns an `EVSTask`.

### EVS `[GET, PUT] /api/evs/`
- **Role:** `FACILITY_MANAGER`, `STAFF`
- **Description:** Manages cleaning tasks. Completion updates Bed to `AVAILABLE`.

### Allocation `[GET, POST] /api/allocation/`
- **Role:** `FACILITY_MANAGER`
- **Description:** Matches patients to available beds. Uses pessimistic row locking (`with_for_update()`) to prevent race conditions.

### Analytics & Reports `[GET] /api/analytics/`
- **Role:** `REGIONAL_DIRECTOR`, `FACILITY_MANAGER`
- **Description:** Aggregates operational KPIs (turnover time, utilization).
