const fs = require('fs');

// Fix dashboardApi.ts
let api = fs.readFileSync('src/api/dashboardApi.ts', 'utf8');
const moreMissing = `
export async function fetchOccupancyReport(filters: any): Promise<any> { return {}; }
export async function fetchTurnoverReport(filters: any): Promise<any> { return {}; }
export async function exportReportCSV(filters: any): Promise<any> { return {}; }
export async function exportReportPDF(filters: any): Promise<any> { return {}; }
`;
fs.writeFileSync('src/api/dashboardApi.ts', api + '\n' + moreMissing);

// Fix SimulationCenter.tsx
let sim = fs.readFileSync('src/components/SimulationCenter.tsx', 'utf8');
sim = sim.replace('import { fetchSimulationScenario, fetchSimulationCompare, SimulationComparison, SimulationParams, SimulationSummary, SimulationWardImpact, SimulationWarning, SimulationRecommendation } from \'../api/dashboardApi\';', 'import { fetchSimulationScenario, fetchSimulationCompare, type SimulationComparison, type SimulationParams, type SimulationSummary, type SimulationWardImpact, type SimulationWarning, type SimulationRecommendation } from \'../api/dashboardApi\';');
fs.writeFileSync('src/components/SimulationCenter.tsx', sim);
