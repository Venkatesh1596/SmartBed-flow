# Phase 49 - Outpatient, Day Surgery & Procedural Throughput

## Architecture
Introduces ProceduralEpisode and ProceduralCapacityConfig. It decouples patients from mandatory Bed assignments, instead mapping them dynamically to ProceduralBay slots that iterate rapidly.

## State Machine
SCHEDULED -> CHECKED_IN -> WAITING -> IN_PROCEDURE -> RECOVERY -> DISCHARGE_READY -> DEPARTED. 
This intentionally differs from the Inpatient lifecycle.

## Cross-Module Synthesis
This phase represents the unification of the entire platform:
- **EVS (Phase 36)**: When a ProceduralEpisode transitions to DEPARTED, its underlying ProceduralBay falls immediately into CLEANING, spinning up an automated EVSTask.
- **Transport (Phase 42)**: Moving from WAITING to IN_PROCEDURE spawns a standard TransportRequest directed at the PORTER queue.
- **Equipment (Phase 43)**: Reserving a portable Ultrasound for the Episode depletes inventory dynamically.
- **Staffing (Phase 47)**: Piling 8 patients into RECOVERY against a StaffingCapacityConfig of 4 triggers a CRITICAL operational staffing workload alarm.
- **Predictions (Phase 45)**: The ETA for DISCHARGE_READY shifts forward automatically if a preceding Equipment delay occurs.
