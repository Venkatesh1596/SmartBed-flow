# Phase 37 - Bed Allocation & Orchestration

## Architecture
The Bed Allocation system introduces a deterministic recommendation engine (ackend/app/services/bed_allocation.py) integrated deeply with our hybrid WebSocket layer. It calculates suitability scores in real-time, matching Encounters to Available Beds based on facility bounds and state.

## Concurrency Protection
The engine uses strict ACID transactional locking via SQLAlchemy with_for_update(). This guarantees that if two users attempt to allocate the exact same recommended bed simultaneously, only the first request succeeds; the second safely rolls back and reports an explicit CONFLICT error, preventing duplicate assignments.

## Transfer Workflow Integration
When performing a transfer, the engine atomically updates the Encounter to the new bed and immediately downgrades the old bed's state to CLEANING. This instantly fires a downstream event to generate an EVSTask, linking Phase 36 functionality perfectly.

## WebSockets
Assignments broadcast ed.updated and encounter.updated immediately, triggering live merges in the Command Center and Bed Board without refetching untouched UI components.
