from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.schemas.simulation import (
    SimulationSummary,
    SimulationBaseline,
    ScenarioPreset,
    SimulationResult,
    SimulationInput
)
from app.services.simulation_service import SimulationService

router = APIRouter()

@router.get("/summary", response_model=SimulationSummary)
def get_simulation_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get high-level summary of simulation capabilities and current baseline."""
    service = SimulationService(db)
    return service.get_summary()

@router.get("/baseline", response_model=SimulationBaseline)
def get_simulation_baseline(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get the current operational baseline metrics."""
    service = SimulationService(db)
    return service.get_baseline()

@router.get("/presets", response_model=List[ScenarioPreset])
def get_simulation_presets(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get available scenario presets."""
    service = SimulationService(db)
    return service.get_presets()

@router.get("/scenario", response_model=SimulationResult)
def run_scenario(
    staffing_multiplier: float = Query(1.0, ge=0.0, le=5.0),
    admission_surge: float = Query(1.0, ge=0.0, le=5.0),
    cleaning_efficiency: float = Query(1.0, ge=0.0, le=5.0),
    transfer_delay: float = Query(1.0, ge=0.0, le=5.0),
    discharge_volume: float = Query(1.0, ge=0.0, le=5.0),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Run a specific simulation scenario."""
    inputs = SimulationInput(
        staffing_multiplier=staffing_multiplier,
        admission_surge=admission_surge,
        cleaning_efficiency=cleaning_efficiency,
        transfer_delay=transfer_delay,
        discharge_volume=discharge_volume
    )
    service = SimulationService(db)
    return service.run_scenario(inputs)

@router.get("/compare", response_model=dict)
def compare_scenarios(
    base_staffing: float = Query(1.0, ge=0.0, le=5.0),
    base_surge: float = Query(1.0, ge=0.0, le=5.0),
    base_cleaning: float = Query(1.0, ge=0.0, le=5.0),
    base_transfer: float = Query(1.0, ge=0.0, le=5.0),
    base_discharge: float = Query(1.0, ge=0.0, le=5.0),
    alt_staffing: float = Query(1.0, ge=0.0, le=5.0),
    alt_surge: float = Query(1.0, ge=0.0, le=5.0),
    alt_cleaning: float = Query(1.0, ge=0.0, le=5.0),
    alt_transfer: float = Query(1.0, ge=0.0, le=5.0),
    alt_discharge: float = Query(1.0, ge=0.0, le=5.0),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Compare two simulation scenarios."""
    base_inputs = SimulationInput(
        staffing_multiplier=base_staffing,
        admission_surge=base_surge,
        cleaning_efficiency=base_cleaning,
        transfer_delay=base_transfer,
        discharge_volume=base_discharge
    )
    alt_inputs = SimulationInput(
        staffing_multiplier=alt_staffing,
        admission_surge=alt_surge,
        cleaning_efficiency=alt_cleaning,
        transfer_delay=alt_transfer,
        discharge_volume=alt_discharge
    )
    service = SimulationService(db)
    return service.compare_scenarios(base_inputs, alt_inputs)
