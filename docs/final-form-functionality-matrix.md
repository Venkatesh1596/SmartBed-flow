# Final Form Functionality Matrix

| Form Name | Location | Backend Schema | Duplicate Protection | Error Handling | Status |
|---|---|---|---|---|---|
| Auth Login | `/login` | `OAuth2PasswordRequestForm` | Disabled while submitting | Yes (401 UI) | VERIFIED |
| Edit Bed | `/beds` | `BedUpdate` | React-Hook-Form | Axios UI Alert | VERIFIED |
| User Role | `/admin` | `RoleUpdateRequest` | React-Hook-Form | Axios UI Alert | VERIFIED |
| Simulation | `/simulation`| `SimulationRequest` | Loading overlay | Axios UI Alert | VERIFIED |
| Add Alert | `/command-center`| `NotificationCreate` | Disabled while submitting | Axios UI Alert | VERIFIED |
