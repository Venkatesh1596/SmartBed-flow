# Testing and Validation

## Test Architecture

SmartBed Flow utilizes **pytest** as its core integration testing framework on the backend. The test architecture relies on:
- **Test Database:** Tests run against an isolated SQLite test database (`sqlite:///./test.db`) initialized and torn down during test runs to prevent production data mutation.
- **Fixtures:** Reusable testing fixtures provide authenticated test clients, populated roles (`SYSTEM_ADMIN`, `FACILITY_MANAGER`), and seeded baseline data.
- **Dependency Overrides:** FastAPI dependencies (such as `get_db` and `get_current_user`) are overridden during `TestClient` execution to enforce environment boundaries.
- **Transaction Isolation:** SQLAlchemy sessions are scoped per test, and the database schema is freshly dropped and created between integration suites.
- **API Integration Testing:** Tests validate the complete chain from the FastAPI router through the Service layer and down to the PostgreSQL persistence layer.

## Test Categories

The integration suite (95/95 passing tests) covers the following major functional categories:

### 1. Authentication and RBAC
- **What is tested:** Login processes, JWT generation, expired tokens, and role-based endpoint protection.
- **Important scenarios:** A `STAFF` user attempting to access a `SYSTEM_ADMIN` endpoint (e.g., `/api/admin/users`).
- **Expected behavior:** Secure token issuance for valid credentials.
- **Failure conditions:** Invalid credentials return 401. Unauthorized role access returns 403 Forbidden.

### 2. Facility Isolation
- **What is tested:** Cross-facility data access restrictions.
- **Important scenarios:** A user from Facility A attempting to view beds or encounters in Facility B.
- **Failure conditions:** Enforces 403 or filters query sets to ensure only authorized facility data is returned.

### 3. Bed State Transitions
- **What is tested:** Bed creation, modification, and strict state machine transitions (`AVAILABLE` -> `OCCUPIED` -> `CLEANING`).
- **Important scenarios:** Discharging a patient automatically sets the bed to `CLEANING`.
- **Expected behavior:** Associated encounters and audits update transactionally.

### 4. Discharge Readiness
- **What is tested:** Milestone checks, readiness status updates, and completion percentage logic.
- **Important scenarios:** Updating a clinical milestone (e.g., `Labs Cleared`) correctly recalculates the readiness percentage.

### 5. EVS Workflow
- **What is tested:** Environmental Services task generation, assignment, and completion workflows.
- **Important scenarios:** Rejecting a bed transition to `AVAILABLE` if the EVS quality check was not completed.
- **Failure conditions:** Attempting to assign an EVS task to a non-existent bed or invalid user returns 404 or 422.

### 6. Digital Twin / Simulation
- **What is tested:** Scenario executions for baseline vs. optimized comparisons.
- **Important scenarios:** Running a simulation loop ensuring that **no** records are saved to the production `beds` or `encounters` tables.
- **Failure conditions:** Unauthorized simulation triggers are blocked (403).

### 7. Analytics and Benchmarking
- **What is tested:** Aggregation queries determining the absolute time from clinical discharge readiness to next safe bed availability.
- **Important scenarios:** Calculating facility-level SLA compliance and utilization trends over time.

## Error Handling and Failure Scenarios

SmartBed Flow employs strict error boundaries across both the React frontend and FastAPI backend.

### Backend Exception Handling (FastAPI)
The backend utilizes deterministic `HTTPException` triggers:
- **401 Unauthorized:** Missing, invalid, or expired JWT tokens.
- **403 Forbidden:** Valid JWT, but lacking the required Role (`RoleChecker` dependency) or Facility Scope.
- **404 Not Found:** Resource requests (e.g., `/api/beds/{invalid_id}`) where the entity does not exist.
- **409 Conflict:** Concurrent bed allocation attempts or state transition violations (e.g., assigning a patient to an `OCCUPIED` bed).
- **422 Validation Error:** Pydantic schema validation failures (malformed JSON payloads).

### Frontend Error Boundaries (React)
- **Application Level:** A global `ErrorBoundary` wraps the entire React `App`. It captures uncaught UI rendering errors (like corrupted JSON payloads crashing `.map()`).
- **User-Visible Result:** The boundary suppresses raw stack traces and renders a friendly "Page failed to render" UI with actionable `Retry Loading` or `Return to Dashboard` buttons.
- **Component Level:** Key widgets utilize standard `ErrorState.tsx` fallbacks when Axios requests return 4xx/5xx status codes, ensuring the rest of the application remains functional.
