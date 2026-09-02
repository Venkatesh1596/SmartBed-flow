const fs = require('fs');
let content = fs.readFileSync('src/api/dashboardApi.ts', 'utf8');
const searchStr = 'export async function fetchSimulationScenario';
const idx = content.indexOf(searchStr);
if (idx !== -1) {
    const fixedMethods = `export async function fetchSimulationScenario(params: SimulationParams): Promise<SimulationResult> {
    const queryParams = new URLSearchParams();
    if (params.additional_available_beds !== undefined) queryParams.append('additional_available_beds', String(params.additional_available_beds));
    if (params.cleaning_time_adjustment_minutes !== undefined) queryParams.append('cleaning_time_adjustment_minutes', String(params.cleaning_time_adjustment_minutes));
    if (params.admission_rate_multiplier !== undefined) queryParams.append('admission_rate_multiplier', String(params.admission_rate_multiplier));
    if (params.discharge_rate_multiplier !== undefined) queryParams.append('discharge_rate_multiplier', String(params.discharge_rate_multiplier));
    
    const response = await fetch(\`\${API_BASE}/simulation/scenario?\${queryParams.toString()}\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export async function fetchSimulationCompare(params: SimulationParams): Promise<SimulationComparison> {
    const queryParams = new URLSearchParams();
    if (params.additional_available_beds !== undefined) queryParams.append('additional_available_beds', String(params.additional_available_beds));
    if (params.cleaning_time_adjustment_minutes !== undefined) queryParams.append('cleaning_time_adjustment_minutes', String(params.cleaning_time_adjustment_minutes));
    if (params.admission_rate_multiplier !== undefined) queryParams.append('admission_rate_multiplier', String(params.admission_rate_multiplier));
    if (params.discharge_rate_multiplier !== undefined) queryParams.append('discharge_rate_multiplier', String(params.discharge_rate_multiplier));
    
    const response = await fetch(\`\${API_BASE}/simulation/compare?\${queryParams.toString()}\`, { headers: getAuthHeaders() });
    return handleResponse(response);
}
`;
    content = content.substring(0, idx) + fixedMethods;
    fs.writeFileSync('src/api/dashboardApi.ts', content);
}
