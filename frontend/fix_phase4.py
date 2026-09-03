import re

def fix_sim(code):
    code = code.replace("comparison.baseline.performance_index", "comparison.baseline.summary.performance_index")
    code = code.replace("comparison.scenario.performance_index", "comparison.scenario.summary.performance_index")
    code = code.replace("comparison.baseline.early_warning_score", "comparison.baseline.summary.early_warning_score")
    code = code.replace("comparison.scenario.early_warning_score", "comparison.scenario.summary.early_warning_score")
    code = code.replace("comparison.baseline.capacity_pressure", "comparison.baseline.summary.capacity_pressure")
    code = code.replace("comparison.scenario.capacity_pressure", "comparison.scenario.summary.capacity_pressure")
    code = code.replace("comparison.ward_impacts.map((ward, i)", "comparison.scenario.wards.map((ward: any, i: number)")
    code = code.replace("import { Play", "import React, { Play")
    code = re.sub(r"import \{ Play", "import { Play", code)
    return code

def fix_orch(code):
    code = code.replace("summary.active_workflows", "(summary.occupied + summary.cleaning)")
    code = code.replace("summary.completed_today", "summary.available_now")
    code = code.replace("summary.sla_breaches", "summary.blocked")
    code = code.replace("summary.pending_assignments", "summary.available_soon")
    code = code.replace("rec.impact_score", "rec.confidence")
    code = code.replace("rec.reason", "rec.expected_impact")
    code = code.replace("rec.affected_wards.map((w, wi)", "[rec.target].map((w: any, wi: number)")
    code = code.replace("block.workflow_id", "block.id")
    code = code.replace("block.reason", "block.description")
    code = code.replace("block.severity", "'critical'")
    return code

def fix_phase24(code):
    code = code.replace("overall_status: \"SUCCESS\"", "")
    code = code.replace("overall_status === 'SUCCESS' ? 'ON_TRACK' : data.overall_status", "'ON_TRACK'")
    return code


with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "r", encoding="utf-8") as f:
    code = f.read()
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "w", encoding="utf-8") as f:
    f.write(fix_sim(code))

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/WorkflowOrchestration.tsx", "r", encoding="utf-8") as f:
    code = f.read()
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/WorkflowOrchestration.tsx", "w", encoding="utf-8") as f:
    f.write(fix_orch(code))

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "r", encoding="utf-8") as f:
    code = f.read()
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "w", encoding="utf-8") as f:
    f.write(fix_phase24(code))

