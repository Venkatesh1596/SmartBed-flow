const fs = require('fs');
const content = `
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
    const response = await fetch(\`\${API_BASE}/orchestration/summary\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAllocationCandidates(): Promise<AllocationCandidate[]> {
    const response = await fetch(\`\${API_BASE}/orchestration/allocation-candidates\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkflowBlockers(): Promise<WorkflowBlocker[]> {
    const response = await fetch(\`\${API_BASE}/orchestration/workflow-blockers\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWardPressure(): Promise<WardPressure[]> {
    const response = await fetch(\`\${API_BASE}/orchestration/ward-pressure\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOperationalQueue(): Promise<OperationalQueueItem[]> {
    const response = await fetch(\`\${API_BASE}/orchestration/operational-queue\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOrchestrationRecommendations(): Promise<OrchestrationRecommendation[]> {
    const response = await fetch(\`\${API_BASE}/orchestration/recommendations\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchOrchestrationPressure(): Promise<OrchestrationPressure> {
    const response = await fetch(\`\${API_BASE}/orchestration/pressure\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}
`;

fs.appendFileSync('src/api/dashboardApi.ts', content);
