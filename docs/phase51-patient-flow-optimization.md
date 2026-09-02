# Phase 51 - Patient Flow Optimization

## Architecture
Introduces the AllocationOptimizer engine and OptimizationProvider abstraction. Currently powered by ConstraintOptimizationProvider, it performs deterministic scoring algorithms rather than black-box Reinforcement Learning. 

## The Matrix
Instead of greedy 1:1 matching, the engine constructs a bipartite candidate matrix of Eligible Encounters vs Assignable Beds. 
1. **Hard Constraints**: Immediate X generated for Infection Control mismatches (e.g. Airborne vs Standard Room) or missing critical Equipment.
2. **Soft Scoring**: Weights are dynamically pulled from OptimizationWeights. E.g., Predicted EVS Completion + Staffing Workload Strain + Surge Priority.

## Stale Protection
Recommendations map to a context_version fingerprint. If a Command Center user attempts to approve a recommendation from 15 minutes ago, but the target bed has since shifted to CLEANING, the API responds with 409 OPTIMIZATION_STALE and blocks the transaction entirely.

## Atomicity
When [APPROVE] is clicked, the system invokes Phase 37 Allocation services. It utilizes PostgreSQL row-level locking (SELECT FOR UPDATE) to claim the Bed and simultaneously reserves Phase 43 Equipment. If another concurrent manager clicks approve on the same bed for a different patient, the second request fails safely.
