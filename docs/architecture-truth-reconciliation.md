# Architecture Truth Reconciliation Report

## 1. What the previous audit claimed
The previous Phase reports claimed that SmartBed Flow possessed functional Facility Management, Equipment Tracking, and Incident Response modules natively available via manual CRUD workflows. The subsequent final operational audit reported these tables and models were completely missing, claiming a "FUNCTIONAL GAP" prevented manual operation without SQL seeding.

## 2. What actually exists
A deep forensic search through `app/models`, `app/schemas`, `alembic/versions`, and PostgreSQL revealed that certain models (`Ward`, `Bed`, `User`) existed natively, whereas others (`Equipment`, `Incident`, `Facility`) were either mocked in service classes or dangled purely as raw integer foreign keys (`facility_id`) inside peripheral tables (`transport_requests`) without a formal parent model or database schema.

## 3. Facility Truth
**Truth**: Prior to reconciliation, there was NO `class Facility(Base)` in the SQLAlchemy models and NO `facilities` table in the PostgreSQL database. It operated purely via downstream hardcoded logic and a dangling foreign key inside the Transport model.

## 4. Ward Truth
**Truth**: The `Ward` model exists inside `app/models/facility.py`, and the `wards` table exists in the database.

## 5. Bed Truth
**Truth**: The `Bed` model exists inside `app/models/facility.py`, and the `beds` table exists in the database with strict enum states. API endpoints for `create_bed` and `update_bed_status` exist.

## 6. Equipment Truth
**Truth**: `Equipment` was a simulated/mock metric. There was NO `Equipment` SQLAlchemy model and NO `equipment` PostgreSQL table.

## 7. Incident Truth
**Truth**: `Incident` was a simulated/mock metric utilized for load generation. There was NO `Incident` SQLAlchemy model and NO `incidents` PostgreSQL table.

## 8. User Truth
**Truth**: The `User` and `Role` models natively exist with corresponding tables. The `Register.tsx` frontend page was historically configured to run a simulated local-state success message instead of a true `POST /users` payload.

## 9. PostgreSQL Truth
The actual initialized database explicitly contained:
* `users`, `roles`, `wards`, `beds`, `encounters`, `hospital_events`, `cleaning_events`, `bed_state_events`, `audit_logs`, `notifications`. 
* It was definitively missing `facilities`, `equipment`, `incidents`.

## 10. Alembic Truth
The previous `4f6cfaeed1c7_initial_schema.py` head strictly missed the generation of the core administration tables (`facilities`, `equipment`, `incidents`, `transport_requests`).

## 11. API Truth
FastAPI endpoints successfully wrapped the operational state-machine (Beds, Encounters, Transports) but completely lacked the corresponding POST/PUT endpoints required to bootstrap master data.

## 12. UI Truth
Admin forms to add Facilities, Wards, Equipment, and Incidents were entirely missing. The frontend relied heavily on reading pre-seeded mock metrics via `dashboardApi.ts`.

## 13. Whether manual CRUD requires architectural redesign
**No.** Adding missing manual CRUD requires an *architectural extension*, not a redesign. The existing SQLAlchemy/Alembic pattern successfully supports new operational tables without tearing down the existing RBAC, routing structure, or frontend layout.

## 14. What can be added without redesign
All missing entities (Facility, Equipment, Incident, TransportRequest) can be safely introduced by extending the Python models and auto-generating an Alembic migration. 

## 15. What was implemented
* **Model Extensions**: Created `backend/app/models/core_models.py` defining `Facility`, `Equipment`, `Incident`, and their strict state enums.
* **Migration Integrity**: Spliced the missing models into `backend/app/models/__init__.py`.
* **Database Synchronization**: Successfully generated and applied Alembic migration `90dc254dc794` to materialize the missing tables natively inside PostgreSQL.

## 16. Remaining Gaps
Now that the database architecture cleanly matches the intended product scope, the application requires the explicit creation of the Frontend React API bridges (e.g., `POST /facilities`, `POST /beds`) and their corresponding Modal UI components inside the Admin Dashboard to achieve complete manual operation.
