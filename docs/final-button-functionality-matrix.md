# Final Button Functionality Matrix

| Button Name | Location | API Endpoint | DB Mutation | Invalidation/Refetch | Status |
|---|---|---|---|---|---|
| `Login` | `/login` | `/api/auth/token` | None | None | VERIFIED |
| `Mark Ready` | `/discharge` | `/api/encounters/{id}` | Update encounter | Bed/Encounter query | VERIFIED |
| `Discharge` | `/discharge` | `/api/encounters/{id}` | Encounter -> DISCHARGED | Bed query | VERIFIED |
| `Accept Task` | `/evs` | `/api/evs/{id}` | EVS Task -> IN_PROGRESS | EVS query | VERIFIED |
| `Complete` | `/evs` | `/api/evs/{id}` | EVS Task -> COMPLETED | EVS query | VERIFIED |
| `Approve Allocation` | `/allocations`| `/api/allocations/{id}` | Allocation -> APPROVED | Alloc query | VERIFIED |
| `Run Simulation` | `/simulation` | `/api/simulation` | None | Sim query | VERIFIED |
| `Save User` | `/admin` | `/api/admin/users/{id}` | Update User role | Admin query | VERIFIED |
