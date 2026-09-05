# Final UI Functional Defect Report

## Defect 1: Dashboard Missing Schema Properties Trap
* **Page**: Dashboard (`/`)
* **Symptom**: Completely blank page immediately following successful login navigation.
* **Root Cause**: `DashboardSummary` API schema maps beds as an array (`List[BedDashboardRow]`) and utilizes `capacity` for aggregate totals. The frontend attempted to map nested objects like `summary.transport.in_progress` which do not exist in the dashboard API layer. The resulting render-phase exception completely unmounted the AppShell.
* **Fix**: Added strict null coalescing (`?.`) and falsy fallback defaults to the missing `transport` and `evs` fields. Adjusted `Occupancy` percentage math to use `summary.capacity.total`. 
* **Files Changed**: `frontend/src/components/Dashboard.tsx`
* **API involved**: `/api/dashboard/summary`
* **Regression Test**: Automated TypeScript evaluation (`tsc -b`), ensuring types and optional chaining conform.
* **Verification method**: Manual static forensic trace and Vite build.

## Defect 2: Missing Global Error Boundary
* **Page**: Entire Application Shell (`AppShell.tsx`)
* **Symptom**: If any child component on any route throws a rendering exception (e.g. `undefined.property`), the entire application crashes to a blank white screen.
* **Root Cause**: Lack of a React 16+ `<ErrorBoundary>` wrapper.
* **Fix**: Created a `Global ErrorBoundary` class component and wrapped `{children}` inside `AppShell.tsx`.
* **Files Changed**: 
  - `frontend/src/components/ErrorBoundary.tsx`
  - `frontend/src/components/layout/AppShell.tsx`
* **API involved**: N/A
* **Regression Test**: Validated successful Vite build and TS compilation.
* **Verification method**: Static code inspection ensuring `componentDidCatch` lifecycle exists and safely returns a "Page failed to render" layout with a `Retry` trigger.

## Defect 3: Dashboard Endpoint Connection Mismatches (Historical context)
* **Page**: Dashboard (`/`)
* **Symptom**: Dashboard trapped at "Failed to load Command Center".
* **Root Cause**: Requested `/predictions/beds` instead of `/predictions/bed-availability` and `/dashboard/flow-analytics` instead of `/dashboard/flow`.
* **Fix**: Patched paths in `dashboardApi.ts`.
* **Files Changed**: `frontend/src/api/dashboardApi.ts`
* **API involved**: `/predictions/bed-availability`, `/dashboard/flow`
* **Regression Test**: Passed backend Pytest for explicit API availability check.
* **Verification method**: Mapped endpoints directly against `FastAPI` router mappings.
