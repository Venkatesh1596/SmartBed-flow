# Database Workflow Verification

## Architecture
SmartBed Flow relies on a highly normalized PostgreSQL schema orchestrated by SQLAlchemy 2.0 and Alembic.

## Core Entities
- **Users / Roles:** `users`, `roles`, `user_roles`. Verified cascading deletes.
- **Facilities:** `facilities`, `wards`, `beds`. Verified parent-child FK relationships.
- **Operations:** `encounters`, `evs_tasks`, `transport_requests`. 

## Transaction Safety
- `with_for_update()` is rigorously applied in `BedService` and `EVSService` to prevent double-allocation race conditions during high-concurrency dispatch.
- Pytest suite specifically asserts 409 Conflict if optimistic/pessimistic locking detects a mid-air collision.

## Immutability
- Digital Twin / Simulation frameworks generate hashed, isolated in-memory instances using SQLite memory cloning. Production tables remain 100% untouched. VERIFIED via Pytest hashes.
