# SmartBed Flow - Final Viva Guide

1. **What is SmartBed Flow?**
A web-based operational dashboard designed to optimize hospital bed flow by coordinating discharge readiness and bed turnover.

2. **What problem does it solve?**
It addresses the lack of real-time visibility into bed availability and upcoming discharges, which leads to overcrowded emergency departments and delayed admissions.

3. **Why is bed allocation delayed?**
Hospitals often do not know a bed will be free until the patient physically leaves, creating a bottleneck because cleaning and admission processes are initiated too late.

4. **What is discharge readiness?**
A predicted state indicating that a patient is medically fit for discharge, even if administrative or physical departure hasn't occurred yet.

5. **What is bed turnover?**
The process of transitioning a bed from an occupied state, through cleaning and preparation, to being ready for the next patient.

6. **How does the system identify readiness?**
Through aggregated clinical milestones (e.g., medication completion, physio sign-off) and operational flags.

7. **How does freshness work?**
The system tracks the timestamp of data updates. If data (like cleaning status) hasn't been updated within a specific SLA, it's flagged as stale.

8. **What happens when data is missing?**
The frontend utilizes defensive rendering (e.g., \?? []\) and error boundaries to gracefully fallback without crashing.

9. **What happens when cleaning data is stale?**
It triggers an operational alert, prioritizing environmental services to investigate the delayed bed preparation.

10. **What is a conflicting bed state?**
When the system receives illogical updates (e.g., a bed marked as occupied but also ready for cleaning).

11. **Why use FastAPI?**
For its high performance, asynchronous capabilities, and automatic Swagger/OpenAPI documentation.

12. **Why use React?**
For building a highly interactive, component-driven, and state-managed user interface.

13. **Why PostgreSQL?**
For robust relational data integrity, ACID compliance, and advanced querying capabilities required by enterprise healthcare applications.

14. **How does authentication work?**
Via OAuth2 with JWT (JSON Web Tokens) securely exchanged using \pplication/x-www-form-urlencoded\.

15. **How is JWT handled?**
The frontend intercepts 401 errors globally and triggers a secure session wipe and redirect to the login page.

16. **How are roles handled?**
Role-Based Access Control (RBAC) via FastAPI dependencies (\RoleChecker\) to restrict endpoints to specific user types (Admin, Clinical, etc.).

17. **How is sensitive data minimized?**
By using purely operational metrics (bed states, ward identifiers) rather than processing raw Protected Health Information (PHI).

18. **Why synthetic data?**
To safely validate the architecture and evaluate operational improvements without risking patient privacy or relying on complex hospital integrations during the MVP phase.

19. **What is the baseline?**
The simulated average bed turnaround time before optimizations: ~185 minutes.

20. **What is the target?**
The operational goal for bed turnaround time: 90 minutes.

21. **What is the measured result?**
The achieved turnaround time after applying predictive workflows: ~95 minutes.

22. **How was the 48% improvement calculated?**
(185 - 95) / 185 = 48.6% reduction in bed turnover time.

23. **What are the limitations?**
The MVP relies on simulated scenarios and synthetic data. Real-world integration requires HL7/FHIR interfaces.

24. **What would be the next step in a real hospital deployment?**
Integrating with the hospital's electronic health record (EHR) system via FHIR APIs to ingest live patient and ADT (Admission, Discharge, Transfer) data.
