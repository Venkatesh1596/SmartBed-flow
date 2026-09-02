# Phase 34 - Encounter Workflow

## Overview
This phase introduces a fully functional synthetic Encounter workflow mapping to real hospital bed flow dynamics, utilizing our Phase 33 Hybrid WebSocket architecture for immediate operational visibility.

## State Machine
The core Encounter entity transitions through these states natively supported by the backend:
- **ACTIVE**: Patient is admitted to a bed.
- **DISCHARGED**: Patient has departed the facility; bed enters CLEANING turnover.
- **CANCELLED**: Encounter was erroneously created or aborted before clinical care.

*(Note: States like TRANSFER_PENDING and DISCHARGE_READY are computationally derived from the BedState and Predictions engines, preserving the existing unified enum architecture rather than fragmenting state across multiple database tables.)*

## Admission Flow
1. **Trigger**: Authorized user (Admin/Facility Manager) clicks "Admit Patient".
2. **Action**: Synthetic demographics are generated (to avoid PHI), Urgency is selected, and an AVAILABLE bed is assigned.
3. **Commit**: Transaction creates the Encounter and transitions the Bed to OCCUPIED.
4. **Broadcast**: BED_STATUS_CHANGED fires over WebSockets, updating the live Bed Board immediately.

## Transfer Flow
1. **Trigger**: User selects an ACTIVE encounter and chooses a new destination bed.
2. **Validation**: Destination bed must strictly be AVAILABLE. 
3. **Commit**: Transaction releases original bed to CLEANING, updates encounter ed_id, and marks destination bed as OCCUPIED.
4. **Broadcast**: Multiple BED_STATUS_CHANGED events are fired, ensuring both wards update in real-time.

## Discharge Flow
1. **Trigger**: User selects an ACTIVE encounter with a readiness score exceeding the threshold, clicking "Discharge".
2. **Commit**: Encounter status becomes DISCHARGED, discharged_at timestamp is set. Current bed transitions to CLEANING.
3. **Broadcast**: WebSocket events fire; cleaning queues instantly populate on the EVS dashboard.

## Concurrency & Data Safety
- Transactions utilize SQLAlchemy session bounds to prevent double-assignment of the same bed.
- Zero actual Protected Health Information (PHI) is stored. All names are synthetic (e.g., Patient_8X2A).

## RBAC & Audit
- STAFF can only view and manage workflow transitions on their assigned units.
- FACILITY_MANAGER can perform overrides.
- All transitions generate an AuditLog entry detailing the actor, action, and timestamp.
