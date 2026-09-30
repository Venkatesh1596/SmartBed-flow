# Viva Security Guide

## Defenses
- **Passwords:** Hashed securely using Bcrypt. Plaintext passwords are never stored.
- **Facility Isolation:** `get_current_user` extracts the JWT `facility_id` and securely appends it to all SQLAlchemy `.filter()` queries, preventing IDOR (Insecure Direct Object Reference) across facilities.
- **Input Validation:** FastAPI + Pydantic rejects SQL Injection and malformed requests automatically with 422 errors.
- **Audit Logging:** Every mutation triggers a database `AuditLog` entry, tracking "Who did what and when".
