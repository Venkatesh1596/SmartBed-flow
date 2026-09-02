## Project
SmartBed Flow

## Problem
Bed allocation is delayed because discharge readiness is not visible early enough.

## Solution
A discharge-readiness and bed-turnover coordination board.

## Major Features
* Authentication
* Role-based access
* Bed-state tracking
* Discharge readiness
* Turnover coordination
* Workflow monitoring
* SLA monitoring
* Predictive operations
* Control Tower
* Workload Prioritization
* Scenario Simulation
* Facility Benchmarking
* Synthetic MVP Evaluation

## Technology
* FastAPI
* React
* TypeScript
* PostgreSQL
* SQLAlchemy
* Pydantic
* Chart.js

## Validation
* 84+ regression tests
* Routine journey
* Urgent journey
* Missing readiness
* Stale cleaning
* Conflicting bed state
* Baseline measurement
* Target measurement
* Synthetic experiment
* Error analysis
* Human review points

## Important Limitation
"Performance results are based on synthetic operational data and should not be interpreted as real-world hospital performance measurements."

## Running the Project
Backend:
cd backend
.\venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8000

Frontend:
cd frontend
npm.cmd run dev

## Architecture
Frontend
?
FastAPI API
?
Services
?
PostgreSQL / synthetic validation data

The intelligence modules aggregate operational information without unnecessarily modifying production state.
