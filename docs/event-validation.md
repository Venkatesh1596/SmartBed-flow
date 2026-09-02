# Event Validation

The system enforces strict validation on incoming events to prevent illogical sequences that could disrupt the bed state machine.

## Rules
- A `DISCHARGE_ORDER` must not occur before `DISCHARGE_READINESS`.
- A `PATIENT_EXIT` must not occur before an admission.
- `CLEANING_STARTED` must not occur before a `PATIENT_EXIT`.
- `CLEANING_COMPLETED` must not occur before `CLEANING_STARTED`.
- `BED_AVAILABLE` must not occur before appropriate cleaning and verification.

Invalid events are rejected or explicitly flagged for human review.
