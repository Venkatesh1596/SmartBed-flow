# Testing & Validation Architecture

## Unit and Integration Testing Methodology
SmartBed Flow relies on a comprehensive integration testing suite driven by `pytest`. The architecture ensures that every layer (API → Service → Database → Response) is validated sequentially and in isolation.

### Test Structure
- **Location:** `backend/app/tests/`
- **Fixtures:** `conftest.py` manages SQLAlchemy sessions, JWT generation, and test database (SQLite in-memory or isolated DB) spin-up/teardown.
- **Execution:** `pytest -v` (Provides verbose execution logs).

### Test Categories
1. **Authentication Testing:** Validates JWT generation, BCrypt password verification, and malformed token rejection (HTTP 401).
2. **RBAC Testing:** Asserts that endpoints reject unauthorized roles (HTTP 403). E.g., `STAFF` cannot access `/api/admin/users`.
3. **Facility Isolation Testing:** Injects opposing `facility_id` claims to ensure queries never return cross-facility patient data.
4. **Database & Transaction Testing:** Tests `db.commit()` and `db.rollback()` safety during complex operations.
5. **Concurrency Testing:** Simulates simultaneous requests for a single resource. Validates that `with_for_update()` pessimistic row locks throw safe HTTP 409 Conflicts.
6. **State-Machine Testing:** Enforces the Bed Lifecycle (`OCCUPIED` -> `CLEANING` -> `AVAILABLE`), ensuring invalid skips are rejected.
7. **Regression Testing:** Automated suite prevents regressions when new modules (like Prediction or Optimization) are introduced.

## ErrorBoundary Architecture
React's `ErrorBoundary` is integrated at the root level of the application tree (`App.tsx` / router boundaries). 

### Implementation Details
- **Component Structure:** Implements `componentDidCatch` and `static getDerivedStateFromError` to trap rendering exceptions in the Virtual DOM.
- **Fallback UI:** When an uncaught exception occurs (e.g., malformed API payload causing a rendering crash), the ErrorBoundary intercepts the crash and replaces the broken component tree with a safe, user-friendly fallback screen ("Something went wrong").
- **Recovery:** Offers a safe "Reload Application" recovery button, preventing the user from being stuck on a blank white screen.
- **System Stability:** Ensures that a failure in one isolated component (e.g., an Analytics chart) does not bring down the critical Bed Command Center.
