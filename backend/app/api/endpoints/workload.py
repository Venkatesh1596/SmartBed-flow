from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.workload import (
    WorkloadSummary, WorkloadItem, WorkloadQueue, WorkloadDistribution,
    WorkloadRecommendation, WorkloadTrendPoint, WorkloadPriority, WorkloadQueueType
)
from app.services.workload_service import WorkloadService

router = APIRouter()

@router.get("/summary", response_model=WorkloadSummary)
def get_workload_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    return service.get_summary()

@router.get("/items", response_model=List[WorkloadItem])
def get_workload_items(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    queue_type: Optional[WorkloadQueueType] = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    service = WorkloadService(db)
    items = service.get_all_items()
    if queue_type:
        items = [i for i in items if i.queue_type == queue_type]
    return items[offset:offset+limit]

@router.get("/queues", response_model=List[WorkloadQueue])
def get_workload_queues(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    return service.get_queues()

@router.get("/distribution", response_model=WorkloadDistribution)
def get_workload_distribution(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    return service.get_distribution()

@router.get("/priorities", response_model=List[WorkloadItem])
def get_workload_priorities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    return service.get_all_items()

@router.get("/recommendations", response_model=List[WorkloadRecommendation])
def get_workload_recommendations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    return service.get_recommendations()

@router.get("/trends", response_model=List[WorkloadTrendPoint])
def get_workload_trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    return service.get_trends()

@router.get("/pressure")
def get_workload_pressure(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    summary = service.get_summary()
    return {"pressure_score": summary.avg_priority}

@router.get("/critical", response_model=List[WorkloadItem])
def get_critical_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    items = service.get_all_items()
    return [i for i in items if i.priority.category.value == "CRITICAL"]

@router.get("/queue/{queue_type}", response_model=WorkloadQueue)
def get_specific_queue(queue_type: WorkloadQueueType, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WorkloadService(db)
    queues = service.get_queues()
    for q in queues:
        if q.queue_type == queue_type:
            return q
    raise HTTPException(status_code=404, detail="Queue not found")

@router.post("/{path:path}")
@router.put("/{path:path}")
@router.delete("/{path:path}")
@router.patch("/{path:path}")
def prevent_mutations(path: str):
    raise HTTPException(status_code=405, detail="Method Not Allowed - Workload is read-only")
