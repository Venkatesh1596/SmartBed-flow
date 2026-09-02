from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.schemas.sla import SLAResponse, WorkflowSLA
from app.services.sla_service import get_sla_summary, get_workflows, get_overdue_workflows, get_bed_sla

router = APIRouter()

@router.get("/summary", response_model=SLAResponse)
def read_sla_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_sla_summary(db)

@router.get("/workflows", response_model=List[WorkflowSLA])
def read_workflows(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_workflows(db)

@router.get("/overdue", response_model=List[WorkflowSLA])
def read_overdue_workflows(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_overdue_workflows(db)

@router.get("/bed/{bed_id}", response_model=List[WorkflowSLA])
def read_bed_sla(bed_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_bed_sla(db, bed_id)
