from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

# Mocking the discovery logic for Phase 44
def discover_unresolved_workload(db: Session, facility_id: int) -> List[dict]:
    workload = []
    
    # 1. Transport Pending
    # transports = db.execute(select(TransportRequest).where(TransportRequest.status.in_(['REQUESTED', 'QUEUED', 'ASSIGNED', 'IN_PROGRESS']))).scalars().all()
    # for t in transports: workload.append({'type': 'TRANSPORT', 'id': t.id, 'priority': t.priority})
    
    # 2. Equipment Shortages
    # 3. EVS Tasks pending
    # 4. Encounters NEAR_READY
    # 5. Beds in CLEANING too long
    
    return workload
