# Viva Architecture Guide

### Why React?
Component-based UI allows for modular development of complex dashboards (Ward, EVS, Command Center).

### Why TypeScript?
Provides strict static typing that cleanly mirrors our backend Pydantic schemas, eliminating runtime data-shape errors.

### Why FastAPI?
Extremely fast, asynchronous Python framework. Built-in Swagger docs and automatic Pydantic validation ensure strict API boundaries.

### Why PostgreSQL?
Provides ACID compliance and relational integrity, which is mandatory for healthcare operational tracking (e.g., Bed cannot be deleted if active Encounters exist).

### Why SQLAlchemy & Alembic?
SQLAlchemy (ORM) abstracts raw SQL and provides row-level locking (`with_for_update()`). Alembic version-controls the database schema migrations safely.

### Why JWT & RBAC?
Stateless secure authentication (JWT) combined with Role-Based Access Control (RBAC) ensures users (e.g., STAFF) cannot access Executive endpoints.

### Why WebSocket?
Provides realtime dispatching (e.g., pushing EVS Tasks instantly to cleaner tablets) without the overhead of HTTP polling.

### Why not Autonomous Clinical Decision-Making?
This is an *operational coordination* platform, not a medical AI. Safety dictates that human managers always have the final approval over bed allocation.
