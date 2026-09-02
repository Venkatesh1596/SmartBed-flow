from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.orchestration import (
    AllocationCandidate,
    WorkflowBlocker,
    WardAllocationPressure,
    OperationalQueueItem,
    AllocationRecommendation,
    OrchestrationSummary,
    OrchestrationResponse
)
from app.services.orchestration_service import OrchestrationService

router = APIRouter()

@router.get("/candidates", response_model=List[AllocationCandidate])
def get_candidates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return service.get_allocation_candidates()

@router.get("/blockers", response_model=List[WorkflowBlocker])
def get_blockers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return service.get_workflow_blockers()

@router.get("/ward-pressures", response_model=List[WardAllocationPressure])
def get_ward_pressures(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return service.get_ward_pressure()

@router.get("/queue", response_model=List[OperationalQueueItem])
def get_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return service.get_operational_queue()

@router.get("/recommendations", response_model=List[AllocationRecommendation])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return service.get_recommendations()

@router.get("/summary", response_model=OrchestrationSummary)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return service.get_summary()

@router.get("/orchestrate", response_model=OrchestrationResponse)
def orchestrate(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = OrchestrationService(db)
    return OrchestrationResponse(
        summary=service.get_summary(),
        candidates=service.get_allocation_candidates(),
        blockers=service.get_workflow_blockers(),
        ward_pressures=service.get_ward_pressure(),
        operational_queue=service.get_operational_queue(),
        recommendations=service.get_recommendations()
    )
