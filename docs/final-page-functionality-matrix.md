# Final Page Functionality Matrix

| Page Route | Role Required | APIs Called | Key Forms/Buttons | Responsive | Status |
|---|---|---|---|---|---|
| `/login` | None | `POST /api/auth/token` | Login Form | Yes | VERIFIED |
| `/dashboard` | STAFF+ | `GET /api/beds`, `GET /api/capacity` | Quick Actions | Yes | VERIFIED |
| `/beds` | STAFF+ | `GET /api/beds`, `PUT /api/beds/{id}` | Bed Status Edit | Yes | VERIFIED |
| `/command-center` | FACILITY_MANAGER+ | `GET /api/events`, `GET /api/capacity` | Alert Ack | Yes | FIXED AND VERIFIED |
| `/executive` | REGIONAL_DIRECTOR+ | `GET /api/analytics` | Export PDF | Yes | VERIFIED |
| `/allocations` | STAFF+ | `GET /api/allocations` | Approve/Reject | Yes | VERIFIED |
| `/transport` | STAFF+ | `GET /api/transport` | Accept/Complete | Yes | VERIFIED |
| `/evs` | STAFF+ | `GET /api/evs` | Accept/Start/Complete | Yes | VERIFIED |
| `/simulation` | REGIONAL_DIRECTOR+ | `POST /api/simulation` | Run Scenarios | Yes | VERIFIED |
| `/admin` | SYSTEM_ADMIN | `GET /api/admin/users`, `PUT` | Edit Roles | Yes | VERIFIED |
