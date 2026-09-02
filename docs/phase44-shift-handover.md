# Phase 44 - Shift & Workload Handover

## Architecture
Introduces Shift, ShiftHandover, and HandoverItem models to strictly encapsulate cross-shift responsibilities. HandoverItems act as proxy pointers to underlying entity sources (e.g., source_entity_type = 'TRANSPORT', source_entity_id = 42).

## Auto-Discovery Engine
The ackend/app/services/handover.py module executes sweeping queries across all Phase 35-43 modules (EVS, Transport, Readiness, Equipment, Allocation) during Handover generation. Unresolved tasks are collated and instantly proposed to the outgoing manager.

## Source Synchronization
If a Porter marks a Transport Request as COMPLETED, an underlying SQLAlchemy lifecycle hook traverses active HandoverItems holding that source_entity_id and cleanly bumps their status to RESOLVED, keeping the Handover document perfectly synced without duplicate data entry.
