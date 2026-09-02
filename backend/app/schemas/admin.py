from pydantic import BaseModel, ConfigDict, model_validator
from typing import List, Optional, Any
from datetime import datetime

class SystemHealthResponse(BaseModel):
    status: str
    db_connection: bool
    services_ok: bool

class OperationalConfiguration(BaseModel):
    maintenance_mode: bool
    max_capacity: int
    emergency_override: bool

class AdminRoleResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class AdminUserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    role: AdminRoleResponse
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def populate_is_active(cls, data: Any) -> Any:
        if hasattr(data, "hashed_password"):
            is_active = not (data.hashed_password and data.hashed_password.startswith("LOCKED:"))
            # In Pydantic V2, returning the ORM object directly with a modified property might not work if it's strictly mapped, 
            # but since we added the property to the User model, it might just read it automatically?
            # Let's just return a dict instead of the ORM object to be safe, or just let the model property handle it.
            # Wait, if we return a dict, we have to map all fields.
            return {
                "id": data.id,
                "username": data.username,
                "email": data.email,
                "role": data.role,
                "is_active": is_active,
                "created_at": getattr(data, "created_at", None) or data.timestamp if hasattr(data, "timestamp") else data.created_at
            }
        return data

class AdminUserListResponse(BaseModel):
    users: List[AdminUserResponse]

class UserStatusUpdateRequest(BaseModel):
    is_active: bool

class RoleUpdateRequest(BaseModel):
    role_id: int
