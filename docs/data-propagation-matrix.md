# Data Propagation Matrix

| Mutation Action | Primary DB Update | Downstream Tables | Affected UI Components | Websocket / Realtime |
|---|---|---|---|---|
| Bed -> CLEANING | `beds` | `evs_tasks` (Created), `audit_logs` | BedBoard, EVSBoard, CommandCenter | `BED_STATE_UPDATED` |
| EVS -> COMPLETED| `evs_tasks` | `beds` (Available), `audit_logs` | BedBoard, CommandCenter | `EVS_TASK_UPDATED` |
| Encounter -> DISCHARGED | `encounters` | `beds` (Cleaning) | WardBoard | `ENCOUNTER_DISCHARGED` |
| Create Alert | `notifications` | None | Header Bell, SLA Monitor | `ALERT_CREATED` |
