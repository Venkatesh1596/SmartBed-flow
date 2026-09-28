# Optimization Methodology
## Hard Constraints vs. Soft Ranking
- **Hard Constraints:** Facility ID match, Infection Isolation requirement, Gender-ward policies.
- **Soft Ranking:** Proximity to nursing station, historical turnaround speed of the assigned EVS staff.
- **Human OVERSIGHT:** Allocation recommendations are proposed to the user, blocking concurrent assignment via database transaction locks (`with_for_update`).
