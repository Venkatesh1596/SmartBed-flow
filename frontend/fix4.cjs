const fs = require('fs');

// Append Simulation API
let content = fs.readFileSync('src/api/dashboardApi.ts', 'utf8');
const simulationApi = `\n// --- Simulation API ---\n
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
if (!content.includes('SimulationParams')) {
    fs.writeFileSync('src/api/dashboardApi.ts', content + simulationApi);
}

// Fix SimulationCenter.tsx typings
let sim = fs.readFileSync('src/components/SimulationCenter.tsx', 'utf8');
sim = sim.replace(/ward =>/g, '(ward: any) =>');
sim = sim.replace(/ward, idx/g, 'ward: any, idx: number');
sim = sim.replace(/warning =>/g, '(warning: any) =>');
sim = sim.replace(/rec =>/g, '(rec: any) =>');
fs.writeFileSync('src/components/SimulationCenter.tsx', sim);
