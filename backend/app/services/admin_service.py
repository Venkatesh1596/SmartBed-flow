from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User, Role
from app.services.audit_service import create_audit_log

def is_user_active(user: User) -> bool:
    if user.hashed_password:
        return not user.hashed_password.startswith("LOCKED:")
    return True

def list_users(db: Session):
    users = db.query(User).all()
    return users

def change_user_status(db: Session, target_user_id: int, is_active: bool, current_user: User):
    target_user = db.query(User).filter(User.id == target_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target_user.id == current_user.id and not is_active:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
        
    if not is_active and target_user.role.name == "ADMIN":
        active_admins = [u for u in db.query(User).join(Role).filter(Role.name == "ADMIN").all() if is_user_active(u)]
        if len(active_admins) <= 1 and target_user in active_admins:
            raise HTTPException(status_code=400, detail="Cannot deactivate the last active admin")
            
    current_active = is_user_active(target_user)
    if current_active != is_active:
        previous_state = {"is_active": current_active}
        if is_active:
            target_user.hashed_password = target_user.hashed_password.replace("LOCKED:", "", 1)
        else:
            target_user.hashed_password = f"LOCKED:{target_user.hashed_password}"
            
        db.commit()
        db.refresh(target_user)
        
        create_audit_log(
            db=db,
            user_id=current_user.id,
            action="UPDATE_USER_STATUS",
            entity_type="USER",
            entity_id=str(target_user.id),
            module="ADMIN",
            previous_state=previous_state,
            new_state={"is_active": is_active}
        )
        
    return target_user

def change_user_role(db: Session, target_user_id: int, new_role_id: int, current_user: User):
    target_user = db.query(User).filter(User.id == target_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_role = db.query(Role).filter(Role.id == new_role_id).first()
    if not new_role:
        raise HTTPException(status_code=404, detail="Role not found")
        
    if target_user.id == current_user.id and new_role.name != "ADMIN":
        raise HTTPException(status_code=400, detail="Cannot remove your own admin role")
        
    if target_user.role.name == "ADMIN" and new_role.name != "ADMIN":
        active_admins = [u for u in db.query(User).join(Role).filter(Role.name == "ADMIN").all() if is_user_active(u)]
        if len(active_admins) <= 1 and target_user in active_admins:
            raise HTTPException(status_code=400, detail="Cannot change role of the last active admin")
            
    old_role_id = target_user.role_id
    if old_role_id != new_role_id:
        previous_state = {"role_id": old_role_id}
        target_user.role_id = new_role_id
        db.commit()
        db.refresh(target_user)
        
        create_audit_log(
            db=db,
            user_id=current_user.id,
            action="UPDATE_USER_ROLE",
            entity_type="USER",
            entity_id=str(target_user.id),
            module="ADMIN",
            previous_state=previous_state,
            new_state={"role_id": new_role_id}
        )
        
    return target_user

def get_central_config():
    return {
        "maintenance_mode": False,
        "max_capacity": 100,
        "emergency_override": False
    }
