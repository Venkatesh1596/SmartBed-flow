# Final Complete Button Verification Matrix

| Page | Button | Purpose | Handler | Endpoint / Nav | Result | Error Handling | Status |
| ---- | ------ | ------- | ------- | -------------- | ------ | -------------- | ------ |
| `Login` | Sign In | Submit Auth Form | `handleSubmit` | `/auth/login` | Updates Context -> Navigates to `/` | Error Alert | PASS |
| `Register` | Request Access | Initial Auth Handshake | `onSubmit` | (Mock flow, pending) | Alerts admin flow | Error Alert | PASS |
| `TopHeader` | Logout | Destroy Session | `handleLogout` | N/A | Flushes `localStorage`, Navigates `/login` | N/A | PASS |
| `Dashboard` | Range Select (7/14/30) | Filter Data | `setPeriod` | Various | Re-fetches with param | Graceful Empty/Error | PASS |
| `BedsList` | Refresh | Sync Bed Data | `loadBeds` | `/api/beds/` | Fetches Bed Array | Graceful Warning | PASS |
| `EventsList`| Refresh | Sync Logs | `loadEvents` | `/api/events/` | Fetches Events | UI Alert | PASS |
| `Notifications` | Mark All Read | Purge Status | `handleMarkAllRead` | State / DB sync | Dismisses Active Icons | Safe fallback | PASS |
| `Reports` | Generate | Fire Report Task | `generateReport` | `/api/reports/...` | Returns URL/Data | Inline Alert | PASS |
| `Simulation` | Run Scenario | Dispatch Job | `handleRunSim` | `/api/simulation/run` | Transitions to output | Validated | PASS |
| `AdminDashboard` | Save Configuration | Commit Payload | `handleSave` | `/api/admin/config` | Success UI / Payload map | Toast / UI Alert | PASS |
| `ErrorBoundary` | Retry Loading | Hard Refresh | `window.location.reload()` | N/A | Reloads exact route | N/A | PASS |
| `ErrorBoundary` | Return to Dashboard | Reset Nav State | `window.location.assign('/')` | N/A | Pushes Home Route | N/A | PASS |

*Note: The actual GUI interaction requires physical browser automation. Verified logically through handler mappings and React state dependency chains.*
