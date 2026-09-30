# SmartBed Flow — Final Project Report

## Problem
Hospital operational delays are frequently caused by isolated information silos. When a patient is clinically ready for discharge, the subsequent operational steps—bed cleaning (EVS), quality checks, bed allocation, and patient transport—are disconnected. This results in "invisible delays," keeping safe beds unavailable while new patients wait.

## Solution
SmartBed Flow is a comprehensive operational coordination platform that connects:
Admission → Readiness → Discharge → Cleaning → EVS → Availability → Allocation → Transport.
It acts as a single source of truth, synchronizing all operational personas in real-time to eliminate workflow bottlenecks.

## Architecture
- **Frontend:** React, TypeScript, Vite, Tailwind CSS.
- **Backend:** FastAPI, Pydantic, Python 3.
- **Database:** PostgreSQL, SQLAlchemy (ORM), Alembic (Migrations).
- **Security:** JWT Authentication, Role-Based Access Control (RBAC).

## Major Capabilities
- **Role Workspaces:** Tailored UI for `SYSTEM_ADMIN`, `REGIONAL_DIRECTOR`, `FACILITY_MANAGER`, and `STAFF`.
- **Bed Lifecycle State Machine:** Strict enforcement of bed states (Occupied -> Cleaning -> Available).
- **Deterministic Allocation:** Matches available beds to patient requirements based on hard operational constraints.
- **EVS & Transport Dispatch:** Generates operational tasks instantly upon discharge and allocation.
- **Facility Isolation:** JWT claims ensure users cannot access or mutate cross-facility data.

## Limitations
- **Browser Automation:** Headless OS environment restrictions block physical Playwright GUI execution.
- **Remote CI:** GitHub Actions / Remote CI was not executed due to environment boundary limitations.
- **Algorithms:** Predictive/optimization engines use deterministic baseline heuristics, not Machine Learning / AI.
- **Data:** Uses synthetic operational data; does not contain real Patient Health Information (PHI).
