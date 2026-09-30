# Role-Based Workflow Verification

## SYSTEM_ADMIN
- **Verified via Backend Pytest:** `test_admin_service.py` asserts ADMIN can hit `/api/admin/users`, update roles, and view system health.
- **UI Path:** `/admin` → `<AdminDashboard />`. Button mapping is 1:1 with API.

## REGIONAL_DIRECTOR
- **Verified via Backend Pytest:** `test_analytics.py` asserts DIR can view multi-facility aggregate data (`GET /api/analytics`). Attempting `PUT /api/beds` drops with 403 Forbidden.
- **UI Path:** `/executive` → `<ExecutiveDashboard />`.

## FACILITY_MANAGER
- **Verified via Backend Pytest:** Asserted they can view `/api/beds` for their assigned facility, but `GET /api/beds` for `facility_id=OTHER` returns 403.
- **UI Path:** `/command-center`.

## STAFF
- **Verified via Backend Pytest:** Restricted to basic operational tasks. Attempting to hit `/api/admin` or `/api/analytics` drops with 403.
- **UI Path:** `/dashboard`.
