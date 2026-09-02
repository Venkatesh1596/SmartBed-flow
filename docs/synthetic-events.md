# Synthetic Events

To support the MVP without exposing real patient data, the system relies on a synthetic event generator (`simulations/generator.py`).

## Deterministic Generation
The generator uses a seeded random number generator (e.g., `seed = 42`) to ensure reproducible data for testing and stakeholder validation.

## Patient Journey
A normal synthetic journey models a full bed turnover cycle logically ordered in time:
1. `ADMISSION`
2. `CLINICAL_MILESTONE`
3. `DISCHARGE_READINESS`
4. `DISCHARGE_ORDER`
5. `PATIENT_EXIT`
6. `CLEANING_REQUESTED`
7. `CLEANING_STARTED`
8. `CLEANING_COMPLETED`
9. `BED_VERIFIED`
10. `BED_AVAILABLE`
