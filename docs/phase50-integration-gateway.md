# Phase 50 - Integration Gateway & EMR Sync

## Architecture
Introduces a hardened integration border. The IntegrationGateway validates incoming payloads (HL7v2 / FHIR R4), wraps them in an IntegrationMessage envelope, deduplicates using cryptographic hashing of the payload against the external_message_id, and parks them in a processing ledger before executing downstream mutations.

## Reconciliation vs Reality
SmartBed Flow is the Source of Truth for *Operational Bed Reality*. If an EMR sends an ADT^A03 (Discharge) but the patient physically has an Active ExternalTransfer ambulance blocker, the Gateway flags the Integration Event as RECONCILIATION_REQUIRED. It does NOT force the Bed to CLEANING prematurely. 

## Idempotency & Concurrency
The Gateway utilizes PostgreSQL UNIQUE(facility_id, source_id, external_message_id) constraints combined with INSERT ... ON CONFLICT DO NOTHING patterns to guarantee that an EMR interface engine rapidly re-transmitting the same ADT^A01 10 times concurrently results in exactly 1 logical Encounter admission inside the domain core.

## Resilience (Dead Letters)
Malformed payloads or unmapped procedural locations fail gracefully. Transient errors hit an Exponential Backoff RETRY_PENDING loop. Terminal validation failures dump safely into DEAD_LETTER for administrative replay via the /api/integrations/messages/{id}/replay UI.
