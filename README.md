# SmartBed Flow 🏥⚡

> **Intelligent Hospital Bed Turnover & Operational Coordination Platform**

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)
![React](https://img.shields.io/badge/React-18+-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📖 Overview

Hospitals face critical bottlenecks between **clinical discharge readiness** and **physical bed availability**. These delays create dangerous ED boarding times, PACU hold-ups, and severe capacity constraints.

**SmartBed Flow** is a full-stack operational coordination platform that connects clinical readiness, Environmental Services (EVS), transport logistics, and bed allocation into a single unified timeline. By observing and coordinating these events, it measurably reduces the time from discharge to the next safe bed.

*⚠️ Note: This is an operational coordination and workflow platform. It does not contain PHI/PII, does not perform medical diagnoses, and does not make autonomous clinical decisions.*

---

## ✨ Key Features

- **Real-Time Bed Visibility:** Live dashboards mapping facility, ward, and individual bed states via WebSockets.
- **Discharge Readiness Tracking:** Clinical milestone checklists and real-time readiness state calculations.
- **EVS & Cleaning Workflow:** Automated Environmental Services task generation, mandatory quality checks, and safe-bed release protocols.
- **Intelligent Bed Allocation:** Constraint-validated eligible bed recommendations requiring human approval.
- **Role-Based Access Control (RBAC):** Strict JWT-secured facility-level isolation for `SYSTEM_ADMIN`, `REGIONAL_DIRECTOR`, `FACILITY_MANAGER`, and `STAFF`.
- **Predictive Operations:** Forecasting for discharge readiness, bed cleaning times, and capacity bottlenecks.
- **Surge & Emergency Operations:** Dedicated mass-casualty and surge modes prioritizing critical throughput.
- **Digital Twin Simulation:** Isolated sandbox for evaluating synthetic scenarios (baseline vs. optimized) without mutating production data.
- **Comprehensive Analytics:** SLA compliance, operational cost estimation, and robust reporting exports.

---

## 🔄 Core Operational Workflow

The platform optimizes the following critical path:

1. **Clinical Discharge Readiness** 🩺 *(Milestones met)*
2. **Patient Discharge** 🚪 *(Transactional state update)*
3. **Bed CLEANING** 🧹 *(EVS task generated & accepted)*
4. **Quality Check** ✅ *(Mandatory verification)*
5. **Bed AVAILABLE** 🛏️ *(Released to allocation pool)*
6. **Allocation Recommendation** 🧠 *(System suggests best fit)*
7. **Human Approval & Assignment** 👤 *(Final authorization)*
8. **Next Patient Flow** 🔁

---

## 🏗️ Architecture & Tech Stack

**Backend:**
- Python 3.10+, FastAPI
- SQLAlchemy, Alembic (Migrations)
- PostgreSQL (Persistence)
- WebSockets (Real-time events)

**Frontend:**
- React 18, Vite
- TypeScript
- TailwindCSS, Recharts
- Axios

---

## 🚀 Getting Started

### Prerequisites
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/)
- Git

### 1. Local Setup (Windows Quick Start)
We have provided batch scripts to automate environment setup, database migrations, and dependency installation.

```cmd
git clone https://github.com/Venkatesh1596/SmartBed-flow.git
cd SmartBed-flow

# Installs dependencies, sets up virtual env, and runs Alembic migrations
scripts\setup.bat
```

### 2. Running the Application
```cmd
# Starts both the FastAPI backend and React frontend concurrently
scripts\start.bat
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Running the Test Suite
The repository maintains a robust 95/95 Pytest integration suite and strict TypeScript compilation checks.
```cmd
scripts\test.bat
```

*(For manual setup instructions, see [docs/local-development.md](docs/local-development.md))*

---

## 📊 Synthetic Evaluation Methodology

SmartBed Flow utilizes a deterministic synthetic simulation engine to evaluate workflow improvements safely. We measure the primary Key Performance Indicator (KPI): **Time from Clinical Discharge Readiness to Next Safe Bed Availability**.

**Evaluated Patient Journeys:**
- **Journey A (Standard Flow):** A typical discharge and admission cycle. Read more in [Patient Journey A](docs/patient-journey-a.md).
- **Journey B (Surge Scenario):** A high-load emergency scenario requiring optimization overrides. Read more in [Patient Journey B](docs/patient-journey-b.md).

---

## 🔒 Security & Data Privacy

- **No Hardcoded Secrets:** Configuration relies strictly on local `.env` files (ignored in version control). See `.env.example` to set up local credentials.
- **Facility Isolation:** Users are strictly bound to their assigned facilities. Cross-facility access is denied at the API layer unless the user possesses Regional/System privileges.
- **Immutable Audit Logging:** All operational mutations (bed state changes, allocations, approvals) generate immutable audit trails.

---

## 📜 Documentation

Extensive project documentation, including complete Phase 58/59 Architectural Audits, API Contract Matrices, and Security Reports, can be found in the [`docs/`](docs/) directory.

---

## ⚖️ License
This project is licensed under the MIT License.
