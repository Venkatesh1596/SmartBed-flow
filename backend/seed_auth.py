import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import Role, User
from app.core.config import settings
from app.core.security import get_password_hash

def seed_roles(db: Session):
    roles = ["ADMIN", "FACILITY_MANAGER", "STAFF"]
    for role_name in roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
    db.commit()

def seed_admin(db: Session):
    admin_role = db.query(Role).filter(Role.name == "ADMIN").first()
    if not admin_role:
        print("Admin role not found!")
        return

    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
        admin_user = User(
            username="admin",
            hashed_password=hashed_password,
            role_id=admin_role.id
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created.")
    else:
        print("Admin user already exists.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_admin(db)
    finally:
        db.close()
