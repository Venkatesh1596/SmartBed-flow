# Full Runtime API Contract Audit

| Route | Component | API Client | HTTP Request | Backend Endpoint | DB Source | Response Shape | Frontend Expected Shape | Match |
| ----- | --------- | ---------- | ------------ | ---------------- | --------- | -------------- | ----------------------- | ----- |
| /login | Login.tsx | login | POST /auth/login | uth.py | users | {access_token, user} | {token, user} | YES |
| /dashboard | Dashboard.tsx | etchDashboardSummary | GET /dashboard/summary | dashboard.py | DB Aggregation | DashboardSummary | DashboardSummary | YES |
| /beds | BedsList.tsx | etchBeds | GET /beds | eds.py | eds | List[BedResponse] | Bed[] | YES |
| /capacity | CapacityPlanning.tsx | etchCapacityPriorities | GET /capacity/priorities | capacity.py | DB Aggregation | CapacityPriority (Dict) | CapacityPriority[] | FIXED |
| /events | EventsList.tsx | etchEvents | GET /events | events.py | hospital_events | List[HospitalEventResponse] | HospitalEvent[] | YES |
| /predictive-operations | PredictiveOperations.tsx | etchPredictiveTrends | GET /predictive-operations/trends | predictive_operations.py | Computed | List[PredictiveTrendPoint] | PredictiveTrendData | FIXED |
| /evaluation | Phase24Evaluation.tsx | etchPhase24Validation | GET /validation/phase24/summary | phase24_validation.py | Computed | EvaluationSummary | Phase24ValidationResult | FIXED |
| /simulation | SimulationCenter.tsx | etchSimulationScenario | GET /simulation/scenario | simulation_service.py | Mock/Sandbox | SimulationResult | SimulationResult | YES |
| /workload | WorkloadPrioritization.tsx | etchWorkloadKPIs | GET /workload/summary | workload.py | Computed | WorkloadSummary | WorkloadKPIs | FIXED |
| /reports | Reports.tsx | etchReportSummary | GET /reports/summary | eports.py | Computed | ReportSummary | ny | YES |
| /admin | AdminDashboard.tsx | etchAdminUsers | GET /admin/users | dmin.py | users | List[UserResponse] | AdminUser[] | YES |

