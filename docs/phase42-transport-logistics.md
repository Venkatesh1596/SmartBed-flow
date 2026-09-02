# Phase 42 - Patient Transport & Logistics

## Architecture
Introduces the TransportRequest model encompassing a strict linear state machine for intra-hospital mobility (e.g. Porters pushing stretchers or wheelchairs).

## Transport State Machine
Valid transitions are tightly enforced at the API layer:
REQUESTED -> QUEUED -> ASSIGNED -> ACCEPTED -> IN_PROGRESS -> ARRIVED -> COMPLETED.
Terminal cancel states (CANCELLED) can only execute before IN_PROGRESS.

## Clinical Context Integration
Phase 41's ClinicalContext (oxygen, fall risk, mobility tags) automatically pre-fills the transport creation wizard, ensuring dispatchers and porters don't overlook critical isolation precautions during patient movement.

## Concurrency Protection
Like EVS and Allocations, claiming a TransportRequest invokes a strict with_for_update() transaction locking the row, eliminating race conditions when multiple porters view the same open task list.

## Facility Isolation
Transport arrays filter automatically by the caller's JWT acility_id claim, preventing staff in Campus A from dispatching Porters in Campus B.
