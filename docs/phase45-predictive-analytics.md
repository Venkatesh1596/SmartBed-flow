# Phase 45 - Live Predictive Analytics & Discharge Forecasting Engine

## Architecture
Introduces the PredictionEngine service bridging deterministic historical medians with live real-time operational states.

### Models
- Prediction: A unified ledger tracking ETA, confidence (0-100), 
isk_level, and explanation JSON arrays.
- ForecastSnapshot: Macro facility-wide aggregates generated per shift.
- PredictionMetric: The ML-ops evaluation ledger (MAE, median absolute error) scoring past predictions against actual completion times.

### Predictive Determinism
The baseline provider relies on median-calculation queries across historical udit_logs and module timelines (e.g., median EVS cleaning time for Ward A).
Confidence decays dynamically if:
1. Sockets are offline.
2. Source data (e.g., Clinical Readiness) has not been updated in > 45 minutes.

### Endpoints
/api/predictions/dashboard: Aggregate macro facility view.
/api/predictions/recalculate: Targeted webhook invoked selectively by the WebSocketManager when a critical state shift (e.g. Transport Arrived) demands downstream ETA adjustments.
