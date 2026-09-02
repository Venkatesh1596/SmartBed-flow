import os

api_content = r'''
// --- Control Tower API ---
export interface ControlTowerSummary {
    hospital_status: string;
    total_capacity: number;
    current_occupancy: number;
    pending_admissions: number;
    pending_discharges: number;
    active_alerts: number;
    bottlenecks_detected: number;
}

export interface ControlTowerPerformance {
    kpi: string;
    value: string | number;
    target: string | number;
    status: string;
}

export interface ControlTowerWard {
    ward_name: string;
    occupancy_rate: number;
    admissions: number;
    discharges: number;
    avg_turnover_time: number;
}

export interface ControlTowerTrend {
    date: string;
    occupancy_rate: number;
    admissions: number;
    discharges: number;
}

export interface ControlTowerAttention {
    area: string;
    issue: string;
    impact: string;
}

export interface ControlTowerPriority {
    priority: string;
    action: string;
    status: string;
}

export interface ControlTowerQueueItem {
    id: number;
    type: string;
    patient_id: string;
    ward: string;
    status: string;
    wait_time_mins: number;
}

export interface ControlTowerActivity {
    id: number;
    timestamp: string;
    action: string;
    details: string;
}

export async function fetchControlTowerSummary(): Promise<ControlTowerSummary> {
    const response = await fetch(`${API_BASE}/control-tower/summary`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerPerformance(): Promise<ControlTowerPerformance[]> {
    const response = await fetch(`${API_BASE}/control-tower/performance`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerWards(): Promise<ControlTowerWard[]> {
    const response = await fetch(`${API_BASE}/control-tower/wards`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerTrends(days?: number): Promise<ControlTowerTrend[]> {
    const response = await fetch(`${API_BASE}/control-tower/trends${days ? `?days=${days}` : ''}`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerAttention(): Promise<ControlTowerAttention[]> {
    const response = await fetch(`${API_BASE}/control-tower/attention`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerPriorities(): Promise<ControlTowerPriority[]> {
    const response = await fetch(`${API_BASE}/control-tower/priorities`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerQueue(): Promise<ControlTowerQueueItem[]> {
    const response = await fetch(`${API_BASE}/control-tower/queue`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchControlTowerActivity(): Promise<ControlTowerActivity[]> {
    const response = await fetch(`${API_BASE}/control-tower/activity`, { headers: getAuthHeaders() });
    return handleResponse(response);
}
'''

with open('src/api/dashboardApi.ts', 'a', encoding='utf-8') as f:
    f.write(api_content)
