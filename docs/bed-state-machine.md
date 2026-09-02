# Bed State Machine

Central bed state machine for SmartBed Flow.

## Required States:
- `OCCUPIED`
- `CLINICAL_REVIEW`
- `DISCHARGE_LIKELY`
- `CLINICALLY_READY`
- `DISCHARGE_ORDER_PENDING`
- `DISCHARGE_IN_PROGRESS`
- `PATIENT_EXITED`
- `CLEANING_PENDING`
- `CLEANING_IN_PROGRESS`
- `CLEANING_COMPLETED`
- `SAFETY_VERIFICATION`
- `SAFE_AVAILABLE`
- `BLOCKED`

## Validation Rules
The state machine must prevent invalid transitions.
For example, a bed must NOT become `SAFE_AVAILABLE` merely because clinical discharge readiness is true. The required downstream conditions (cleaning, verification) must be satisfied.
