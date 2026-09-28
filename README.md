# SmartBed Flow

**Hospital Bed Turnover & Operational Coordination Platform**

## Problem
Hospitals face critical bottlenecks between clinical discharge readiness and physical bed availability. These delays create dangerous ED boarding times, PACU hold-ups, and capacity constraints.

## Solution
SmartBed Flow is a full-stack operational coordination platform that connects clinical readiness, Environmental Services (EVS), transport, and bed allocation into a single unified timeline. By observing and coordinating these events, it reduces the time from discharge to next safe bed.

*Note: This is an operational coordination and workflow platform, not a medical diagnosis or autonomous clinical decision-making system.*

## Architecture
- **Backend:** FastAPI, Python, SQLAlchemy, PostgreSQL, Alembic
- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Real-time:** WebSockets for live operational state
- **Security:** JWT Authentication, Strict RBAC (System Admin, Facility Manager, Regional Director, Staff), Facility-level data isolation.

## Core Workflow
Clinical Discharge Readiness → Discharge → EVS Cleaning → EVS Quality Check → Safe Bed Available → Bed Allocation → Next Patient Flow

## Synthetic Evaluation Methodology
The platform includes a deterministic synthetic simulation engine to evaluate workflow improvements without exposing PHI. We measure the primary KPI: **Time from Clinical Discharge Readiness to Next Safe Bed Availability**.

## Patient Journeys
- **Journey A (Standard Flow):** A typical discharge and admission cycle. [Read More](docs/patient-journey-a.md)
- **Journey B (Surge Scenario):** A high-load emergency scenario requiring optimization. [Read More](docs/patient-journey-b.md)

## Setup & Local Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Git

### Quick Start
Use the provided scripts for Windows environments:
1. `scripts\setup.bat` - Installs dependencies and runs migrations.
2. `scripts\start.bat` - Starts both backend and frontend servers.
3. `scripts\test.bat` - Runs the full test suite.

For manual setup, see [docs/local-development.md](docs/local-development.md).

## Demo Environment
A fully synthetic, idempotent demo environment can be generated using the backend seed scripts. See documentation for resetting and seeding demo data.

## Project Boundaries & Limitations
- **No PHI/PII:** All repository data is synthetic.
- **Human-in-the-Loop:** Allocation recommendations require human authorization.

## License
MIT
