# Manual User Operations Guide

## Overview
SmartBed Flow allows fully authorized clinical and administrative operations directly through the UI.

### 1. Administrative Provisioning
Administrators (SYSTEM_ADMIN) can fully bootstrap the system via the `AdminDashboard`.
**How to provision**:
1. Login as admin
2. Create facility via `ProvisioningModals`
3. Create ward via `ProvisioningModals`
4. Create user via `ProvisioningModals`
5. Assign role via Role dropdown
6. Assign facility to user
7. Login as facility manager
8. Create/manage bed via `ProvisioningModals`

### 2. Operational Workflows
**How bed availability is managed**:
Authorized STAFF and FACILITY_MANAGER roles can view the `/beds` list and use the action buttons to manually transition a `READY` or `CLEANING` bed into `AVAILABLE`.

**How patient admission works**:
9. Admission: Through the Orchestration engine, an admitted patient transitions an `AVAILABLE` bed to `OCCUPIED`.
10. Allocation: Patients are prioritized and allocated.
11. Discharge: Clicking Discharge marks the patient as discharged, triggering `CLEANING`.
12. EVS cleaning: The EVS queue handles `CLEANING` requests.
13. Quality check: Finishing EVS cleaning initiates quality checks.
14. Bed availability: The bed returns to `AVAILABLE` or `READY`.

**How auxiliary operations work**:
15. Equipment: Assets can be provisioned and assigned in the UI.
16. Transport: Transports are coordinated centrally via Control Tower.
17. Handover: Shift handovers are handled via notification/handover mechanisms.
18. Incident: Unforeseen incidents are created manually via `ProvisioningModals` on the Admin dashboard.
19. Dashboard verification: All states strictly query the unified PostgreSQL backend.

*Self-registration remains disabled. All accounts are strictly provisioned by an authorized administrator.*
