# Operational Intelligence Methodology
## Deterministic Bottleneck Detection
The engine evaluates timestamps from actual operational transactions (e.g., `Discharge Ready` -> `EVS Cleaning`). Bottlenecks are not "guessed" via opaque AI models; they are explicitly calculated by detecting SLA breaches at specific state transition gates.

## Why is this Patient Waiting?
- **Primary Blocker:** Strict isolation/ward constraints limiting eligible beds.
- **Secondary Factors:** High transport queue times preventing patient transfer even when a bed is allocated.

## 30-Second Executive View
Designed to answer:
1. **WHAT IS HAPPENING NOW?** (Active beds, queues, discharge-ready volume).
2. **WHAT WILL HAPPEN NEXT?** (Forecasted bottlenecks).
3. **WHAT NEEDS ATTENTION?** (Actionable priority alerts).
