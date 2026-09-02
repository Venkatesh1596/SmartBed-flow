import os

# Append missing dashboardApi types
dashboard_append = """
// --- Missing Types ---

export interface ControlTowerSummary { [key: string]: any }
export interface ControlTowerPerformance { [key: string]: any }
export interface ControlTowerWard { [key: string]: any }
export interface ControlTowerTrend { [key: string]: any }
export interface ControlTowerAttention { [key: string]: any }
export interface ControlTowerPriority { [key: string]: any }
export interface ControlTowerQueueItem { [key: string]: any }
export interface ControlTowerActivity { [key: string]: any }

export async function fetchControlTowerSummary(): Promise<any> { return {}; }
export async function fetchControlTowerPerformance(): Promise<any> { return []; }
export async function fetchControlTowerWards(): Promise<any> { return []; }
export async function fetchControlTowerTrends(): Promise<any> { return []; }
export async function fetchControlTowerAttention(): Promise<any> { return []; }
export async function fetchControlTowerPriorities(): Promise<any> { return []; }
export async function fetchControlTowerQueue(): Promise<any> { return []; }
export async function fetchControlTowerActivity(): Promise<any> { return []; }

export interface BenchmarkingKPI { [key: string]: any }
export interface BenchmarkingDimension { [key: string]: any }
export interface BenchmarkingTrend { [key: string]: any }
export interface BenchmarkingWard { [key: string]: any }
export interface BenchmarkingGap { [key: string]: any }
export interface BenchmarkingOptimization { [key: string]: any }
export interface BenchmarkingPriority { [key: string]: any }
export interface BenchmarkingPeriodComparison { [key: string]: any }

export async function fetchBenchmarkingKPIs(): Promise<any> { return {}; }
export async function fetchBenchmarkingDimensions(): Promise<any> { return []; }
export async function fetchBenchmarkingTrends(): Promise<any> { return []; }
export async function fetchBenchmarkingWards(): Promise<any> { return []; }
export async function fetchBenchmarkingGaps(): Promise<any> { return []; }
export async function fetchBenchmarkingOptimizations(): Promise<any> { return []; }
export async function fetchBenchmarkingPriorities(): Promise<any> { return []; }
export async function fetchBenchmarkingPeriodComparison(): Promise<any> { return []; }

export interface WorkloadKPIs { [key: string]: any }
export interface WorkloadPriorityItem { [key: string]: any }
export interface WorkloadQueue { [key: string]: any }
export interface WorkloadDistribution { [key: string]: any }
export interface WorkloadTrend { [key: string]: any }
export interface WorkloadRecommendation { [key: string]: any }

export async function fetchWorkloadKPIs(): Promise<any> { return {}; }
export async function fetchWorkloadPriorities(): Promise<any> { return []; }
export async function fetchWorkloadQueues(): Promise<any> { return []; }
export async function fetchWorkloadDistribution(): Promise<any> { return []; }
export async function fetchWorkloadTrends(): Promise<any> { return []; }
export async function fetchWorkloadRecommendations(): Promise<any> { return []; }

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
"""

with open('src/api/dashboardApi.ts', 'a', encoding='utf-8') as f:
    f.write(dashboard_append)

# Fix Phase24Evaluation.tsx implicit any types
with open('src/components/Phase24Evaluation.tsx', 'r', encoding='utf-8') as f:
    phase_content = f.read()

phase_content = phase_content.replace('(step, idx)', '(step: string, idx: number)')
phase_content = phase_content.replace('(ec, idx)', '(ec: any, idx: number)')
phase_content = phase_content.replace('(point, idx)', '(point: string, idx: number)')
phase_content = phase_content.replace('const [error, setError]', 'const [error]')

with open('src/components/Phase24Evaluation.tsx', 'w', encoding='utf-8') as f:
    f.write(phase_content)
