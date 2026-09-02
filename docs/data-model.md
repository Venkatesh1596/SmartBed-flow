# Data Model

The core relational data model for SmartBed Flow encompasses the following entities:

1. **Role**: RBAC roles like BED_MANAGER, CLINICAL_TEAM.
2. **User**: System users (staff), tied to a Role.
3. **Ward**: Physical hospital wards containing beds.
4. **Bed**: Represents a physical bed and tracks its current state (e.g. OCCUPIED, CLEANING_IN_PROGRESS).
5. **Encounter**: A synthetic hospital stay for a patient, represented by tokens.
6. **HospitalEvent**: Polymorphic base table for all events.
7. **ClinicalEvent**: Inherits from HospitalEvent, tracks clinical milestones.
8. **DischargeEvent**: Inherits from HospitalEvent, tracks discharge readiness and orders.
9. **CleaningEvent**: Inherits from HospitalEvent, tracks cleaning requests and completions.
10. **BedStateEvent**: Inherits from HospitalEvent, tracks transitions between bed states.
11. **HumanReview**: Tracks human-in-the-loop decisions (approvals, overrides).
12. **AuditLog**: Tracks system-level data changes and actions.
