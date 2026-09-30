# Final Demo Troubleshooting

- **Backend won't start?** Ensure virtual environment is activated (`venv\Scripts\activate`) and run `uvicorn app.main:app --reload`.
- **Database Connection Failure?** Check `.env` `DATABASE_URL` and ensure PostgreSQL service is running on port 5432.
- **Empty Dashboard?** Run the seed script: `python -m scripts.seed_demo_data`.
- **Frontend Vite Error?** Run `npm install` and ensure Node v18+ is installed.
