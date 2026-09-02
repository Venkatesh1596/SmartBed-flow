# SmartBed Flow Production Smoke Test

**Purpose**: Verify the live system operates correctly post-deployment.

## Workflow Validation Matrix

1. **Login & RBAC**
   - [x] Login successfully as clinical personnel.
   - [x] Verify unauthorized routes reject with 403 Forbidden.

2. **Dashboard & Metrics**
   - [x] Dashboard loads seamlessly.
   - [x] KPI metrics render correctly.

3. **Admission & Bed Allocation**
   - [x] Create a synthetic admission.
   - [x] Use Bed Allocation module to assign eligible bed.
   - [x] Verify bed state reflects "OCCUPIED".

4. **Clinical Workflows**
   - [x] Update Discharge Readiness milestones.
   - [x] Trigger EVS task and transition to "CLEANING".
   - [x] Complete EVS task and verify bed state returns to "AVAILABLE".

5. **Operational Logistics**
   - [x] Request Patient Transport and complete workflow.
   - [x] Request/Reserve Equipment and release back to availability.

6. **WebSockets (Real-time updates)**
   - [x] Open two parallel browser sessions.
   - [x] Modify a bed state in Session A.
   - [x] Verify immediate UI reflection in Session B without manual refresh.

7. **System Cleanup**
   - [x] Conclude tests.
   - [x] Terminate test patient/data cleanly to prevent production skew.
