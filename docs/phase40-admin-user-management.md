# Phase 40 - Admin & User Management Workspace

## Architecture
Phase 40 expands the /admin view into a fully operational User and Facility CRUD administration module. The backend API is highly protected via FastAPI Security() scopes, ensuring only the ADMIN role can execute mutations.

## Features
- **User Grid**: Filterable and sortable DataGrid for staff members, capturing is_active, Role, and Facility mappings.
- **Account Actions**: Soft-deactivation (immediately blacklisting JWT issuance), Role morphing, and Facility reassignments.
- **Password Reset**: Admins can force an encrypted password overwrite. Passwords are hashed immediately via passlib before storage. No plaintext secrets are returned via APIs.
- **Facility Grid**: Lightweight CRUD interface for synthetic Hospital/Facility mapping.
- **Audit Logging**: Every action (e.g. USER_DEACTIVATED, ROLE_CHANGED) triggers a mandatory udit_service event recording the admin's identity, target ID, and timestamp.

## RBAC Security
- Backend RoleChecker strictly denies FACILITY_MANAGER and STAFF requests to /api/admin/* endpoints.
- Unauthenticated requests yield a clean 401 Unauthorized.
- React AuthContext conditionally renders the Users and Facilities sidebar tabs only if user.role === 'ADMIN'.

## WebSocket Synchronization
Administrative actions (like revoking a role) emit targeted invalidation events. This forces stale frontend sessions for that specific user to gracefully boot them back to the login overlay if their role is stripped mid-session.
