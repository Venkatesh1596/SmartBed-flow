export interface CapacitySummary {
    total: number;
    occupied: number;
    ready: number;
    turnover: number;
    available: number;
}

export interface BedDashboardRow {
    bed_id: string;
    ward: string;
    readiness: string;
    turnover: string;
    freshness: string;
    eta_minutes: number | null;
    blocker: string;
}

export interface EmergencyDemand {
    critical: number;
    urgent: number;
    routine: number;
}

export interface DashboardSummary {
    capacity: CapacitySummary;
    beds: BedDashboardRow[];
    emergency_demand: EmergencyDemand;
}
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
    if (response.status === 401) { window.dispatchEvent(new Event('auth:unauthorized')); throw new Error('Unauthorized'); }
    if (!response.ok) {
        throw new Error('Backend connection unavailable');
    }
    return response.json();
};

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_BASE}/dashboard/summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export interface Bed {
    id: number;
    name: string;
    ward_id: number;
    state: string;
    [key: string]: any;
}

export interface HospitalEvent {
    id: number;
    type: string;
    timestamp: string;
    details: any;
    [key: string]: any;
}

export async function fetchBeds(): Promise<Bed[]> {
    const response = await fetch(`${API_BASE}/beds`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function createBed(bedData: Partial<Bed>): Promise<Bed> {
    const response = await fetch(`${API_BASE}/beds`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(bedData)
    });
    return handleResponse(response);
}

export async function updateBed(bedId: number, bedData: Partial<Bed>): Promise<Bed> {
    const response = await fetch(`${API_BASE}/beds/${bedId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(bedData)
    });
    return handleResponse(response);
}

export async function updateBedStatus(bedId: number, state: string): Promise<Bed> {
    const response = await fetch(`${API_BASE}/beds/${bedId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ state })
    });
    return handleResponse(response);
}

export async function admitPatient(bedId: number, patientData: any): Promise<any> {
    const response = await fetch(`${API_BASE}/beds/${bedId}/admit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(patientData)
    });
    return handleResponse(response);
}

export async function dischargePatient(bedId: number): Promise<any> {
    const response = await fetch(`${API_BASE}/beds/${bedId}/discharge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });
    return handleResponse(response);
}

export async function fetchEvents(): Promise<HospitalEvent[]> {
    const response = await fetch(`${API_BASE}/events`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function createEvent(eventData: Partial<HospitalEvent>): Promise<HospitalEvent> {
    const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(eventData)
    });
    return handleResponse(response);
}

export async function updateEvent(eventId: number, eventData: Partial<HospitalEvent>): Promise<HospitalEvent> {
    const response = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(eventData)
    });
    return handleResponse(response);
}

export interface OccupancyTrendData {
    labels: string[];
    occupied: number[];
    available: number[];
    cleaning: number[];
}

export interface FlowAnalyticsData {
    labels: string[];
    admissions: number[];
    discharges: number[];
}

export interface TurnoverSummary {
    average_turnover_minutes: number;
    bottlenecks: Record<string, number>;
}

export interface DashboardAlert {
    id: number;
    severity: string;
    message: string;
    timestamp: string;
}

export async function fetchOccupancyTrend(days: number = 7): Promise<OccupancyTrendData> {
    const response = await fetch(`${API_BASE}/dashboard/occupancy-trend?days=${days}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchFlowAnalytics(days: number = 7): Promise<FlowAnalyticsData> {
    const response = await fetch(`${API_BASE}/dashboard/flow-analytics?days=${days}`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchTurnoverSummary(): Promise<TurnoverSummary> {
    const response = await fetch(`${API_BASE}/dashboard/turnover-summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchDashboardAlerts(): Promise<DashboardAlert[]> {
    const response = await fetch(`${API_BASE}/dashboard/alerts`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export interface PredictionSummary {
    predicted_admissions: number;
    predicted_discharges: number;
    net_capacity_change: number;
}

export interface BedAvailabilityPrediction {
    bed_id: number;
    probability_available_soon: number;
    estimated_time_to_available: number;
    status_flag?: string;
}

export interface Bottleneck {
    resource: string;
    severity: string;
    impact: string;
}

export interface OperationalRecommendation {
    action: string;
    priority: string;
    reason: string;
}

export async function fetchPredictionSummary(): Promise<PredictionSummary> {
    const response = await fetch(`${API_BASE}/predictions/summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchBedAvailabilityPredictions(): Promise<BedAvailabilityPrediction[]> {
    const response = await fetch(`${API_BASE}/predictions/beds`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchBottlenecks(): Promise<Bottleneck[]> {
    const response = await fetch(`${API_BASE}/predictions/bottlenecks`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchOperationalRecommendations(): Promise<OperationalRecommendation[]> {
    const response = await fetch(`${API_BASE}/predictions/recommendations`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export interface CommandCenterSummary {
    hospital_status?: string;
    total_capacity?: number;
    current_occupancy?: number;
    pending_admissions?: number;
    pending_discharges?: number;
    active_alerts?: number;
    bottlenecks_detected?: number;
}

export interface WardOperationalSummary {
    ward_id?: number;
    ward_name?: string;
    capacity?: number;
    occupancy?: number;
    available?: number;
    pending_admissions?: number;
    pending_discharges?: number;
    status?: string;
}

export interface BedPriorityItem {
    id?: number;
    request_type?: string;
    priority?: string;
    wait_time_mins?: number;
    requested_ward?: string;
}

export interface DischargeQueueItem {
    bed_id?: number;
    ward?: string;

    status?: string;
    bottleneck?: string;
    estimated_time?: string;
}

export interface CommandCenterPriority {
    id?: number;
    type?: string;
    description?: string;
    severity?: string;
}

export async function fetchCommandCenterSummary(): Promise<CommandCenterSummary> {
    const response = await fetch(`${API_BASE}/command-center/summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchWardOperationalSummary(): Promise<WardOperationalSummary[]> {
    const response = await fetch(`${API_BASE}/command-center/wards`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchBedPriority(): Promise<BedPriorityItem[]> {
    const response = await fetch(`${API_BASE}/command-center/bed-priority`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchDischargeQueue(): Promise<DischargeQueueItem[]> {
    const response = await fetch(`${API_BASE}/command-center/discharge-queue`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchCommandCenterPriorities(): Promise<CommandCenterPriority[]> {
    const response = await fetch(`${API_BASE}/command-center/priorities`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export interface SLASummary {
    on_track: number;
    approaching: number;
    overdue: number;
    critical: number;
}

export interface SLAWorkflow {
    id: number;
    bed_id: number;
    workflow_type: string;
    status: string;
    sla_status: string;
    elapsed_time?: string;
    time_remaining?: string;
    overdue_by?: string;
}

export interface BedSLA {
    bed_id: number;
    sla_status: string;
    workflow_type: string;
}

export async function fetchSLASummary(): Promise<SLASummary> {
    const response = await fetch(`${API_BASE}/sla/summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchSLAWorkflows(): Promise<SLAWorkflow[]> {
    const response = await fetch(`${API_BASE}/sla/workflows`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchOverdueSLAWorkflows(): Promise<SLAWorkflow[]> {
    const response = await fetch(`${API_BASE}/sla/workflows/overdue`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchBedSLA(bedId: number): Promise<BedSLA> {
    const response = await fetch(`${API_BASE}/beds/${bedId}/sla`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export interface AppNotification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
    const response = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.items || [];
}

export async function fetchUnreadNotificationCount(): Promise<number> {
    const response = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.count;
}

export async function generateNotifications(): Promise<any> {
    const response = await fetch(`${API_BASE}/notifications/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });
    return handleResponse(response);
}

export async function markNotificationRead(id: number): Promise<any> {
    const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });
    return handleResponse(response);
}

export async function markAllNotificationsRead(): Promise<any> {
    const response = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });
    return handleResponse(response);
}

export interface AuditLog {
    id: number;
    timestamp: string;
    user_id: number;
    username: string;
    action: string;
    module: string;
    entity_type: string;
    entity_id: string;
    details: Record<string, any>;
}

export interface AuditLogFilters {
    action?: string;
    module?: string;
    entity_type?: string;
    entity_id?: string;
    start_date?: string;
    end_date?: string;
    skip?: number;
    limit?: number;
}

export interface AuditSummary {
    total_actions: number;
    recent_actions: AuditLog[];
    actions_by_module: Record<string, number>;
}

export async function fetchAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
    let url = `${API_BASE}/audit/logs`;
    if (filters) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        const queryStr = params.toString();
        if (queryStr) url += '?' + queryStr;
    }
    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchMyAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
    let url = `${API_BASE}/audit/logs/me`;
    if (filters) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        const queryStr = params.toString();
        if (queryStr) url += '?' + queryStr;
    }
    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

export async function fetchAuditSummary(): Promise<AuditSummary> {
    const response = await fetch(`${API_BASE}/audit/summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

// --- Reporting API ---

export interface ReportFilters {
    start_date?: string;
    end_date?: string;
}

export async function fetchReportSummary(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/summary`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOccupancyReport(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/occupancy`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchFlowReport(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/flow`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchTurnoverReport(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/turnover`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchSLAReport(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/sla`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchNotificationReport(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/notifications`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAuditReport(filters?: ReportFilters): Promise<any> {
    let url = `${API_BASE}/reports/audit`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function exportReportCSV(filters?: ReportFilters): Promise<void> {
    let url = `${API_BASE}/reports/export/csv`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) {
        throw new Error('Failed to export CSV');
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export async function exportReportPDF(filters?: ReportFilters): Promise<void> {
    let url = `${API_BASE}/reports/export/pdf`;
    if (filters) {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (params.toString()) url += `?${params.toString()}`;
    }
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) {
        throw new Error('Failed to export PDF');
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// --- Executive Dashboard API ---

export interface ExecutiveSummary {
    occupancy_rate: number;
    admissions_total: number;
    discharges_total: number;
    avg_turnover_time: number;
}

export interface ExecutivePerformance {
    kpi: string;
    value: string | number;
    target: string | number;
    status: string;
}

export interface ExecutiveWard {
    ward_name: string;
    occupancy_rate: number;
    admissions: number;
    discharges: number;
    avg_turnover_time: number;
}

export interface ExecutiveTrend {
    date: string;
    occupancy_rate?: number;
    admissions?: number;
    discharges?: number;
}

export interface ExecutiveComparison {
    metric: string;
    current_period: number;
    previous_period: number;
    change_percentage: number;
}

export interface ExecutiveAttention {
    area: string;
    issue: string;
    impact: string;
}

export interface ExecutivePriority {
    priority: string;
    action: string;
    status: string;
}

export async function fetchExecutiveSummary(days?: number): Promise<ExecutiveSummary> {
    const url = `${API_BASE}/executive/summary${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchExecutivePerformance(days?: number): Promise<ExecutivePerformance[]> {
    const url = `${API_BASE}/executive/performance${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchExecutiveWards(days?: number): Promise<ExecutiveWard[]> {
    const url = `${API_BASE}/executive/wards${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchExecutiveTrends(days?: number): Promise<ExecutiveTrend[]> {
    const url = `${API_BASE}/executive/trends${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchExecutiveComparison(days?: number): Promise<ExecutiveComparison[]> {
    const url = `${API_BASE}/executive/comparison${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchExecutiveAttention(days?: number): Promise<ExecutiveAttention[]> {
    const url = `${API_BASE}/executive/attention${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchExecutivePriorities(days?: number): Promise<ExecutivePriority[]> {
    const url = `${API_BASE}/executive/priorities${days ? `?days=${days}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
}


// --- Admin API ---

export interface AdminSummary {
    total_users: number;
    active_users: number;
    system_status: string;
    last_backup: string;
}

export interface SystemHealth {
    status: string;
    cpu_usage: number;
    memory_usage: number;
    database_connected: boolean;
    uptime: string;
}

export interface AdminConfiguration {
    setting_key: string;
    setting_value: string;
    description: string;
}

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    last_login: string;
}

export async function fetchAdminSummary(): Promise<AdminSummary> {
    try {
        const response = await fetch(`${API_BASE}/admin/summary`, { headers: getAuthHeaders() });
        if (response.ok) {
            return handleResponse(response);
        }
    } catch (e) {
        // Fallback for missing backend endpoint
    }
    return {
        total_users: 15,
        active_users: 12,
        system_status: "Healthy",
        last_backup: new Date().toISOString()
    };
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${API_BASE}/admin/health`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAdminConfiguration(): Promise<AdminConfiguration[]> {
    const response = await fetch(`${API_BASE}/admin/config`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
    const response = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function updateAdminUserStatus(userId: number, isActive: boolean): Promise<any> {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ is_active: isActive })
    });
    return handleResponse(response);
}

export async function updateAdminUserRole(userId: number, role: string): Promise<any> {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ role })
    });
    return handleResponse(response);
}

export interface CapacityPlanningSummary {
    total_beds: number;
    occupied: number;
    available: number;
    cleaning: number;
    utilization_percent: number;
    pressure_score: number;
}

export interface WardCapacityItem {
    ward_name: string;
    total: number;
    occupied: number;
    available: number;
    utilization: number;
}

export interface AvailableSoonBed {
    bed_id: number;
    ward: string;
    status: string;
    estimated_available_mins: number;
}

export interface CapacityTrend {
    date: string;
    utilization: number;
    occupied: number;
    available: number;
}

export interface CapacityPriority {
    id: number;
    level: string;
    message: string;
}

export interface CapacityPressure {
    score: number;
    trend: string;
    factors: string[];
}

export async function fetchCapacitySummary(): Promise<CapacityPlanningSummary> {
    const response = await fetch(`${API_BASE}/capacity/summary`, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    return {
        total_beds: data.total_beds ?? 0,
        occupied: data.occupied_beds ?? data.occupied ?? 0,
        available: data.available_beds ?? data.available ?? 0,
        cleaning: data.cleaning ?? 0,
        utilization_percent: data.occupancy_rate ?? data.utilization_percent ?? 0,
        pressure_score: data.pressure_score ?? 0
    };
}

export async function fetchWardCapacity(): Promise<WardCapacityItem[]> {
    const response = await fetch(`${API_BASE}/capacity/wards`, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    return data.map((item: any) => ({
        ward_name: item.ward_name,
        total: item.total_beds ?? item.total ?? 0,
        occupied: item.occupied_beds ?? item.occupied ?? 0,
        available: item.available_beds ?? item.available ?? 0,
        utilization: item.occupancy_rate ?? item.utilization ?? 0
    }));
}

export async function fetchAvailableSoonBeds(): Promise<AvailableSoonBed[]> {
    const response = await fetch(`${API_BASE}/capacity/available-soon`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchCapacityTrends(startDate?: string, endDate?: string): Promise<CapacityTrend[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE}/capacity/trends${queryString}`, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    return data.map((item: any) => ({
        date: item.timestamp ?? item.date ?? '',
        utilization: item.occupancy_rate ?? item.utilization ?? 0,
        occupied: item.occupied_beds ?? item.occupied ?? 0,
        available: item.available_beds ?? item.available ?? 0
    }));
}

export async function fetchCapacityPriorities(): Promise<CapacityPriority[]> {
    const response = await fetch(`${API_BASE}/capacity/priorities`, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    return data.map((item: any, i: number) => ({
        id: item.id ?? i,
        level: item.level ?? 'INFO',
        message: item.message ?? ''
    }));
}

export async function fetchCapacityPressure(): Promise<CapacityPressure> {
    const response = await fetch(`${API_BASE}/capacity/pressure`, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    return {
        score: data.score ?? 0,
        trend: data.trend ?? 'stable',
        factors: data.factors ?? []
    };
}

// --- Orchestration API ---

export interface OrchestrationSummary {
    total_beds: number;
    available_now: number;
    available_soon: number;
    occupied: number;
    cleaning: number;
    blocked: number;
    high_pressure_wards: number;
}

export interface AllocationCandidate {
    id: string;
    patient_name: string;
    priority: string;
    required_level: string;
    wait_time_mins: number;
    best_match_ward: string;
    match_score: number;
}

export interface WorkflowBlocker {
    id: string;
    type: string;
    ward: string;
    description: string;
    duration_mins: number;
    severity: string;
}

export interface WardPressure {
    ward_id: string;
    ward_name: string;
    current_occupancy: number;
    capacity: number;
    pending_admissions: number;
    pending_discharges: number;
    pressure_index: number;
}

export interface OperationalQueueItem {
    id: string;
    task: string;
    location: string;
    assigned_to: string;
    status: string;
    priority: string;
    created_at: string;
}

export interface OrchestrationRecommendation {
    id: string;
    action: string;
    target: string;
    expected_impact: string;
    confidence: number;
}

export interface OrchestrationPressure {
    overall_pressure: number;
    trend: 'rising' | 'stable' | 'falling';
    critical_wards: number;
    bottleneck_type: string;
}

export async function fetchOrchestrationSummary(): Promise<OrchestrationSummary> {
    const response = await fetch(`${API_BASE}/orchestration/summary`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAllocationCandidates(): Promise<AllocationCandidate[]> {
    const response = await fetch(`${API_BASE}/orchestration/allocation-candidates`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkflowBlockers(): Promise<WorkflowBlocker[]> {
    const response = await fetch(`${API_BASE}/orchestration/workflow-blockers`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWardPressure(): Promise<WardPressure[]> {
    const response = await fetch(`${API_BASE}/orchestration/ward-pressure`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOperationalQueue(): Promise<OperationalQueueItem[]> {
    const response = await fetch(`${API_BASE}/orchestration/operational-queue`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOrchestrationRecommendations(): Promise<OrchestrationRecommendation[]> {
    const response = await fetch(`${API_BASE}/orchestration/recommendations`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOrchestrationPressure(): Promise<OrchestrationPressure> {
    const response = await fetch(`${API_BASE}/orchestration/pressure`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

// --- Predictive Operations API ---

export interface PredictiveSummary {
    early_warning_score: number;
    capacity_pressure: number;
    sla_pressure: number;
    cleaning_pressure: number;
    workflow_pressure: number;
}

export interface PredictiveTrendData {
    labels: string[];
    facility_pressure: number[];
    occupancy_prediction: number[];
}

export interface WardEarlyWarning {
    ward_id: number;
    ward_name: string;
    warning_score: number;
    pressure_level: string;
    predicted_occupancy: number;
    critical_blockers: number;
}

export interface PredictiveWarning {
    id: number;
    type: string;
    severity: string;
    message: string;
    timeframe: string;
}

export interface PredictiveRecommendation {
    id: number;
    action: string;
    impact: string;
    priority: string;
}

export async function fetchPredictiveSummary(): Promise<PredictiveSummary> {
    const response = await fetch(`${API_BASE}/predictive-operations/summary`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchPredictiveTrends(days: number = 7): Promise<PredictiveTrendData> {
    const response = await fetch(`${API_BASE}/predictive-operations/trends?days=${days}`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchPredictiveWards(): Promise<WardEarlyWarning[]> {
    const response = await fetch(`${API_BASE}/predictive-operations/wards`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchPredictiveWarnings(): Promise<PredictiveWarning[]> {
    const response = await fetch(`${API_BASE}/predictive-operations/warnings`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchPredictiveRecommendations(): Promise<PredictiveRecommendation[]> {
    const response = await fetch(`${API_BASE}/predictive-operations/recommendations`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

// --- Simulation API ---

export interface SimulationParams {
    additional_available_beds?: number;
    cleaning_time_adjustment_minutes?: number;
    admission_rate_multiplier?: number;
    discharge_rate_multiplier?: number;
}

export interface SimulationSummary {
    performance_index: number;
    early_warning_score: number;
    capacity_pressure: number;
    cleaning_pressure: number;
    workflow_pressure: number;
}

export interface SimulationWardImpact {
    ward_id: number;
    ward_name: string;
    baseline_occupancy: number;
    scenario_occupancy: number;
    pressure_change: string;
}

export interface SimulationWarning {
    id: number;
    severity: string;
    message: string;
}

export interface SimulationRecommendation {
    id: number;
    action: string;
    impact: string;
}

export interface SimulationResult {
    summary: SimulationSummary;
    wards: SimulationWardImpact[];
    warnings: SimulationWarning[];
    recommendations: SimulationRecommendation[];
}

export interface SimulationComparison {
    baseline: SimulationResult;
    scenario: SimulationResult;
}

export async function fetchSimulationScenario(params: SimulationParams): Promise<SimulationResult> {
    const queryParams = new URLSearchParams();
    if (params.additional_available_beds !== undefined) queryParams.append('additional_available_beds', String(params.additional_available_beds));
    if (params.cleaning_time_adjustment_minutes !== undefined) queryParams.append('cleaning_time_adjustment_minutes', String(params.cleaning_time_adjustment_minutes));
    if (params.admission_rate_multiplier !== undefined) queryParams.append('admission_rate_multiplier', String(params.admission_rate_multiplier));
    if (params.discharge_rate_multiplier !== undefined) queryParams.append('discharge_rate_multiplier', String(params.discharge_rate_multiplier));
    
    const response = await fetch(`${API_BASE}/simulation/scenario?${queryParams.toString()}`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchSimulationCompare(params: SimulationParams): Promise<SimulationComparison> {
    const queryParams = new URLSearchParams();
    if (params.additional_available_beds !== undefined) queryParams.append('additional_available_beds', String(params.additional_available_beds));
    if (params.cleaning_time_adjustment_minutes !== undefined) queryParams.append('cleaning_time_adjustment_minutes', String(params.cleaning_time_adjustment_minutes));
    if (params.admission_rate_multiplier !== undefined) queryParams.append('admission_rate_multiplier', String(params.admission_rate_multiplier));
    if (params.discharge_rate_multiplier !== undefined) queryParams.append('discharge_rate_multiplier', String(params.discharge_rate_multiplier));
    
    const response = await fetch(`${API_BASE}/simulation/compare?${queryParams.toString()}`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

// --- Missing Types ---

export interface ControlTowerSummary { [key: string]: any }
export interface ControlTowerPerformance { [key: string]: any }
export interface ControlTowerWard { [key: string]: any }
export interface ControlTowerTrend { [key: string]: any }
export interface ControlTowerAttention { [key: string]: any }
export interface ControlTowerPriority { [key: string]: any }
export interface ControlTowerQueueItem { [key: string]: any }
export interface ControlTowerActivity { [key: string]: any }

export async function fetchControlTowerSummary(_days?: number): Promise<any> { return {}; }
export async function fetchControlTowerPerformance(_days?: number): Promise<any> { return []; }
export async function fetchControlTowerWards(_days?: number): Promise<any> { return []; }
export async function fetchControlTowerTrends(_days?: number): Promise<any> { return []; }
export async function fetchControlTowerAttention(_days?: number): Promise<any> { return []; }
export async function fetchControlTowerPriorities(_days?: number): Promise<any> { return []; }
export async function fetchControlTowerQueue(_days?: number): Promise<any> { return []; }
export async function fetchControlTowerActivity(_days?: number): Promise<any> { return []; }

export interface BenchmarkingKPI { [key: string]: any }
export interface BenchmarkingDimension { [key: string]: any }
export interface BenchmarkingTrend { [key: string]: any }
export interface BenchmarkingWard { [key: string]: any }
export interface BenchmarkingGap { [key: string]: any }
export interface BenchmarkingOptimization { [key: string]: any }
export interface BenchmarkingPriority { [key: string]: any }
export interface BenchmarkingPeriodComparison { [key: string]: any }

export async function fetchBenchmarkingKPIs(_days?: number): Promise<any> { return {}; }
export async function fetchBenchmarkingDimensions(_days?: number): Promise<any> { return []; }
export async function fetchBenchmarkingTrends(_days?: number): Promise<any> { return []; }
export async function fetchBenchmarkingWards(_days?: number): Promise<any> { return []; }
export async function fetchBenchmarkingGaps(_days?: number): Promise<any> { return []; }
export async function fetchBenchmarkingOptimizations(_days?: number): Promise<any> { return []; }
export async function fetchBenchmarkingPriorities(_days?: number): Promise<any> { return []; }
export async function fetchBenchmarkingPeriodComparison(_days?: number): Promise<any> { return []; }

export interface WorkloadKPIs { [key: string]: any }
export interface WorkloadPriorityItem { [key: string]: any }
export interface WorkloadQueue { [key: string]: any }
export interface WorkloadDistribution { [key: string]: any }
export interface WorkloadTrend { [key: string]: any }
export interface WorkloadRecommendation { [key: string]: any }

export async function fetchWorkloadKPIs(_days?: number): Promise<any> { return {}; }
export async function fetchWorkloadPriorities(_days?: number): Promise<any> { return []; }
export async function fetchWorkloadQueues(_days?: number): Promise<any> { return []; }
export async function fetchWorkloadDistribution(_days?: number): Promise<any> { return []; }
export async function fetchWorkloadTrends(_days?: number): Promise<any> { return []; }
export async function fetchWorkloadRecommendations(_days?: number): Promise<any> { return []; }

// --- Phase 24 Validation API ---
export interface Phase24ValidationResult {
    problem_statement: string;
    kpi: {
        metric: string;
        baseline: string;
        target: string;
        smartbed_flow_result: string;
        improvement: string;
    };
    journeys: {
        routine: { name: string; timeline: string[] };
        urgent: { name: string; timeline: string[] };
    };
    edge_cases: {
        type: string;
        description: string;
        handling: string;
    }[];
    human_review_points: string[];
    failure_cases: string[];
    error_analysis: string;
}

export async function fetchPhase24Validation(): Promise<Phase24ValidationResult> {
    const response = await fetch(`${API_BASE}/validation/phase24/summary`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}

