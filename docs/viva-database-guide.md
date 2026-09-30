# Viva Database Guide

## Core Concepts
- **Transactions:** Ensures that if a multi-step operation fails, the database safely rolls back, preventing corrupt partial data.
- **Foreign Keys:** Enforce relationships (e.g., an EVS Task must belong to a valid Bed).
- **Unique Constraints:** Prevents duplicate user emails or overlapping active allocations.

## Core Relationships
- `Facility` (1) -> (N) `Ward`
- `Ward` (1) -> (N) `Bed`
- `Bed` (1) -> (N) `Encounter`
- `Bed` (1) -> (N) `EVSTask`
