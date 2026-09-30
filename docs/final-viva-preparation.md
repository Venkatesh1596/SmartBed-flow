# Final Viva Preparation Guide

## Architecture
1. **Why FastAPI?** High performance, async support, and native Pydantic validation.
2. **Why React?** Component-driven architecture ideal for real-time dashboards.
3. **Why PostgreSQL?** ACID compliance prevents corrupt medical/operational data.
4. **Why SQLAlchemy?** Provides robust ORM mapping and row-level locking (`with_for_update()`).
5. **Why Alembic?** Version-controls database schemas safely.
6. **Why JWT?** Stateless, scalable authentication.
7. **Why RBAC?** Ensures Staff cannot perform Executive operations.
8. **Why WebSocket?** Real-time operational dispatching without HTTP polling overhead.

## Database
9. **Major tables:** Users, Beds, Encounters, EVSTasks, AuditLogs.
10. **Foreign keys:** Maintain relational integrity (e.g., EVS Task must link to a valid Bed ID).
11. **Transactions:** Groups DB queries so if one fails, the whole block rolls back safely.
12. **with_for_update():** Locks a database row during read, preventing double-allocation of a single bed.
13. **Concurrency:** Handled via PostgreSQL row locks and returning HTTP 409 Conflicts.

## Security
14. **Passwords:** Hashed using Bcrypt.
15. **JWT:** Cryptographically signed tokens containing user identity and role.
16. **Facility Isolation:** Middleware intercepts requests and filters SQLAlchemy queries by `facility_id`.
17. **IDOR:** Prevented by facility isolation (users cannot access IDs outside their facility).
18. **Secrets:** Stored safely in `.env`, never committed to Git.

## Workflow & Evaluation
19. **Lifecycle:** Admitted -> Occupied -> Discharge -> Cleaning -> Available.
20. **Post-discharge:** Encounter closes, Bed status changes, EVS task spawns.
21. **EVS to Available:** EVS completion triggers the state machine to mark the bed ready.
24. **Evaluation Engineer:** Verifies software meets operational constraints structurally.
27. **Integration Testing:** Tests multiple components together (e.g., API + Database).
34. **Race-conditions:** Prevented by DB transactions and locking.

## Algorithms & Twins
35. **Prediction:** Uses deterministic baselines (historical averages), NOT machine learning.
40. **Human Approval:** Required because this is an operational tool, not autonomous clinical AI.
41. **Digital Twin:** An isolated SQLite memory sandbox to run "what-if" surge scenarios without mutating production Postgres.
