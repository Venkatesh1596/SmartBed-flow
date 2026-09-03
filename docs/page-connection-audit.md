# SmartBed Flow Page Connection Matrix

## Routes Inventory

| Path | Component | Protection | API Endpoints Called | Status |
|---|---|---|---|---|
| `/login` | `Login` | None | `/auth/login` | PASS |
| `/register` | `Register` | None | N/A | PASS |
| `/` | `Dashboard` | `ProtectedRoute` | `/dashboard/summary`, `/dashboard/occupancy-trend`, `/dashboard/flow-analytics`, `/dashboard/alerts` | PASS |
| `/beds` | `BedsList` | `ProtectedRoute` | `/beds`, `/beds/{id}/status`, `/beds/{id}/admit`, `/beds/{id}/discharge` | PASS |
| `/events` | `EventsList` | `ProtectedRoute` | `/events`, `/events/{id}` | PASS |
| `/control-tower` | `ControlTower` | `ProtectedRoute` | `/control-tower/summary`, `/control-tower/operational-queue`, `/control-tower/attention` | PASS |
| `/command-center` | `CommandCenter` | `ProtectedRoute` | `/command-center/summary`, `/command-center/wards`, `/command-center/bed-priority` | PASS |
| `/audit` | `AuditTrail` | `ProtectedRoute` | `/audit/summary` | PASS |
| `/notifications` | `NotificationCenter` | `ProtectedRoute` | `/notifications`, `/notifications/unread-count` | PASS |
| `/executive` | `ExecutiveDashboard` | `ProtectedRoute` | `/executive/summary`, `/executive/performance` | PASS |
| `/evaluation` | `Phase24Evaluation` | `ProtectedRoute` | `/validation/phase24/summary` | PASS |
| `/reports` | `Reports` | `ProtectedRoute` | `/reports/summary` | PASS |
| `/admin` | `AdminDashboard` | `ProtectedRoute` | `/admin/config`, `/admin/health`, `/admin/users` (Summary mocked locally) | PASS |
| `/capacity` | `CapacityPlanning` | `ProtectedRoute` | `/capacity/summary`, `/capacity/wards`, `/capacity/trends` | PASS |
| `/orchestration` | `WorkflowOrchestration` | `ProtectedRoute` | `/orchestration/summary`, `/orchestration/allocation-candidates` | PASS |
| `/predictive-operations` | `PredictiveOperations`| `ProtectedRoute` | `/predictive-operations/summary`, `/predictive-operations/trends` | PASS |
| `/simulation` | `SimulationCenter` | `ProtectedRoute` | `/simulation/scenario`, `/simulation/compare` | PASS |
| `/workload` | `WorkloadPrioritization`| `ProtectedRoute` | `/workload/summary` | PASS |
| `/benchmarking` | `FacilityBenchmarking`| `ProtectedRoute` | `/benchmarking/summary` | PASS |

## Integration Notes
- Global UI: Fixed previous Sidebar and AppShell integration which omitted valid paths.
- All empty-state screens (`return null` traps) have been rewritten to provide `<EmptyState>` fallbacks.
- Checked API configuration: `import.meta.env.VITE_API_BASE_URL` properly targets `127.0.0.1:8000/api` preventing `Failed to fetch`.
- `AdminDashboard`: Backend doesn't support `/admin/summary`, replaced with local mock object containing active/total users to prevent crash. Re-aligned configuration fetch to `/admin/config` as `/admin/configuration` is invalid.
