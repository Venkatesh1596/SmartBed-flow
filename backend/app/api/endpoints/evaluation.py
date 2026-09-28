from fastapi import APIRouter, Depends
from typing import Dict, Any

from app.api.deps import get_current_user
from app.models.user import User
from app.services.journey_simulator import JourneySimulator
from app.services.baseline_evaluation import BaselineEvaluationService

router = APIRouter()

@router.get("/journey/routine")
def get_routine_journey(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    simulator = JourneySimulator()
    return simulator.generate_routine_discharge_journey()

@router.get("/journey/surge")
def get_surge_journey(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    simulator = JourneySimulator()
    return simulator.generate_surge_journey()

@router.get("/baseline")
def get_baseline_evaluation(
    sample_size: int = 100,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    evaluator = BaselineEvaluationService()
    return evaluator.evaluate(sample_size=sample_size)
