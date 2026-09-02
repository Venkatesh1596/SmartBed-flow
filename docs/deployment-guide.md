# SmartBed Flow Deployment Guide

## 1. Prerequisites
- Docker and Docker Compose
- Node.js v18+ (for frontend build)
- Python 3.11+ (for backend)
- Postgres 15+

## 2. Environment Configuration
Secrets must be provided securely. Do NOT commit them to the repository.

### Backend `.env`
Create `backend/.env` with production values:
```env
POSTGRES_SERVER=db
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_db_password
POSTGRES_DB=smartbed_db
POSTGRES_PORT=5432
SECRET_KEY=generate_a_strong_jwt_secret
ADMIN_PASSWORD=secure_admin_password
```

### Frontend `.env`
Create `frontend/.env.production` (if deploying statically) or set the build environment:
```env
VITE_API_BASE_URL=https://api.your-production-domain.com/api
```

## 3. Deployment Steps
1. Build frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   Deploy the `frontend/dist` directory to a static host (Nginx, Vercel, S3).

2. Start Infrastructure:
   ```bash
   docker compose up -d db
   ```

3. Run Migrations:
   Ensure backend dependencies are installed.
   ```bash
   cd backend
   alembic upgrade head
   ```

4. Start Backend Server:
   Run using a production WSGI/ASGI server like Uvicorn + Gunicorn.
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

## 4. Backup and Restore Procedure
**Backup Database:**
```bash
docker exec -t smartbed_db pg_dump -U smartbed_user smartbed_db > backup_$(date +%Y%m%d).sql
```
**Restore Database:** (Warning: Destructive if DB exists)
```bash
cat backup_YYYYMMDD.sql | docker exec -i smartbed_db psql -U smartbed_user -d smartbed_db
```
