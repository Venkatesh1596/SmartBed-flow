# Privacy-by-Design Requirement

This is a critical product requirement for SmartBed Flow.

The MVP must use synthetic/de-identified data only. 

## Prohibited Data
Do NOT create or require:
* patient name
* phone number
* home address
* national ID
* real medical record number
* real diagnosis narrative
* unnecessary medical history

## Allowed Data Identifiers
Use operational identifiers such as:
* `patient_token` (e.g., P10001)
* `encounter_token` (e.g., E20001)
* `bed_id`
* `ward_id`
* `care_level`
* `urgency_level`
* `clinical_readiness`
* `discharge_status`
* `cleaning_status`
* `bed_state`

Implement the architecture so that operational workflows can work without exposing direct patient identity.
