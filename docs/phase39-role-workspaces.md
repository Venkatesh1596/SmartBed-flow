# Phase 39 - Role-Specific Workspaces & Modern User Experience

## Architecture Overview
Phase 39 transforms the unified UI shell into a strict, role-driven application tailored to the specific operational workflows of ADMIN, FACILITY_MANAGER, and STAFF.

## Landing Pages
- /admin: Aggregates cross-facility usage, user accounts, deep audit trails, and core configuration settings.
- /manager: The operational command layer focusing on active bottlenecks (Cleaning SLAs, Discharge blockages, Bed recommendations).
- /staff: Highly scoped to the user's specific ward, bringing immediate EVS task acceptances and Clinical Readiness milestones to the forefront.

## Global Shell Upgrades
- The application layout now utilizes a unified Header & Sidebar navigation pattern.
- Persistent WebSocket connection status is cleanly displayed via a live top-bar indicator.
- AuthContext protects the root routes inherently; attempting to visit /manager as a STAFF member yields an immediate 403 Forbidden intercept instead of partial dashboard loads.
- Global ErrorBoundaries and targeted suspense/loading states (skeletons) wrap all network boundaries to entirely eliminate blank-page crashes.

## Quick Actions
Each workspace exposes context-aware CTAs directly on the dashboard:
- STAFF -> "Review Pending Tasks"
- MANAGER -> "Allocate Urgent Bed"
- ADMIN -> "System Logs"
