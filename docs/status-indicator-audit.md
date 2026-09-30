# Status Indicator Audit

| Entity | Indicator | Valid Backend States | Mapped Frontend Badges | Status |
|---|---|---|---|---|
| **Bed** | `status` | AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE | Green, Red, Yellow, Gray | VERIFIED |
| **Encounter** | `status` | PLANNED, ADMITTED, READY_FOR_DISCHARGE, DISCHARGED | Gray, Blue, Orange, Green | VERIFIED |
| **EVS Task** | `status` | PENDING, IN_PROGRESS, COMPLETED | Yellow, Blue, Green | VERIFIED |
| **Transport** | `status` | REQUESTED, IN_TRANSIT, ARRIVED | Yellow, Blue, Green | VERIFIED |
| **Alert** | `severity` | INFO, WARNING, CRITICAL | Blue, Orange, Red | VERIFIED |
