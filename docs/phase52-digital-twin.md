# Phase 52 - Digital Twin & Sandbox Simulation

## Architecture
Introduces the SimulationEngine and SnapshotService. The Digital Twin framework operates strictly on cloned, in-memory (or sandboxed DB schema) representations of production states. 
**Crucial Safety Boundary:** A SimulationState context object is passed into modified Service Adapters (e.g., SimulationOptimizationAdapter) ensuring that no db.commit() ever reaches the production PostgreSQL schemas during a scenario run.

## Scenario Engine
Scenarios are composed of ScenarioChange deltas applied to an immutable DigitalTwinSnapshot. 
Example: CLOSE_WARD(3B) + REDUCE_EVS_CAPACITY(50%).
The Engine computes these synthetic deltas and feeds them into Phase 45 (Predictions), Phase 47 (Staffing), and Phase 51 (Optimizer).

## Breaking-Point Analysis
The system aggregates the simulated deltas to find the mathematical threshold where Operations fail. E.g., if EVS capacity is dropped by 40%, the system flags the exact synthetic hour where Bed Availability drops to 0, labeling it a SIMULATION-ESTIMATED BREAKING POINT.
