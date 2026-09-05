# Final Manual User Workflow Document

This document answers the critical operational question: **"Can a normal authorized operational user use SmartBed Flow starting from an empty operational database?"**

**Answer**: *NO. Functional gaps remain.* While clinical operations (admission, discharge, bed state) have functioning pathways, the administrative bootstrap process requires database-level seeding.

### Workflow Verification

1. **How to create a user**
   * *Gap*: Currently requires SQL/Admin seeding. `Register.tsx` exists but acts as a mock handshake pending SMTP integration. No internal User Management UI exists for admins.
2. **How to assign role**
   * *Gap*: Seed scripts (`seed_db.py`) inject `SYSTEM_ADMIN` and `STAFF`. No UI mechanism assigns roles.
3. **How to assign facility**
   * *Gap*: Handled purely via DB relations during seeding.
4. **How to create facility**
   * *Gap*: No UI form to add a new hospital/facility. 
5. **How to create ward**
   * *Gap*: No UI form to define a new ward.
6. **How to create bed**
   * *Gap*: No manual UI mechanism exists to add physical beds. Users can manage existing beds, but not provision them.
7. **How to set bed available**
   * *Verified*: Through `BedsList` or `Dashboard` quick actions, an authorized user can mark an EVS-completed bed as `AVAILABLE`.
8. **How to set bed occupied**
   * *Verified*: Automated upon patient Encounter admission.
9. **How cleaning starts**
   * *Verified*: Upon Discharge or Transfer, the state machine explicitly fires a `CLEANING` state which queues an EVS task.
10. **How EVS works**
    * *Verified*: EVS users see queue, Accept -> Start -> Complete workflow.
11. **How quality check works**
    * *Gap*: EVS completion immediately flags bed as `AVAILABLE`. Quality check is not explicitly isolated in the UI workflow.
12. **How bed becomes ready**
    * *Verified*: Handled seamlessly post-EVS.
13. **How admission works**
    * *Verified*: Simulated Encounters transition bed flags. 
14. **How allocation works**
    * *Verified*: Workflow Orchestration UI allows assigning queued patients to targeted beds.
15. **How discharge works**
    * *Verified*: Triggers Readiness pipeline and EVS event generation.
16. **How transport works**
    * *Verified*: Transport tasks map to discrete UI buttons in Control Tower.
17. **How equipment works**
    * *Gap*: Hardcoded UI mocks in certain widgets. No CRUD for equipment inventory.
18. **How handover works**
    * *Verified*: Shift change workflows are active in the Orchestration queue.
19. **How incidents work**
    * *Gap*: Audit trails log incidents, but the active Command Center Incident Generator relies on synthetic testing.
20. **How analytics receives data**
    * *Verified*: DB aggregates (Occupancy, Flow) feed Analytics directly.
21. **How reports receive data**
    * *Verified*: Direct fetch to `/api/reports/...` converting raw metrics to exportable data.
