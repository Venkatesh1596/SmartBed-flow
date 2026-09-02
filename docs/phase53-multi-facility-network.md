# Phase 53 - Multi-Facility Enterprise Command Center

## Architecture
Introduces the HealthSystem top-level grouping entity. Facilities are now scoped under a parent Health System. A new NetworkOptimizationProvider scales the Phase 51 optimizer to solve a bipartite matrix spanning multiple physical hospitals (e.g., Hospital A Overload -> Hospital B Availability).

## Workflow (No Autonomous Transfers)
The Network Load Balancer outputs Recommendations requiring Human Approval by a Regional Director. Once approved, the system does NOT magically teleport the patient; it hooks directly into the **Phase 48 External Transfer** workflow, creating a PLACEMENT_PENDING external request that initiates real-world ambulance dispatch and ETA tracking.

## Isolation
Health System A cannot view Health System B. Strict row-level security and Depends() injected SQLAlchemy filtering guarantees multi-tenant isolation. Facility Staff cannot view Regional dashboards, ensuring PHI minimization.

## Network Digital Twin
Phase 52 Sandbox logic is expanded. Regional Directors can simulate systemic catastrophic events (e.g., 'What if Hospital A loses 30 beds and Hospital B takes 50 emergency admissions?'). The simulation routes hypothetical transfer recommendations without mutating the production DB.
