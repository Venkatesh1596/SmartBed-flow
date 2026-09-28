# Frontend-Backend API Contract Matrix

| Frontend API | Backend Endpoint | TS Type | Component | Status |
|--------------|------------------|---------|-----------|--------|
| `fetchExecutiveTrends` | `/api/executive/trends` | `ExecutiveTrend[]` | `ExecutiveDashboard.tsx` | FIXED |
| `fetchExecutiveComparison` | `/api/executive/comparison` | `ExecutiveComparison[]` | `ExecutiveDashboard.tsx` | FIXED |
| `fetchSimulationCompare` | `/api/simulation/compare` | `SimulationComparison` | `SimulationCenter.tsx` | FIXED |
| `fetchSimulationScenario` | `/api/simulation/scenario` | `SimulationResult` | `SimulationCenter.tsx` | FIXED |
| `fetchCapacityTrends` | `/api/capacity/trends` | `CapacityTrend[]` | `CapacityPlanning.tsx` | FIXED |
| `fetchWardCapacity` | `/api/capacity/wards` | `WardCapacityItem[]` | `CapacityPlanning.tsx` | FIXED |
| `fetchPredictiveTrends` | `/api/predictive-operations/trends` | `PredictiveTrendData` | `PredictiveOperations.tsx` | FIXED |
| `fetchFlowAnalytics` | `/api/dashboard/flow` | `FlowAnalyticsData` | `Dashboard.tsx` | PASS |
| `fetchOccupancyTrend` | `/api/dashboard/occupancy-trend` | `OccupancyTrendData` | `Dashboard.tsx` | FIXED |
| `fetchWorkloadPriorities`| `/api/workload/priorities` | `any` | `WorkloadPrioritization.tsx` | PASS |

*All APIs audited across the application footprint. Fixed root causes instead of masking them.*
