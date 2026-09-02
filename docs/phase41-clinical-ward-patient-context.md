# Phase 41 - Clinical Ward & Patient Context

## Objective
Provide granular operational/clinical context per Encounter (e.g., isolation requirements, operational notes) without duplicating EMR responsibilities.

## Architecture Reuse
- Integrated with existing Encounter and Bed models.
- Reuses Phase 35 Readiness tracking.
- Reuses Phase 36 EVS tasks when beds enter turnover.

## New Backend Models
ClinicalContext: Links 1:1 with Encounter. Tracks all_risk, oxygen_requirement, etc.
OperationalNote: 1:N with Encounter. A lightweight audit-tracked ledger of bed-flow comments.

## RBAC & Security
- Ward data scoped strictly to User's authorized Facility boundary.
- Notes cannot be hard-deleted, maintaining strict Audit logs.
