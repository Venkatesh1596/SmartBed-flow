# SmartBed Flow 🏥⚡

> **A Full-Stack Hospital Bed-Flow & Operational Coordination Platform**

![SmartBed Flow Architecture](https://img.shields.io/badge/Architecture-React%20%7C%20FastAPI%20%7C%20PostgreSQL-blue)
![Testing](https://img.shields.io/badge/Pytest-95%2F95%20Passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

## 📖 Project Overview
**SmartBed Flow** is a comprehensive operational intelligence platform designed to eliminate the "invisible delays" between a patient's clinical discharge readiness and the next safe bed availability. 

In many hospitals, a bed may become clinically ready for discharge, but uncoordinated EVS (cleaning), quality checks, transport, and allocation stages cause massive bottlenecks. SmartBed Flow connects these isolated operational stages into a **single synchronized workflow**, providing real-time visibility, deterministic allocation recommendations, and strict Role-Based Access Control (RBAC).

*Note: This platform is designed strictly for **operational coordination** and throughput tracking. It does not perform autonomous medical diagnosis or clinical decision-making.*

---

## ✨ Core Features & Workflows

- **End-to-End Bed Lifecycle Tracking:** Seamlessly track beds from `OCCUPIED` → `CLEANING` → `AVAILABLE` → `ALLOCATED`.
- **EVS & Transport Dispatch:** Automatically generate cleaning tasks upon patient discharge. Dispatch transport teams with real-time UI updates.
- **Real-Time Operational Websockets:** Multi-user synchronization ensures that when EVS finishes cleaning, the facility manager's allocation board updates instantly.
- **Deterministic Allocation Engine:** Matches available beds to waiting patients based on strict operational rules and priorities, requiring human approval.
- **Digital Twin Simulation:** Run isolated "what-if" surge scenarios in memory without corrupting the production PostgreSQL database.
- **Facility Isolation & Security:** A strict JWT-based middleware ensures users can only mutate data belonging to their assigned facility.

---

## 👥 User Roles (RBAC)

SmartBed Flow implements strict access boundaries for different hospital personas:

1. **`SYSTEM_ADMIN`:** Full access to manage users, configure facilities, and reset passwords. Cannot interfere with daily ward operations.
2. **`REGIONAL_DIRECTOR`:** Network-level read-only access. Can view cross-facility analytics, load balancing, and transfer recommendations.
3. **`FACILITY_MANAGER`:** The core operational user. Can allocate beds, discharge patients, manage EVS/Transport queues, and view facility analytics.
4. **`STAFF`:** Ward-level workers (Nurses, EVS, Porters). Can update readiness milestones and complete assigned tasks, but blocked from administrative functions.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** (UI Library)
- **TypeScript** (Strict Type Safety)
- **Vite** (Lightning-fast Build Tool)
- **Tailwind CSS** (Utility-first Responsive Styling)
- **React Router** (Protected Routing)

### **Backend**
- **FastAPI** (High-performance Async Python API)
- **Pydantic V2** (Strict Data Validation & Serialization)
- **PostgreSQL** (ACID-compliant Relational Database)
- **SQLAlchemy 2.0** (ORM with row-level `with_for_update` locking)
- **Alembic** (Database Schema Migrations)

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup
Ensure PostgreSQL is running locally. Create a database named `smartbed_flow` (or as defined in your `.env`).

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Run database migrations to sync schema
alembic upgrade head

# Seed synthetic demo data
python -m scripts.seed_demo_data
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

---

## 💻 Running the Application

Open two terminal instances.

**Terminal 1 (Backend):**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
*API Docs available at: `http://localhost:8000/docs`*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*UI available at: `http://localhost:5173`*

---

## 🧪 Testing & Verification

The project is heavily validated with an automated integration suite covering concurrency, RBAC isolation, and database state transitions.

**Run Backend Tests:**
```bash
cd backend
venv\Scripts\activate
pytest -v
```

**Run Frontend Compilation Check:**
```bash
cd frontend
npx tsc -b
```

---

## 📚 Project Documentation & Viva Prep

Extensive documentation mapping the complete API-to-Database lifecycle, Operational Acceptance Testing (OAT), and Viva (Defense) guides are available in the `/docs` directory:

- `docs/viva-architecture-guide.md` - Design decisions (Why FastAPI? Why React?).
- `docs/viva-database-guide.md` - Schema and transaction logic.
- `docs/viva-security-guide.md` - JWT, Hashing, and Facility Isolation.
- `docs/final-demo-script.md` - A verified 5-minute operational walkthrough.
- `docs/page-button-api-database-map.md` - Exhaustive map of every UI handler to its SQL mutation.

---

## ⚠️ Known Limitations
- **Browser Automation (UAT):** Due to OS-level graphical execution limits in headless sandbox environments, automated DOM clicks (e.g., Playwright) are not packaged. Programmatic API and Component AST tests act as the primary validation layer.
- **Synthetic Data:** The system relies on seeded synthetic data for demonstration; it does not currently connect to a live hospital HL7/FHIR EHR feed.

---
*Built for modern hospital operational intelligence.*
