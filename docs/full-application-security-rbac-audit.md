# Full Application Security & RBAC Audit

## Authorization Matrix

| Role | Admin View | Dashboard | Ward Views | Evaluation / Simulation |
|---|---|---|---|---|
| `SYSTEM_ADMIN` | YES | YES | YES | YES |
| `REGIONAL_DIRECTOR` | NO | YES | YES | YES |
| `FACILITY_MANAGER` | NO | YES | YES | YES |
| `STAFF` | NO | NO | YES | NO |

## Security Warnings Analysis
- **"Restricted Access" on `/admin` for Staff**: Legitimate. Enforced by Backend `RoleChecker`. Frontend correctly intercepts and renders `PermissionDenied.tsx`.
- **"Unauthorized Data Exposure"**: Checked across APIs. User context (`get_current_user`) binds to Facility ID. Data leakage is prevented at the SQLAlchemy query layer.
- **IDOR**: Checked `GET /api/beds/{bed_id}` and others. Facility boundaries are strictly maintained.

## Conclusion
The security implementation correctly balances operational visibility with restricted administrative access. RBAC tests pass reliably.
