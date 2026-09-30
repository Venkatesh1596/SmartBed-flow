# Final Technical Architecture

## Core Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind.
- **Backend:** Python 3, FastAPI, SQLAlchemy 2.0.
- **Database:** PostgreSQL 14+.

## Security Patterns
- **Authentication:** OAuth2 with Password Flow (Bearer JWT).
- **Authorization:** `RoleChecker` Dependency Injection in FastAPI.
- **Data Isolation:** `get_current_user` injects `facility_id` constraints to all SQL queries.

## Concurrency Patterns
- **Pessimistic Locking:** `db.query(Bed).with_for_update().filter(id=bed_id)` guarantees that two Facility Managers cannot simultaneously allocate the same bed.
