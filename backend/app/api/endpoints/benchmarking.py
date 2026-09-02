from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.benchmarking_service import BenchmarkingService
from app.schemas.benchmarking import (
    BenchmarkSummary, FacilityBenchmark, WardBenchmark, BenchmarkTrendPoint,
    BenchmarkComparison, PerformanceGap, OptimizationOpportunity, StrategicPriority,
    BenchmarkDimension, BenchmarkScore
)

router = APIRouter()

def get_benchmarking_service(db: Session = Depends(get_db)) -> BenchmarkingService:
    return BenchmarkingService(db_session=db)

@router.get("/summary", response_model=BenchmarkSummary)
def get_summary(
    period_days: int = Query(30, description="7, 14, 30, or 90"),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_summary(period_days)

@router.get("/facility", response_model=FacilityBenchmark)
def get_facility(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_facility_benchmark(period_days)

@router.get("/wards", response_model=List[WardBenchmark])
def get_wards(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_wards_benchmark(period_days)

@router.get("/trends", response_model=List[BenchmarkTrendPoint])
def get_trends(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_trends(period_days)

@router.get("/comparison", response_model=List[BenchmarkComparison])
def get_comparison(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_comparison(period_days)

@router.get("/gaps", response_model=List[PerformanceGap])
def get_gaps(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_gaps(period_days)

@router.get("/opportunities", response_model=List[OptimizationOpportunity])
def get_opportunities(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_opportunities(period_days)

@router.get("/priorities", response_model=List[StrategicPriority])
def get_priorities(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_priorities(period_days)

@router.get("/dimensions", response_model=List[BenchmarkDimension])
def get_dimensions(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_dimensions(period_days)

@router.get("/score", response_model=BenchmarkScore)
def get_score(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_score(period_days)

@router.get("/top-performers", response_model=List[WardBenchmark])
def get_top_performers(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_top_performers(period_days)

@router.get("/attention", response_model=List[WardBenchmark])
def get_attention(
    period_days: int = Query(30),
    service: BenchmarkingService = Depends(get_benchmarking_service),
    current_user: User = Depends(get_current_user)
):
    return service.get_attention(period_days)
    
@router.post("/{path:path}")
@router.put("/{path:path}")
@router.delete("/{path:path}")
@router.patch("/{path:path}")
def prevent_mutations(path: str):
    raise HTTPException(status_code=405, detail="Method Not Allowed - Read Only API")
