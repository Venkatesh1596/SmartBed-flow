@echo off
echo Running SmartBed Flow Tests...
cd backend
call venv\Scripts\activate
python -m pytest -v
cd ..\frontend
call npx tsc -b
call npm run build
