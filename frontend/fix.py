import re

with open('src/api/dashboardApi.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix SystemHealth / Admin API
admin_block = """export interface SystemHealth {
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
    const response = await fetch(`${API_BASE}/admin/summary`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${API_BASE}/admin/health`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAdminConfiguration(): Promise<AdminConfiguration[]> {
    const response = await fetch(`${API_BASE}/admin/configuration`, { headers: getAuthHeaders() });
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

export interface CapacityPlanningSummary {"""

content = re.sub(r'export interface SystemHealth\s*\{\s*status:\s*string;\s*cpu_usage:\s*number;\s*export interface CapacityPlanningSummary\s*\{', admin_block + " {", content)

# Fix fetchPredictiveRecommendations
content = re.sub(r'export async function fetchPredictiveRecommendations\(\): Promise<PredictiveRecommendation\[\]> \{\s*const response = await fetch\(`\$\{API_BASE\}\s*// --- Simulation API ---', r'''export async function fetchPredictiveRecommendations(): Promise<PredictiveRecommendation[]> {
    const response = await fetch(`${API_BASE}/predictive-operations/recommendations`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

// --- Simulation API ---''', content)

with open('src/api/dashboardApi.ts', 'w', encoding='utf-8') as f:
    f.write(content)
