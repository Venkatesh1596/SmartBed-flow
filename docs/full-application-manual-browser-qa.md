# Full Application Manual Browser QA

## Status
**NOT EXECUTED**
Browser automation was unavailable in the current environment context. All physical layout and interaction testing must be performed manually.

## Checklist for QA Engineer

### 1. Navigation & App Shell
- [ ] Login as `SYSTEM_ADMIN`. Verify redirect to Dashboard.
- [ ] Verify Sidebar contains all modules (Admin, Dashboard, Beds, EVS, Predictions, Simulation).
- [ ] Resize viewport to mobile dimensions. Verify Sidebar collapses.

### 2. Core Operational Workflow
- [ ] Navigate to **Beds**. Click "Discharge Ready" on an Occupied Bed.
- [ ] Verify state changes to `DISCHARGE_READY`.
- [ ] Navigate to **Command Center**. Verify Bed appears in Discharge Queue.
- [ ] Approve EVS Request. Navigate back to Beds. Verify State is `CLEANING`.

### 3. API Error Bounds
- [ ] Block network in DevTools. Refresh. Verify `OfflineState.tsx` displays.
- [ ] Clear LocalStorage token. Verify redirect to `/login`.

### 4. Simulation & Validation
- [ ] Navigate to `/evaluation`.
- [ ] Verify baseline numbers load and do not crash `.map()`.
- [ ] Verify no new beds appear in the production view after running the evaluation simulator.
