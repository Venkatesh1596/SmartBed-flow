import re

with open('src/api/dashboardApi.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('export async function fetchControlTowerSummary(): Promise<any>', 'export async function fetchControlTowerSummary(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerPerformance(): Promise<any>', 'export async function fetchControlTowerPerformance(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerWards(): Promise<any>', 'export async function fetchControlTowerWards(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerTrends(): Promise<any>', 'export async function fetchControlTowerTrends(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerAttention(): Promise<any>', 'export async function fetchControlTowerAttention(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerPriorities(): Promise<any>', 'export async function fetchControlTowerPriorities(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerQueue(): Promise<any>', 'export async function fetchControlTowerQueue(...args: any[]): Promise<any>')
content = content.replace('export async function fetchControlTowerActivity(): Promise<any>', 'export async function fetchControlTowerActivity(...args: any[]): Promise<any>')

content = content.replace('export async function fetchBenchmarkingKPIs(): Promise<any>', 'export async function fetchBenchmarkingKPIs(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingDimensions(): Promise<any>', 'export async function fetchBenchmarkingDimensions(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingTrends(): Promise<any>', 'export async function fetchBenchmarkingTrends(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingWards(): Promise<any>', 'export async function fetchBenchmarkingWards(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingGaps(): Promise<any>', 'export async function fetchBenchmarkingGaps(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingOptimizations(): Promise<any>', 'export async function fetchBenchmarkingOptimizations(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingPriorities(): Promise<any>', 'export async function fetchBenchmarkingPriorities(...args: any[]): Promise<any>')
content = content.replace('export async function fetchBenchmarkingPeriodComparison(): Promise<any>', 'export async function fetchBenchmarkingPeriodComparison(...args: any[]): Promise<any>')

content = content.replace('export async function fetchWorkloadKPIs(): Promise<any>', 'export async function fetchWorkloadKPIs(...args: any[]): Promise<any>')
content = content.replace('export async function fetchWorkloadPriorities(): Promise<any>', 'export async function fetchWorkloadPriorities(...args: any[]): Promise<any>')
content = content.replace('export async function fetchWorkloadQueues(): Promise<any>', 'export async function fetchWorkloadQueues(...args: any[]): Promise<any>')
content = content.replace('export async function fetchWorkloadDistribution(): Promise<any>', 'export async function fetchWorkloadDistribution(...args: any[]): Promise<any>')
content = content.replace('export async function fetchWorkloadTrends(): Promise<any>', 'export async function fetchWorkloadTrends(...args: any[]): Promise<any>')
content = content.replace('export async function fetchWorkloadRecommendations(): Promise<any>', 'export async function fetchWorkloadRecommendations(...args: any[]): Promise<any>')

with open('src/api/dashboardApi.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/Phase24Evaluation.tsx', 'r', encoding='utf-8') as f:
    phase_content = f.read()

phase_content = phase_content.replace(
    "import { fetchPhase24Validation, Phase24ValidationResult }",
    "import { fetchPhase24Validation } from '../api/dashboardApi';\nimport type { Phase24ValidationResult }"
)

with open('src/components/Phase24Evaluation.tsx', 'w', encoding='utf-8') as f:
    f.write(phase_content)
