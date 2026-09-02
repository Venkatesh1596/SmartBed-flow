const fs = require('fs');
const code = `
// --- Workload Prioritization API ---

export interface WorkloadKPIs {
    total_items: number;
    critical: number;
    high: number;
    active_queues: number;
    system_pressure: string;
}

export interface WorkloadPriorityItem {
    id: string | number;
    title: string;
    type: string;
    priority: string;
    score: number;
    wait_time_mins: number;
    ward: string;
    action_url?: string;
}

export interface WorkloadQueue {
    name: string;
    type: string;
    count: number;
    highest_priority: string;
    avg_wait_time: number;
}

export interface WorkloadDistribution {
    labels: string[];
    critical: number[];
    high: number[];
    normal: number[];
}

export interface WorkloadTrend {
    date: string;
    total: number;
    critical: number;
}

export interface WorkloadRecommendation {
    id: string | number;
    action: string;
    impact: string;
    effort: string;
}

export async function fetchWorkloadKPIs(): Promise<WorkloadKPIs> {
    const response = await fetch(\`\${API_BASE}/workload/kpis\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkloadPriorities(): Promise<WorkloadPriorityItem[]> {
    const response = await fetch(\`\${API_BASE}/workload/priorities\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkloadQueues(): Promise<WorkloadQueue[]> {
    const response = await fetch(\`\${API_BASE}/workload/queues\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkloadDistribution(): Promise<WorkloadDistribution> {
    const response = await fetch(\`\${API_BASE}/workload/distribution\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkloadTrends(days: number = 7): Promise<WorkloadTrend[]> {
    const response = await fetch(\`\${API_BASE}/workload/trends?days=\${days}\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchWorkloadRecommendations(): Promise<WorkloadRecommendation[]> {
    const response = await fetch(\`\${API_BASE}/workload/recommendations\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}
`;
fs.appendFileSync('src/api/dashboardApi.ts', code);
