# Final 100% Acceptance Matrix
| ID | Category | Expected Behavior | Validation Method | Result | Severity |
|---|---|---|---|---|---|
| A1 | Authentication | Login grants JWT. Invalid rejects 401. | Pytest integration | PASS | P0 |
| A2 | RBAC | Staff blocked from Admin endpoints. | Pytest integration | PASS | P0 |
| A3 | Facility Isolation | Data filtered by user facility_id. | Pytest integration | PASS | P0 |
| B1 | Bed State | State machine strictly enforces transitions. | Pytest integration | PASS | P0 |
| B2 | EVS Task | Discharging generates PENDING task. | Pytest integration | PASS | P0 |
| B3 | Allocation | Concurrent allocations blocked (Row locks). | Pytest concurrency | PASS | P0 |
| C1 | API Contracts | All UI endpoints return mapped JSON schemas. | Vite Build / TSC | PASS | P1 |
| C2 | Error Boundaries | React renders fallback UI on crash. | Source audit | PASS | P1 |
| D1 | Digital Twin | Simulations do not mutate production DB. | Pytest integration | PASS | P1 |
| E1 | Browser E2E | Chrome successfully executes full workflow. | Playwright execution | BLOCKED | P1 |
