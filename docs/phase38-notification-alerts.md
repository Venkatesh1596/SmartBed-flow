# Phase 38 - Smart Notifications & Operational Alerts

## Architecture
The notification system is transitioned from generic popups to a strict state-machine driven Operational Alert system, centralized in ackend/app/services/alerts.py.

## Alert Severities & Categories
- **Severities**: CRITICAL, URGENT, WARNING, INFO, SUCCESS
- **Categories**: CAPACITY_WARNING, EVS_DELAYED, DISCHARGE_READY, ADMISSION_WAITING, SYSTEM_ALERT

## Deduplication
To prevent "notification storms", the backend strictly queries the database for existing unresolved alerts targeting the same entity (e.g. ed_id + EVS_DELAYED) before generating a new row. Duplicate requests are gracefully discarded.

## Lifecycle
Alerts progress through states: NEW -> READ -> ACKNOWLEDGED -> RESOLVED.
Operations like clicking [Allocate Bed] natively fire an API request that both processes the action and resolves the associated alert in a single transaction.

## UI Integration
- A persistent right-side Notification Drawer renders dynamically.
- Toasts appear only for CRITICAL or URGENT severities.
- The Command Center and Control Tower aggregate live severity counts (e.g., ?? 2 Critical, ?? 7 Warnings).
