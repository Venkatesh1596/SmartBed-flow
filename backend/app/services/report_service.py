from sqlalchemy.orm import Session
from sqlalchemy import func, case, cast, Date
from datetime import datetime
from typing import List, Optional
from app.models.encounter import Encounter
from app.models.facility import Bed, Ward
from app.models.notification import Notification
from app.models.audit_log import AuditLog
from app.models.event import BedStateEvent, HospitalEvent
from app.models.enums import BedState
from app.schemas.report import (
    OperationalSummary,
    BedUtilizationReport,
    FlowReportPoint,
    TurnoverReportRecord,
    SLAReportSummary,
    NotificationReportSummary,
    AuditActivityReport,
)

def get_operational_summary(db: Session, start_date: datetime, end_date: datetime) -> OperationalSummary:
    total_admissions = db.query(func.count(Encounter.id)).filter(
        Encounter.created_at >= start_date, Encounter.created_at <= end_date
    ).scalar() or 0
    
    total_discharges = db.query(func.count(Encounter.id)).filter(
        Encounter.discharged_at >= start_date, Encounter.discharged_at <= end_date
    ).scalar() or 0
    
    # Avg occupancy
    total_beds = db.query(func.count(Bed.id)).scalar() or 0
    occupied_beds = db.query(func.count(Bed.id)).filter(Bed.state == BedState.OCCUPIED).scalar() or 0
    avg_occupancy = (occupied_beds / total_beds * 100) if total_beds > 0 else 0.0

    # Avg turnover
    # Rough estimate from BedStateEvent (time between CLEANING and AVAILABLE) or just mock it as 0 if not enough data
    avg_turnover = 0.0  # Placeholder since turnover requires complex temporal matching

    return OperationalSummary(
        total_admissions=total_admissions,
        total_discharges=total_discharges,
        avg_occupancy_rate=avg_occupancy,
        avg_turnover_time_minutes=avg_turnover
    )

def get_bed_utilization(db: Session, start_date: datetime, end_date: datetime) -> List[BedUtilizationReport]:
    wards = db.query(Ward).all()
    results = []
    for ward in wards:
        beds_count = db.query(func.count(Bed.id)).filter(Bed.ward_id == ward.id).scalar() or 0
        used_beds = db.query(func.count(Bed.id)).filter(Bed.ward_id == ward.id, Bed.state == BedState.OCCUPIED).scalar() or 0
        occupancy = (used_beds / beds_count * 100) if beds_count > 0 else 0.0
        results.append(BedUtilizationReport(
            ward_id=ward.id,
            ward_name=ward.name,
            occupancy_rate=occupancy,
            total_beds=beds_count,
            used_beds=used_beds
        ))
    return results

def get_flow_report(db: Session, start_date: datetime, end_date: datetime) -> List[FlowReportPoint]:
    admissions_by_date = db.query(
        cast(Encounter.created_at, Date).label('date'),
        func.count(Encounter.id).label('admissions')
    ).filter(
        Encounter.created_at >= start_date, Encounter.created_at <= end_date
    ).group_by(cast(Encounter.created_at, Date)).all()

    discharges_by_date = db.query(
        cast(Encounter.discharged_at, Date).label('date'),
        func.count(Encounter.id).label('discharges')
    ).filter(
        Encounter.discharged_at >= start_date, Encounter.discharged_at <= end_date, Encounter.discharged_at != None
    ).group_by(cast(Encounter.discharged_at, Date)).all()

    points_dict = {}
    for r in admissions_by_date:
        d_str = r.date.isoformat()
        points_dict[d_str] = {"admissions": r.admissions, "discharges": 0}
    
    for r in discharges_by_date:
        d_str = r.date.isoformat()
        if d_str not in points_dict:
            points_dict[d_str] = {"admissions": 0, "discharges": 0}
        points_dict[d_str]["discharges"] = r.discharges

    results = []
    for d_str, data in sorted(points_dict.items()):
        adm = data["admissions"]
        dis = data["discharges"]
        results.append(FlowReportPoint(
            date=d_str,
            admissions=adm,
            discharges=dis,
            net_flow=adm - dis
        ))
    return results

def get_turnover_report(db: Session, start_date: datetime, end_date: datetime) -> List[TurnoverReportRecord]:
    wards = db.query(Ward).all()
    results = []
    for ward in wards:
        results.append(TurnoverReportRecord(
            ward_id=ward.id,
            ward_name=ward.name,
            avg_turnover_minutes=0.0,
            min_turnover_minutes=0.0,
            max_turnover_minutes=0.0
        ))
    return results

def get_sla_report(db: Session, start_date: datetime, end_date: datetime) -> List[SLAReportSummary]:
    # Placeholder for SLA report since SLA is usually calculated dynamically
    return [
        SLAReportSummary(
            workflow_type="CLEANING",
            total_workflows=0,
            breached=0,
            met=0,
            breach_rate=0.0
        )
    ]

def get_notifications_report(db: Session, start_date: datetime, end_date: datetime) -> List[NotificationReportSummary]:
    query = db.query(
        Notification.notification_type,
        func.count(Notification.id).label('total_sent'),
        func.sum(case((Notification.is_read == True, 1), else_=0)).label('read_count')
    ).filter(
        Notification.created_at >= start_date, Notification.created_at <= end_date
    ).group_by(Notification.notification_type).all()
    
    results = []
    for row in query:
        total = row.total_sent or 0
        read_c = row.read_count or 0
        rate = (read_c / total * 100) if total > 0 else 0.0
        results.append(NotificationReportSummary(
            notification_type=row.notification_type or "UNKNOWN",
            total_sent=total,
            read_count=read_c,
            read_rate=rate
        ))
    return results

def get_audit_report(db: Session, start_date: datetime, end_date: datetime) -> List[AuditActivityReport]:
    query = db.query(
        AuditLog.action,
        AuditLog.user_id,
        func.count(AuditLog.id).label('count')
    ).filter(
        AuditLog.created_at >= start_date, AuditLog.created_at <= end_date
    ).group_by(AuditLog.action, AuditLog.user_id).all()
    
    results = []
    for row in query:
        results.append(AuditActivityReport(
            action=row.action,
            user_id=row.user_id,
            count=row.count or 0
        ))
    return results

