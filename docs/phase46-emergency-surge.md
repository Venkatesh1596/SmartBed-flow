# Phase 46 - Emergency Surge & Code Black Operations

## Architecture
Introduces the SurgeEvent tracking model and SurgeOverride ledger. Rather than permanently corrupting existing priority Enums (e.g., permanently elevating a Transport Request's priority), the Surge architecture overlays an active priority context that safely vanishes during the RECOVERY phase.

## State Machine
The facility surge lifecycle is strict:
INACTIVE -> ACTIVE -> DEESCALATING -> RECOVERY -> INACTIVE.
Only ADMIN and FACILITY_MANAGER roles may transition these states.

## Transport & EVS Integration
When a facility is in ACTIVE surge:
1. Transport queue natively sorts by surge_priority (if an override exists) ahead of original_priority.
2. EVS cleaning workflows remain governed by safety checks (QUALITY CHECK is mandatory). A surge cannot mark a contaminated bed as READY to bypass protocol. 

## Predictive Engine Integration
When Surge is active, Phase 45 Predictive Forecasters inject a context tag prediction_context = SURGE. Because historical baseline models (e.g. median EVS turnover) are unreliable during a Mass Casualty Event (MCI), Confidence scores automatically degrade by a weighted coefficient, alerting Command Center operators to rely on live manual overrides rather than deterministic ETA timelines.

## Recovery Mode
The transition back to INACTIVE is not instantaneous. RECOVERY mode flags all remaining un-reconciled Overrides (e.g. equipment borrowed out of cycle) for mandatory administrative review. Once reconciled, INACTIVE state returns the predictive engine and queues to baseline.
