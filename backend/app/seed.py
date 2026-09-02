import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import Role, User
from app.models.facility import Ward, Bed
from app.models.enums import BedState
from simulations.generator import SyntheticDataGenerator

def seed_db():
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Role).count() > 0:
        print("Database already seeded.")
        return
        
    print("Seeding roles...")
    roles = ["BED_MANAGER", "CLINICAL_TEAM", "NURSE", "HOUSEKEEPING", "EMERGENCY_COORDINATOR", "ADMIN"]
    db_roles = []
    for r in roles:
        role = Role(name=r)
        db.add(role)
        db_roles.append(role)
    db.commit()

    print("Seeding users...")
    admin_role = db.query(Role).filter(Role.name == "ADMIN").first()
    admin = User(username="admin", email="admin@test.com", role_id=admin_role.id)
    db.add(admin)
    db.commit()

    print("Seeding wards and beds...")
    wards_data = [
        {"name": "ICU-A", "beds": 10},
        {"name": "ICU-B", "beds": 10},
        {"name": "MED-A", "beds": 20},
        {"name": "MED-B", "beds": 20},
        {"name": "SURG-A", "beds": 15},
    ]
    for w_data in wards_data:
        ward = Ward(name=w_data["name"])
        db.add(ward)
        db.commit()
        db.refresh(ward)
        
        for i in range(w_data["beds"]):
            bed = Bed(name=f"{ward.name}-{i+1}", ward_id=ward.id, state=BedState.AVAILABLE)
            db.add(bed)
        db.commit()

    print("Seed complete.")
    db.close()

if __name__ == "__main__":
    seed_db()
