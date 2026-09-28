# Phase 57 - Current State Audit

## Overview
This audit assesses the state of the SmartBed Flow application prior to the Phase 57 Modern Enterprise Application Upgrade. The primary goal is to establish what is working, what needs repair, and where architectural changes are required to support the new "Time to Next Safe Bed" primary KPI and freshness tracking.

## Working Pages & Components
- **Login / Register**: Authentication works and JWT issuance is functioning.
- **Dashboard (Overview)**: Renders basic metrics, but lacks freshness tracking and the Bed Flow Pipeline visualization.
- **Executive Dashboard**: Working (repaired in a previous phase), maps API contracts correctly.
- **Simulation Center**: Works and properly segregates scenario inputs, but currently lacks the dedicated Journey A/B capabilities.
- **Command Center & Predictive Operations**: Structurally functional after recent API contract repairs.
- **Admin Dashboard**: Users and Facilities render correctly with proper mapping.

## Incomplete / Missing Features for Phase 57
- **Application Shell**: Currently uses a basic structure. Lacks the modern Left Sidebar + Top Header cohesive shell.
- **Global Data Freshness**: `last_updated`, `freshness_state` (FRESH/AGING/STALE/MISSING), and `age_seconds` are not tracked.
- **Primary KPI (Time to Safe Bed)**: The backend event system (`hospital_events`, `discharge_events`, `cleaning_events`) exists, but the synthetic evaluation logic to calculate the exact duration from Discharge Readiness to Next Safe Bed is missing.
- **Discharge Readiness**: Needs a structured human-in-the-loop checklist UI.
- **Bed Flow Pipeline Visualization**: The primary Dashboard needs a pipeline view (Clinical Ready -> Discharge -> Cleaning -> Quality Check -> Available).
- **Synthetic Patient Journeys**: Not implemented.

## Security & RBAC Status
- `Depends(get_current_user)` is consistently applied on the backend.
- Facility isolation and role checks are present, but need rigorous preservation during the overhaul.

## UI/UX Status
- The UI currently lacks standardized `LoadingState`, `EmptyState`, and `ErrorState` primitives.
- Mobile responsiveness requires a full audit post-shell refactor.
- Accessibility (ARIA labels, semantic tags) needs enhancement.

## Next Steps
1. Create the `AppShell`, `Sidebar`, and `TopHeader` components.
2. Develop standard Global UI States (`FreshnessIndicator`, `EmptyState`).
3. Augment backend schemas (`schemas/`) to return `freshness` metadata.
4. Build the Synthetic Journey Simulator and Evaluation Engine for the primary KPI.
