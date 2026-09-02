# Prediction Model Card
## Intended Use
Operational ETA forecasting for Bed Turnover events.
## Limitations
This is NOT a clinical AI. It does not predict medical outcomes, readmission probabilities, or diagnosis events.
## Confidence Interpretation
- **>80%**: Historically bounded, statistically highly probable.
- **<50%**: Data is stale, missing, or heavily blocked by external cascading delays (e.g. Equipment shortages).
