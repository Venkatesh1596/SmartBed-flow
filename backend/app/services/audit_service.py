from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from typing import Any, Dict, Optional
import json

def filter_secrets(data: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not data:
        return data
    safe_data = data.copy()
    secrets = ['password', 'token', 'secret', 'hashed_password']
    for key in safe_data:
        if any(secret in key.lower() for secret in secrets):
            safe_data[key] = '***'
    return safe_data

def create_audit_log(
    db: Session,
    user_id: Optional[int],
    action: str,
    entity_type: str,
    entity_id: Optional[str],
    module: str,
    previous_state: Optional[Dict[str, Any]] = None,
    new_state: Optional[Dict[str, Any]] = None,
    details: Optional[str] = None
) -> AuditLog:
    safe_previous = filter_secrets(previous_state)
    safe_new = filter_secrets(new_state)
    
    changes = {
        "module": module,
        "previous_state": safe_previous,
        "new_state": safe_new,
        "details": details
    }
    
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        changes=changes
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log
