const fs = require('fs');

const adminApiText = `
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
    const response = await fetch(\`\${API_BASE}/admin/summary\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(\`\${API_BASE}/admin/health\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAdminConfiguration(): Promise<AdminConfiguration[]> {
    const response = await fetch(\`\${API_BASE}/admin/configuration\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
    const response = await fetch(\`\${API_BASE}/admin/users\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function updateAdminUserStatus(userId: number, isActive: boolean): Promise<any> {
    const response = await fetch(\`\${API_BASE}/admin/users/\${userId}/status\`, {
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
    const response = await fetch(\`\${API_BASE}/admin/users/\${userId}/role\`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ role })
    });
    return handleResponse(response);
}

// --- Capacity Planning API ---

export interface CapacityPlanningSummary`;

let code = fs.readFileSync('src/api/dashboardApi.ts', 'utf8');

// The regex will match from `export interface AdminSummary` to `export interface CapacityPlanningSummary`
const regex = /export interface AdminSummary[\s\S]*?export interface CapacityPlanningSummary/;

code = code.replace(regex, adminApiText.trim());

fs.writeFileSync('src/api/dashboardApi.ts', code);
