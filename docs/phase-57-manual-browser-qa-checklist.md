# Phase 57 Manual Browser QA Checklist

## Execution Status
**NOT EXECUTED**
*Reason: Browser automation is not available in the current environment context. All validations listed below must be executed by a human QA engineer.*

## Test Protocol

### 1. Unified App Shell & Navigation
- [ ] Login using valid credentials.
- [ ] Verify the layout utilizes the new `AppShell` (Sidebar left, Header top, main content right).
- [ ] Click through each item in the Sidebar (Overview, Bed Flow, Capacity, EVS, Transport, Simulation, Reports, Admin).
- [ ] Verify the `TopHeader` renders the Global Search bar and Facility Context badge correctly.
- [ ] Shrink the viewport to mobile width and verify the Sidebar collapses into a hamburger menu.

### 2. Operational Global States
- [ ] Throttle network to "Slow 3G" in DevTools.
- [ ] Reload the page and verify the explicit `LoadingState` (skeletons/spinners) appears.
- [ ] Using DevTools, block the `/api/dashboard/summary` request.
- [ ] Verify the `ErrorState` boundary triggers and displays a graceful fallback instead of a blank white screen.

### 3. Data Freshness System
- [ ] On the Dashboard, locate the new `FreshnessIndicator` component (e.g., near the Bed Flow pipeline).
- [ ] Verify it correctly displays the state (`FRESH`, `AGING`, `STALE`, `MISSING`) based on the API payload.
- [ ] Wait without refreshing for 5+ minutes and verify if the state visually degrades (or mock the `last_updated` payload via Charles/Fiddler).

### 4. Primary KPI & Bed Flow Pipeline
- [ ] On the Dashboard, verify the "Primary KPI: Time to Next Safe Bed" is prominently displayed at the top.
- [ ] Verify it clearly states "Synthetic Evaluation Data".
- [ ] Verify the "Absolute Saved" and "Improvement %" match the underlying API mathematical calculation.
- [ ] Verify the "Bed Flow Pipeline" visually represents the sequential transition: Clinical Ready -> Discharge -> Cleaning -> Quality Check -> Available.

### 5. Simulator Constraints
- [ ] Validate that executing the Baseline Evaluation APIs (`/api/evaluation/baseline`, `/api/evaluation/journey/routine`) does *not* create new records in the production UI tables (e.g. no phantom "Synthetic Patient" appears in the active Admissions list).
