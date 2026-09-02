from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.simulation import (
    SimulationInput,
    SimulationBaseline,
    SimulationProjection,
    SimulationDelta,
    SimulationMetric,
    SimulationWarning,
    SimulationRecommendation,
    SimulationComparison,
    SimulationResult,
    ScenarioPreset,
    SimulationSummary
)
from app.services.capacity_service import CapacityService
from app.services.predictive_operations_service import PredictiveOperationsService

class SimulationService:
    def __init__(self, db: Session):
        self.db = db
        self.capacity_svc = CapacityService(db)
        self.predictive_svc = PredictiveOperationsService(db)

    def get_baseline(self) -> SimulationBaseline:
        cap_summary = self.capacity_svc.get_facility_summary()
        cap_risk = self.predictive_svc.get_capacity_risk()
        clean_risk = self.predictive_svc.get_cleaning_risk()
        sla_risk = self.predictive_svc.get_sla_trend()
        wf_risk = self.predictive_svc.get_workflow_trend()
        fac_warning = self.predictive_svc.get_facility_warning()

        return SimulationBaseline(
            occupancy_rate=cap_summary.occupancy_rate,
            cleaning_pressure=clean_risk.score,
            sla_pressure=sla_risk.score,
            workflow_pressure=wf_risk.score,
            early_warning_score=fac_warning.warning_score.score,
            operational_performance_index=100.0 - fac_warning.warning_score.score
        )

    def get_presets(self) -> List[ScenarioPreset]:
        return [
            ScenarioPreset(
                id="surge_minor",
                name="Minor Admissions Surge",
                description="10% increase in admissions",
                inputs=SimulationInput(
                    staffing_multiplier=1.0,
                    admission_surge=1.1,
                    cleaning_efficiency=1.0,
                    transfer_delay=1.0,
                    discharge_volume=1.0
                )
            ),
            ScenarioPreset(
                id="surge_major",
                name="Major Admissions Surge",
                description="25% increase in admissions",
                inputs=SimulationInput(
                    staffing_multiplier=1.0,
                    admission_surge=1.25,
                    cleaning_efficiency=1.0,
                    transfer_delay=1.0,
                    discharge_volume=1.0
                )
            ),
            ScenarioPreset(
                id="staff_shortage",
                name="Staff Shortage",
                description="20% reduction in staffing",
                inputs=SimulationInput(
                    staffing_multiplier=0.8,
                    admission_surge=1.0,
                    cleaning_efficiency=0.8,
                    transfer_delay=1.2,
                    discharge_volume=0.9
                )
            )
        ]

    def run_scenario(self, inputs: SimulationInput) -> SimulationResult:
        baseline = self.get_baseline()

        # Calculation logic: Avoid 0 division and NaN
        # These formulas are arbitrary operational logic using the multipliers
        
        # Occupancy increases with admission surge, decreases with discharge volume
        proj_occupancy = baseline.occupancy_rate * (inputs.admission_surge / max(inputs.discharge_volume, 0.1))
        proj_occupancy = min(max(proj_occupancy, 0.0), 1.0)
        
        # Cleaning pressure goes down with efficiency and staffing, up with occupancy
        eff = max(inputs.cleaning_efficiency * inputs.staffing_multiplier, 0.1)
        proj_clean = baseline.cleaning_pressure * (proj_occupancy / max(baseline.occupancy_rate, 0.01)) / eff
        proj_clean = min(max(proj_clean, 0.0), 100.0)
        
        # SLA pressure goes up with transfer delay and occupancy, down with staffing
        proj_sla = baseline.sla_pressure * (inputs.transfer_delay / max(inputs.staffing_multiplier, 0.1))
        proj_sla = min(max(proj_sla, 0.0), 100.0)
        
        # Workflow pressure combines SLA and Cleaning
        proj_wf = (proj_clean + proj_sla) / 2.0
        proj_wf = min(max(proj_wf, 0.0), 100.0)
        
        # Early warning score
        proj_ews = (proj_occupancy * 100 * 0.3) + (proj_clean * 0.2) + (proj_sla * 0.3) + (proj_wf * 0.2)
        proj_ews = min(max(proj_ews, 0.0), 100.0)
        
        proj_opi = max(0.0, 100.0 - proj_ews)
        
        projection = SimulationProjection(
            occupancy_rate=proj_occupancy,
            cleaning_pressure=proj_clean,
            sla_pressure=proj_sla,
            workflow_pressure=proj_wf,
            early_warning_score=proj_ews,
            operational_performance_index=proj_opi
        )

        delta = SimulationDelta(
            occupancy_rate=projection.occupancy_rate - baseline.occupancy_rate,
            cleaning_pressure=projection.cleaning_pressure - baseline.cleaning_pressure,
            sla_pressure=projection.sla_pressure - baseline.sla_pressure,
            workflow_pressure=projection.workflow_pressure - baseline.workflow_pressure,
            early_warning_score=projection.early_warning_score - baseline.early_warning_score,
            operational_performance_index=projection.operational_performance_index - baseline.operational_performance_index
        )
        
        metrics = [
            SimulationMetric(name="Occupancy Rate", baseline=baseline.occupancy_rate, projected=projection.occupancy_rate, delta=delta.occupancy_rate),
            SimulationMetric(name="Cleaning Pressure", baseline=baseline.cleaning_pressure, projected=projection.cleaning_pressure, delta=delta.cleaning_pressure),
            SimulationMetric(name="SLA Pressure", baseline=baseline.sla_pressure, projected=projection.sla_pressure, delta=delta.sla_pressure),
            SimulationMetric(name="Workflow Pressure", baseline=baseline.workflow_pressure, projected=projection.workflow_pressure, delta=delta.workflow_pressure),
            SimulationMetric(name="Early Warning Score", baseline=baseline.early_warning_score, projected=projection.early_warning_score, delta=delta.early_warning_score),
            SimulationMetric(name="Operational Performance Index", baseline=baseline.operational_performance_index, projected=projection.operational_performance_index, delta=delta.operational_performance_index)
        ]
        
        warnings = []
        if projection.occupancy_rate > 0.95:
            warnings.append(SimulationWarning(severity="CRITICAL", message="Projected occupancy exceeds 95%", metric="occupancy_rate"))
        if projection.early_warning_score > 80:
            warnings.append(SimulationWarning(severity="HIGH", message="Early Warning Score indicates severe operational stress", metric="early_warning_score"))
            
        recommendations = []
        if projection.occupancy_rate > 0.90:
            recommendations.append(SimulationRecommendation(action="Increase discharge volume via expedited reviews", impact="High", effort="Medium"))
        if projection.cleaning_pressure > 80:
            recommendations.append(SimulationRecommendation(action="Allocate contingency cleaning staff", impact="Medium", effort="Low"))

        return SimulationResult(
            scenario=inputs,
            baseline=baseline,
            projection=projection,
            delta=delta,
            comparison=SimulationComparison(metrics=metrics),
            warnings=warnings,
            recommendations=recommendations
        )

    def compare_scenarios(self, base_inputs: SimulationInput, alt_inputs: SimulationInput) -> dict:
        base_res = self.run_scenario(base_inputs)
        alt_res = self.run_scenario(alt_inputs)
        return {
            "baseline_scenario": base_res,
            "alternative_scenario": alt_res
        }

    def get_summary(self) -> SimulationSummary:
        return SimulationSummary(
            available_presets=self.get_presets(),
            current_baseline=self.get_baseline()
        )
