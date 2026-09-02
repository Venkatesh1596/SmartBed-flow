from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.admin import (
    SystemHealthResponse,
    OperationalConfiguration,
    AdminUserListResponse,
    AdminUserResponse,
    UserStatusUpdateRequest,
    RoleUpdateRequest
)
from app.services import admin_service, system_health_service
from app.models.user import User

router = APIRouter()

@router.get("/health", response_model=SystemHealthResponse)
def get_health(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    _: None = Depends(deps.RoleChecker(["ADMIN"]))
):
    return system_health_service.get_system_health(db)

@router.get("/config", response_model=OperationalConfiguration)
def get_config(
    current_user: User = Depends(deps.get_current_user),
    _: None = Depends(deps.RoleChecker(["ADMIN"]))
):
    return admin_service.get_central_config()

@router.put("/config", response_model=OperationalConfiguration)
def update_config(
    config: OperationalConfiguration,
    current_user: User = Depends(deps.get_current_user),
    _: None = Depends(deps.RoleChecker(["ADMIN"]))
):
    raise HTTPException(status_code=400, detail="Configuration updates not supported via this endpoint")

@router.get("/users", response_model=AdminUserListResponse)
def list_users(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    _: None = Depends(deps.RoleChecker(["ADMIN"]))
):
    users = admin_service.list_users(db)
    return {"users": users}

@router.put("/users/{user_id}/status", response_model=AdminUserResponse)
def update_user_status(
    user_id: int,
    request: UserStatusUpdateRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    _: None = Depends(deps.RoleChecker(["ADMIN"]))
):
    return admin_service.change_user_status(db, user_id, request.is_active, current_user)

@router.put("/users/{user_id}/role", response_model=AdminUserResponse)
def update_user_role(
    user_id: int,
    request: RoleUpdateRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    _: None = Depends(deps.RoleChecker(["ADMIN"]))
):
    return admin_service.change_user_role(db, user_id, request.role_id, current_user)
