# Prediction Methodology
## Input -> Process -> Output
- **INPUT:** Real-time facility occupancy, active EVS tasks, historical throughput averages (baseline).
- **PROCESS:** Deterministic baseline aggregation and sliding window averages. (No fabricated ML models).
- **OUTPUT:** Forecasted capacity pressure and expected bed availability times.
- **LIMITATIONS:** High variance during mass casualty (surge) events.
- **HUMAN OVERSIGHT:** All predictions strictly require human authorization before execution (e.g., triggering a surge protocol).
