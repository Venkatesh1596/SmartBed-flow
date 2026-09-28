@echo off
echo Setting up SmartBed Flow...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python -m alembic upgrade head
cd ..\frontend
npm install
echo Setup complete.
