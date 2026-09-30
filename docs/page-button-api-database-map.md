# Page, Button, API, and Database Map

## Page-Level Inventory
| Page | Route | Role | Component | APIs Used | Database Tables | Realtime Events |
|---|---|---|---|---|---|---|
| Login | `/login` | ANY | `Login.tsx` | `POST /token` | `users` | None |
| Dashboard | `/dashboard` | STAFF+ | `Dashboard.tsx` | `GET /beds`, `GET /events` | `beds`, `events` | Bed State |
| Command Center | `/command-center` | MGR+ | `CommandCenter.tsx` | `GET /alerts`, `GET /capacity` | `notifications`, `beds` | Alert |
| Executive | `/executive` | DIR+ | `ExecutiveDashboard.tsx` | `GET /analytics` | `analytics`, `beds` | None |
| Admin | `/admin` | ADMIN | `AdminDashboard.tsx` | `GET /users`, `PUT /users` | `users`, `roles` | None |
| Ward | `/ward` | STAFF+ | `WardBoard.tsx` | `GET /beds` | `beds`, `encounters` | Bed State |
| EVS | `/evs` | STAFF+ | `EVSBoard.tsx` | `GET /evs` | `evs_tasks` | Task State |

## Button-Level Map
| Page | Button | Handler | API Endpoint | Service | DB Tables | Expected Result | UI Refresh |
|---|---|---|---|---|---|---|---|
| Login | `Login` | `handleSubmit` | `POST /api/auth/token` | `AuthService` | `users` | JWT Token received | Redirect |
| Beds | `Edit Bed` | `saveBed` | `PUT /api/beds/{id}` | `BedService` | `beds`, `audit_logs` | Bed updated | Query invalidate |
| Admin | `Save User`| `updateUser` | `PUT /api/admin/users/{id}` | `AdminService`| `users`, `audit_logs` | Role changed | Local State Update |
| EVS | `Accept` | `acceptTask` | `PUT /api/evs/{id}/accept` | `EVSService` | `evs_tasks` | Task -> IN_PROGRESS | Query invalidate |
| Discharge| `Mark Ready`| `markReady` | `PUT /api/readiness/{id}`| `ReadinessService`| `milestones` | Milestone -> READY | Query invalidate |
