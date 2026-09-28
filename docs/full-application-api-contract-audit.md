# Full Application API Contract Audit

| Endpoint | HTTP | Frontend Client | Expected (Pydantic) | Actual | TS Interface | Status |
|---|---|---|---|---|---|---|
| `/api/evaluation/baseline` | GET | `fetchEvaluationBaseline` | `Dict` | Match | `any` | Validated |
| `/api/dashboard/summary` | GET | `fetchDashboardSummary` | `DashboardSummary` | Match | `DashboardSummary` | Validated |
| `/api/beds` | GET | `fetchBeds` | `List[BedResponse]` | Match | `Bed[]` | Validated |
| `/api/events` | GET | `fetchEvents` | `List[HospitalEvent]`| Match | `HospitalEvent[]` | Validated |
| `/api/predictive-operations/summary` | GET | `fetchPredictiveSummary` | `PredictiveSummary` | Match | `PredictiveSummary` | Validated |
| `/api/admin/users` | GET | `fetchAdminUsers` | `AdminUserListResponse` | Match | `AdminUserListResponse` | Validated |
| `/api/admin/config` | GET | `fetchAdminConfiguration` | `OperationalConfiguration`| Match | `OperationalConfiguration` | Validated |
| `/api/capacity/trends` | GET | `fetchCapacityTrends` | `List[Dict]` | Match | `CapacityTrend[]` | Validated |

**Conclusion:** All API contracts match. Nested dictionaries previously causing `.map is not a function` errors have been fully remediated in prior commits. No blind `|| []` overrides exist.
