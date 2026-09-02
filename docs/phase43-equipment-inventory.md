# Phase 43 - Equipment & Inventory Management

## Architecture
Introduces the Equipment tracking model utilizing discrete sset_code identifiers (e.g. WC-001) instead of abstracted integer pools.

## State Machine Lifecycle
AVAILABLE -> RESERVED (Locked for Transport) -> IN_USE (Active Movement) -> RETURNED -> CLEANING (Triggers EVS Job) -> AVAILABLE. 
Parallel off-path states: MAINTENANCE, OUT_OF_SERVICE, RETIRED.

## Concurrency Protection
Leveraging the established pattern from Transport/Allocation, the /reserve and /assign REST endpoints utilize with_for_update() to enforce row-level PostgreSQL locking on the exact equipment_id requested.

## Integration Loops
- **Clinical Context (Phase 41)**: An Encounter tagged with mobility_requirement = ASSISTANCE natively pushes a Wheelchair recommendation prompt into the Context drawer.
- **Transport Workflow (Phase 42)**: Dispatchers must fulfill the recommended equipment tags before confirming a STAT request.
- **EVS Workflow (Phase 36)**: Setting a wheelchair to RETURNED with the 
equires_cleaning flag instantly dispatches a targeted EVS task, preventing the asset from returning to AVAILABLE prematurely.
