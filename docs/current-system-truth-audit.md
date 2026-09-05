# Current System Truth Audit

This document describes the *actual* architecture and canonical data mappings discovered during the final stabilization phase.

## 1. Domain Truth Mapping

| Domain | DB Model (SQLAlchemy) | Backend Endpoint | Frontend API (`dashboardApi.ts`) | Frontend Page | Response Shape (Canonical) | Status |
| ------ | -------- | ---------------- | ------------ | ------------- | -------------- | ------ |
| **Users** | `User`, `Role` | `/admin/users` | `fetchAdminUsers()` | `AdminDashboard.tsx` | Array of `{id, username, email, is_active, role: {id, name}}` | VERIFIED |
| **Facilities** | `Facility` | `/provisioning/facilities` | `createFacility()` | `ProvisioningModals.tsx` | Object `{id, name, code}` | VERIFIED |
| **Wards** | `Ward` | `/command-center/wards` | `fetchWardOperationalSummary()` | `CommandCenter.tsx` | Array of `{ward_id, ward_name, occupancy_percent, ...}` | VERIFIED |
| **Beds** | `Bed` | `/beds` | `fetchBeds()` | `BedsList.tsx` | Array of `{id, name, ward_id, state}` | VERIFIED |
| **Encounters** | `Encounter` | `/encounters/active` | `fetchEncounters()` | `ControlTower.tsx` | Array of active encounter contexts | VERIFIED |
| **Events** | `BedStateEvent` | `/events` | `fetchRecentEvents()` | `EventsList.tsx` | Array of `{id, bed_id, previous_state, new_state, timestamp}` | VERIFIED |
| **EVS Tasks** | `EVSTask` | `/evs/tasks` | `fetchEVSTasks()` | `WorkflowOrchestration.tsx` | Array of `{id, bed_id, status, assigned_to}` | VERIFIED |
| **Transport** | `TransportRequest` | `/transport/requests` | `fetchTransportRequests()` | `WorkflowOrchestration.tsx` | Array of `{id, patient_id, destination_id, status}` | VERIFIED |
| **Equipment** | `Equipment` | `/provisioning/equipment` | `createEquipment()` | `ProvisioningModals.tsx` | Object `{id, name, facility_id}` | VERIFIED |
| **Incidents** | `Incident` | `/provisioning/incidents` | `createIncident()` | `ProvisioningModals.tsx` | Object `{id, type, priority, description, facility_id}` | VERIFIED |
| **Analytics** | N/A (Aggregated) | `/executive/trends` | `fetchExecutiveTrends()` | `ExecutiveDashboard.tsx` | Array of `{date, occupancy_rate, opi}` | VERIFIED |

## 2. API Contract Normalization
The canonical API structure correctly resolves discrepancies between backend schemas and frontend expectations.
* **Beds State**: The canonical field is `state` (not `status`, `current_state`, or `bed_status`).
* **Wards**: Wards are structurally identified via `ward_id` on related models.
* **Collections**: Endpoints returning lists must natively return `[]` when empty to prevent `.map` null exceptions.

## 3. RBAC & Facility Isolation
* `SYSTEM_ADMIN`: Global cross-facility access. Has `RoleChecker(["ADMIN", "SYSTEM_ADMIN"])` rights.
* `FACILITY_MANAGER`: Constrained to resources mapped to their assigned `facility_id`.
* Endpoints like `/api/provisioning/*` accurately validate JWT-derived context to enforce isolation boundaries.
