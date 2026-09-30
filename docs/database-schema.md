# Database Schema & Data Models

The PostgreSQL database is managed via SQLAlchemy ORM and Alembic migrations.

## Core Entities
1. **Facility:** The highest organizational boundary. All operational data enforces `facility_id` foreign keys.
2. **User:** Tracks authenticatable identities. Stores hashed passwords and enum `Role`.
3. **Ward:** A subdivision of a Facility containing multiple Beds.
4. **Bed:** Represents physical capacity. Includes a strict enum `Status` (`OCCUPIED`, `CLEANING`, `AVAILABLE`).
5. **Encounter:** Represents a patient stay. Tracks admission time and `discharge_readiness`.
6. **EVSTask:** Represents a cleaning job. Enforces a foreign key to `Bed`.
7. **AuditLog:** Immutable ledger of state changes.

## Important Constraints & Relationships
- **Referential Integrity:** `Encounter.bed_id` -> `Bed.id`. Deleting a Bed fails if active Encounters exist.
- **Unique Constraints:** `User.email` must be unique.
- **Row-Level Locking:** Highly contested tables (`Bed`, `EVSTask`) are locked during transactional updates to prevent dual-assignment.

## State Enums
- `BedStatus`: `AVAILABLE`, `OCCUPIED`, `CLEANING`, `MAINTENANCE`.
- `TaskStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`.
