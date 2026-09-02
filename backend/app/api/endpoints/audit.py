from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from app.api.deps import get_db, get_current_user
from app.models.user import User, Role
from app.models.audit_log import AuditLog
from app.schemas.audit import AuditLogResponse, AuditLogListResponse, AuditSummary

router = APIRouter()

@router.get("/", response_model=AuditLogListResponse)
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    module: Optional[str] = None,
    action: Optional[str] = None
):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    query = db.query(AuditLog)
    if module:
        query = query.filter(AuditLog.module == module)
    if action:
        query = query.filter(AuditLog.action == action)
        
    total = query.count()
    items = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}

@router.get("/me", response_model=AuditLogListResponse)
def get_my_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    query = db.query(AuditLog).filter(AuditLog.user_id == current_user.id)
    total = query.count()
    items = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}

@router.get("/summary", response_model=List[AuditSummary])
def get_audit_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    results = db.query(
        AuditLog.module,
        AuditLog.action,
        func.count(AuditLog.id).label('count')
    ).group_by(AuditLog.module, AuditLog.action).all()
    
    return [
        {"module": r.module, "action": r.action, "count": r.count}
        for r in results
    ]
