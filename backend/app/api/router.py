from fastapi import APIRouter
from app.api.endpoints import (
    beds, events, dashboard, auth, encounters, predictions, command_center, sla,
    notifications, audit, reports, executive, admin, capacity, orchestration,
    predictive_operations, simulation, control_tower, workload, benchmarking,
    phase24_validation, provisioning
)

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(beds.router, prefix="/beds", tags=["beds"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(encounters.router, prefix="/encounters", tags=["encounters"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(command_center.router, prefix="/command-center", tags=["command-center"])
api_router.include_router(sla.router, prefix="/sla", tags=["sla"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(executive.router, prefix="/executive", tags=["executive"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(capacity.router, prefix="/capacity", tags=["capacity"])
api_router.include_router(orchestration.router, prefix="/orchestration", tags=["orchestration"])
api_router.include_router(predictive_operations.router, prefix="/predictive-operations", tags=["predictive-operations"])
api_router.include_router(simulation.router, prefix="/simulation", tags=["simulation"])
api_router.include_router(control_tower.router, prefix="/control-tower", tags=["control-tower"])
api_router.include_router(workload.router, prefix="/workload", tags=["workload"])
api_router.include_router(benchmarking.router, prefix="/benchmarking", tags=["benchmarking"])
api_router.include_router(phase24_validation.router, prefix="/validation/phase24", tags=["phase24-validation"])
api_router.include_router(provisioning.router, prefix="/provisioning", tags=["provisioning"])
