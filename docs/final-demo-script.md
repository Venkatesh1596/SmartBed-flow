# Final 5-7 Minute Demo Script

1. **Login:** Log in as `FACILITY_MANAGER`. (Demonstrates Auth/JWT).
2. **Role-aware workspace:** Show the Command Center. (Demonstrates RBAC routing).
3. **Current bed situation:** Show the bed board overview. (Demonstrates API GET fetching).
4. **Patient approaching discharge:** Open a Ward bed with an active Encounter.
5. **Mark readiness:** Toggle clinical readiness milestones. (Demonstrates DB updates).
6. **Discharge:** Click "Discharge Patient". (Demonstrates complex state transitions).
7. **Bed becomes CLEANING:** Observe the bed status turn Yellow/Cleaning.
8. **EVS task:** Switch to EVS Board. Show the auto-generated task.
9. **EVS completion:** Click "Complete Task".
10. **Quality check:** Acknowledge room turnover. 
11. **Bed becomes AVAILABLE:** Observe the bed status turn Green/Available.
12. **Allocate bed:** Open Allocation engine. Select a waiting patient for the new bed.
13. **Transport:** Show the auto-generated transport request.
14. **Notification:** Check the top-right bell icon for system alerts.
15. **Audit:** Open an audit log to show the precise timestamp of the discharge.
16. **Analytics:** Show the Dashboard KPIs (Turnover time, Utilization).
17. **Freshness:** Point to the "Last Updated: just now" tag.
18. **Role restriction:** Log out, log in as `STAFF`, and show that Analytics is blocked (403 Forbidden).
19. **Logout:** End demo.
