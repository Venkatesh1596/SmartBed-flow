# Phase 47 - Clinical Staffing & Resource Utilization

## Architecture
Introduces the StaffMember model mapping directly to underlying users and acilities. This is strictly an operational workload overlay, not an HR/Payroll system.

## Capacity & Workload Engine
StaffingCapacityConfig tracks dynamic operational thresholds.
The Workload Engine automatically derives utilization by aggregating active tasks from Phase 36 (EVS) and Phase 42 (Transport) grouped against available staff. 
Example: 3 Active Porters / 12 Transport Requests = 400% Capacity Load -> Triggers CRITICAL Risk.

## Cross-Module Integration
- **Surge (Phase 46)**: If Code Black is declared, Staffing Risk immediately jumps thresholds (e.g. MEDIUM -> HIGH) because emergency processing overheads lower effective throughput.
- **Predictive (Phase 45)**: Short-term forecasting evaluates upcoming discharges (+60m window) against currently available staff, generating pre-emptive warnings if a bottleneck is predicted before it physically occurs.
- **Handover (Phase 44)**: Unresolved tasks caused by staffing deficits are tagged with Capacity Constraint metadata for shift carry-over clarity.

## Privacy
No salaries, home addresses, or disciplinary records are stored. Operational IDs and abstract workload counts are prioritized.
