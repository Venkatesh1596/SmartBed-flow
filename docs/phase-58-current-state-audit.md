# Phase 58 Current State Audit
- **Architecture**: Monolithic FastAPI backend, React/Vite/TS frontend. PostgreSQL for persistence.
- **Frontend Routes**: Dashboard, Beds, EVS, Predictions, Simulation, Admin, Executive, Workload.
- **Backend Routes**: Matches frontend via `/api/v1/` prefix.
- **Database Models**: Base, User, Bed, Encounter, Event, AuditLog.
- **Security**: JWT-based Authentication, RBAC via `RoleChecker` Dependency.
- **WebSocket**: Unified WebSocket router for real-time operational state broadcast.
- **Known Limitations**: Synthetic data only; no medical decision support. Browser automation not present in dev environment.
