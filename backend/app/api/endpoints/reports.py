from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import io
import csv

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.report import (
    OperationalSummary,
    BedUtilizationReport,
    FlowReportPoint,
    TurnoverReportRecord,
    SLAReportSummary,
    NotificationReportSummary,
    AuditActivityReport,
)
from app.services import report_service

router = APIRouter()

def parse_dates(start_date: Optional[datetime], end_date: Optional[datetime]):
    if not end_date:
        end_date = datetime.now(timezone.utc)
    if not start_date:
        start_date = end_date - timedelta(days=30)
    return start_date, end_date

@router.get("/summary", response_model=OperationalSummary)
def get_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_operational_summary(db, start_date, end_date)

@router.get("/occupancy", response_model=List[BedUtilizationReport])
def get_occupancy(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_bed_utilization(db, start_date, end_date)

@router.get("/flow", response_model=List[FlowReportPoint])
def get_flow(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_flow_report(db, start_date, end_date)

@router.get("/turnover", response_model=List[TurnoverReportRecord])
def get_turnover(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_turnover_report(db, start_date, end_date)

@router.get("/sla", response_model=List[SLAReportSummary])
def get_sla(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_sla_report(db, start_date, end_date)

@router.get("/notifications", response_model=List[NotificationReportSummary])
def get_notifications(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_notifications_report(db, start_date, end_date)

@router.get("/audit", response_model=List[AuditActivityReport])
def get_audit(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    return report_service.get_audit_report(db, start_date, end_date)

@router.get("/export/csv")
def export_csv(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    
    summary = report_service.get_operational_summary(db, start_date, end_date)
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Total Admissions", summary.total_admissions])
    writer.writerow(["Total Discharges", summary.total_discharges])
    writer.writerow(["Average Occupancy Rate", summary.avg_occupancy_rate])
    writer.writerow(["Average Turnover Time (mins)", summary.avg_turnover_time_minutes])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=report_{start_date.date()}_{end_date.date()}.csv"}
    )

@router.get("/export/pdf")
def export_pdf(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date, end_date = parse_dates(start_date, end_date)
    summary = report_service.get_operational_summary(db, start_date, end_date)
    
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
    except ImportError:
        raise HTTPException(status_code=500, detail="reportlab is not installed")
        
    output = io.BytesIO()
    c = canvas.Canvas(output, pagesize=letter)
    
    c.drawString(100, 750, f"Operational Report ({start_date.date()} to {end_date.date()})")
    c.drawString(100, 730, f"Total Admissions: {summary.total_admissions}")
    c.drawString(100, 710, f"Total Discharges: {summary.total_discharges}")
    c.drawString(100, 690, f"Average Occupancy Rate: {summary.avg_occupancy_rate:.2f}%")
    c.drawString(100, 670, f"Average Turnover Time (mins): {summary.avg_turnover_time_minutes:.2f}")
    
    c.showPage()
    c.save()
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{start_date.date()}_{end_date.date()}.pdf"}
    )
