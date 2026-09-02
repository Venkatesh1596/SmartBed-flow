from sqlalchemy.orm import Session
from sqlalchemy import text

def get_system_health(db: Session) -> dict:
    try:
        db.execute(text("SELECT 1"))
        db_connection = True
    except Exception:
        db_connection = False
        
    services_ok = True
    status = "healthy" if db_connection and services_ok else "unhealthy"
    
    return {
        "status": status,
        "db_connection": db_connection,
        "services_ok": services_ok
    }
