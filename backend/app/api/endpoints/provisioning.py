from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from passlib.context import CryptContext

from app.api import deps
from app.models.user import User, Role
from app.models.core_models import Facility, Equipment, Incident
from app.models.facility import Ward, Bed
from app.models.enums import BedState

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class FacilityCreate(BaseModel):
    name: str
    code: str

class WardCreate(BaseModel):
    name: str

class BedProvision(BaseModel):
    name: str
    ward_id: int
    state: str = "AVAILABLE"

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role_id: int

class EquipmentCreate(BaseModel):
    name: str
    facility_id: int

class IncidentCreate(BaseModel):
    type: str
    priority: str
    description: str
    facility_id: int

@router.post("/facilities")
def create_facility(req: FacilityCreate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user), _: None = Depends(deps.RoleChecker(["SYSTEM_ADMIN"]))):
    f = Facility(name=req.name, code=req.code)
    db.add(f)
    db.commit()
    db.refresh(f)
    return f

@router.post("/wards")
def create_ward(req: WardCreate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user), _: None = Depends(deps.RoleChecker(["SYSTEM_ADMIN"]))):
    w = Ward(name=req.name)
    db.add(w)
    db.commit()
    db.refresh(w)
    return w

@router.post("/beds")
def create_bed(req: BedProvision, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user), _: None = Depends(deps.RoleChecker(["SYSTEM_ADMIN", "FACILITY_MANAGER"]))):
    b = Bed(name=req.name, ward_id=req.ward_id, state=req.state)
    db.add(b)
    db.commit()
    db.refresh(b)
    return b

@router.post("/users")
def create_user(req: UserCreate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user), _: None = Depends(deps.RoleChecker(["SYSTEM_ADMIN"]))):
    hashed_pw = pwd_context.hash(req.password)
    u = User(username=req.username, email=req.email, hashed_password=hashed_pw, role_id=req.role_id)
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id, "username": u.username}

@router.post("/equipment")
def create_equipment(req: EquipmentCreate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user), _: None = Depends(deps.RoleChecker(["SYSTEM_ADMIN", "FACILITY_MANAGER"]))):
    e = Equipment(name=req.name, facility_id=req.facility_id)
    db.add(e)
    db.commit()
    db.refresh(e)
    return e

@router.post("/incidents")
def create_incident(req: IncidentCreate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user), _: None = Depends(deps.RoleChecker(["SYSTEM_ADMIN", "FACILITY_MANAGER"]))):
    i = Incident(type=req.type, priority=req.priority, description=req.description, facility_id=req.facility_id)
    db.add(i)
    db.commit()
    db.refresh(i)
    return i

@router.get("/master-data")
def get_master_data(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)):
    facs = db.query(Facility).all()
    wards = db.query(Ward).all()
    roles = db.query(Role).all()
    equip = db.query(Equipment).all()
    incs = db.query(Incident).all()
    return {
        "facilities": [{"id": f.id, "name": f.name} for f in facs],
        "wards": [{"id": w.id, "name": w.name} for w in wards],
        "roles": [{"id": r.id, "name": r.name} for r in roles],
        "equipment": [{"id": e.id, "name": e.name} for e in equip],
        "incidents": [{"id": i.id, "type": i.type} for i in incs]
    }

