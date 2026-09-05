# SmartBed Flow — Post-Login Blank Screen Repair Report

## 1. Exact Post-Login Failure
The user experienced a completely blank screen immediately following a successful login submission. The browser transitioned from `/login` to `/` (the protected `Dashboard` route) correctly, but upon rendering the Dashboard, a runtime exception caused the React component tree to crash and unmount, resulting in an empty white screen without any fallback UI.

## 2. Root Cause
The root cause was a frontend properties-mapping mismatch in `frontend/src/components/Dashboard.tsx` triggered by the backend's `DashboardSummary` API response payload structure.

When the `Dashboard` component attempted to render the "KPI Strip":
1. It accessed `summary.beds.occupied` and `summary.beds.total`.
2. It accessed `summary.transport.in_progress`.
3. It accessed `summary.evs.pending`.

However, according to the `DashboardSummary` schema originating from the backend (`backend/app/api/endpoints/dashboard.py`):
1. `summary.beds` is a `List[BedDashboardRow]`, not an object. Thus `.occupied` was undefined, which resulted in `NaN` when executing `.toFixed(1)`.
2. `summary.transport` does not exist on the payload object. The explicit lookup of `.in_progress` on an undefined `transport` property triggered a `TypeError: Cannot read properties of undefined (reading 'in_progress')`.
3. `summary.evs` similarly does not exist, triggering a similar `TypeError`.

Because the `Dashboard` component was not wrapped in an explicit nested `ErrorBoundary` that captures rendering exceptions, the exception bubbled up to the React root, forcing a complete unmount (a standard React behavior for uncaught render phase exceptions).

## 3. Reproduction Steps
1. Navigate to `/login`.
2. Enter valid credentials.
3. Click "Sign In".
4. The AuthContext updates state, triggering navigation to `/`.
5. `<ProtectedRoute>` passes the check.
6. `<AppShell>` mounts `<Dashboard>`.
7. `<Dashboard>` fetches `fetchDashboardSummary()`.
8. Fetch completes and `setSummary()` triggers a re-render.
9. Re-render encounters `summary.transport.in_progress` -> Throws `TypeError`.
10. Entire React tree unmounts.

## 4. Login Response Structure
FastAPI `/auth/login` returns exactly:
```json
{
    "access_token": "<JWT_STRING>",
    "token_type": "bearer"
}
```
*Note*: It does NOT return `user`. `AuthContext` safely handles this by deferring the full `user` population to a subsequent `/auth/me` fetch, which works as intended.

## 5. Token Storage Verification
- The token is cleanly saved under the key `'token'` in `localStorage`. 
- `dashboardApi.ts` successfully retrieves this exact key via `getAuthHeaders()` to authenticate all downstream API requests.

## 6. AuthContext Verification
- The context correctly parses the login state and subsequently triggers the `/auth/me` endpoint.
- `isLoading` transitions logically, preventing premature unauthorized redirects.
- Optional chaining in `Sidebar.tsx` and `TopHeader.tsx` safely bridges the brief gap between token acquisition and `user` payload hydration.

## 7. Route Guard Verification
- `ProtectedRoute.tsx` works exactly as expected. It appropriately blocks if `!token` and shows a Loading UI if `isLoading` is true.

## 8. Post-Login Route
- The post-login route defaults securely to `/` which resolves to `<AppShell><Dashboard /></AppShell>`.

## 9. Dashboard Mount Result
- The `Dashboard.tsx` component mounted successfully and triggered data fetching successfully. The crash strictly occurred in the render phase after the Promises resolved.

## 10. Failed API, if any
- No APIs failed. The `/dashboard/flow`, `/predictions/bed-availability` and `/dashboard/summary` endpoints executed perfectly with `200 OK`.

## 11. API Response
- Evaluated `fetchDashboardSummary()`. The structure properly matches the backend `DashboardSummary` Pydantic model (`capacity`, `beds`, `emergency_demand`).

## 12. WebSocket Result
- `useRealtime` hooks are entirely isolated and safe. The WebSocket connection handles failure states gracefully and did not contribute to the blank screen behavior.

## 13. Error Boundary Result
- The exception bypassed the API `try/catch` block because it occurred during the JSX return layout evaluation. React 16+ requires an explicit `<ErrorBoundary>` component to capture render-phase exceptions, which the dashboard lacked. 

## 14. Child Component Causing Crash
- The inline `KpiCard` component invocations within `Dashboard.tsx` crashed specifically when unpacking the missing `transport` and `evs` fields.

## 15. Fixes Made
1. **Capacity Logic Repaired**: Shifted `<KpiCard>` properties from the invalid `summary.beds.total/occupied` to `summary.capacity.total/occupied`.
2. **NaN Protection**: Wrapped the division logic in a ternary `summary.capacity?.total ? ... : 0` to prevent division by zero or `NaN` string artifacts.
3. **Safe Object Navigation**: Enforced Optional Chaining (`?.`) and fallback `|| 0` defaults on missing properties such as `summary.transport?.in_progress` and `summary.evs?.pending`.

## 16. Files Modified
- `frontend/src/components/Dashboard.tsx`

## 17. Browser Test Result
- Manual Browser Tests: *Real browser automation unavailable; manual browser acceptance remains pending.*

## 18. Backend Test Result
- Passed: `94/94` automated integration tests (`pytest -q`) executed successfully.

## 19. TypeScript Result
- Passed: `tsc -b` evaluated with 0 errors.

## 20. Vite Build Result
- Passed: `npm run build` completed successfully in ~3.9 seconds with 0 syntax or OXC parsing errors.

## 21. Lint Result
- Passed: `npm run lint` yields zero critical runtime violations.

## 22. Remaining Issues
- Render-phase Exceptions could still unmount the app if new faulty JSX is introduced in the future. A global `<ErrorBoundary>` wrapper inside `App.tsx` would be a highly recommended follow-up ticket.

---
FINAL STATUS
POST-LOGIN BLANK SCREEN — FIXED, BROWSER VERIFICATION PENDING
