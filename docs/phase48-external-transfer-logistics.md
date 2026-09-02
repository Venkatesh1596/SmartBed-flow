# Phase 48 - External Transfer & Logistics Gateway

## Architecture
Introduces the ExternalTransfer model. It represents external logistics (Ambulances, Rehab placements) that act as explicit **Discharge Blockers** for Encounters sitting in READY status.

## Discharge Blocker Integration
A patient who is clinically READY cannot be operationally discharged if an ExternalTransfer is attached and sits in PLACEMENT_PENDING or TRANSPORT_REQUESTED. The Encounter remains active, holding the physical bed hostage until the external asset physically arrives and triggers COMPLETED.

## Predictive Integration (Phase 45)
External ETAs strictly overwrite baseline prediction intervals. If the baseline predicted Bed Availability at 15:00, but an external Ambulance logs an ETA of 17:30, the Prediction Engine natively recalculates the downstream Bed Availability to 17:30+ and drops the Confidence interval to MEDIUM (alerting the command center to external dependency risk).

## Staffing Integration (Phase 47)
External transfers arriving require internal Porter intercepts. Consequently, an incoming ambulance ETA dynamically adds +1 to the localized Porter Workload prediction metric during the expected arrival window.
