from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OperationalSummary(BaseModel):
    total_admissions: int
    total_discharges: int
    avg_occupancy_rate: float
    avg_turnover_time_minutes: float

class BedUtilizationReport(BaseModel):
    ward_id: int
    ward_name: str
    occupancy_rate: float
    total_beds: int
    used_beds: int

class FlowReportPoint(BaseModel):
    date: str
    admissions: int
    discharges: int
    net_flow: int

class TurnoverReportRecord(BaseModel):
    ward_id: int
    ward_name: str
    avg_turnover_minutes: float
    min_turnover_minutes: float
    max_turnover_minutes: float

class SLAReportSummary(BaseModel):
    workflow_type: str
    total_workflows: int
    breached: int
    met: int
    breach_rate: float

class NotificationReportSummary(BaseModel):
    notification_type: str
    total_sent: int
    read_count: int
    read_rate: float

class AuditActivityReport(BaseModel):
    action: str
    user_id: Optional[int]
    count: int
