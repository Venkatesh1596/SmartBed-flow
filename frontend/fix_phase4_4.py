with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace(
    "},",
    "}, edge_cases: [], human_review_points: [], failure_cases: [], error_analysis: ''"
)
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("import React, { Play", "import { Play")
code = code.replace("params.cleaning_time_adjustment_minutes > 0", "(params.cleaning_time_adjustment_minutes || 0) > 0")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/WorkflowOrchestration.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("const [candidates, setCandidates] = useState<AllocationCandidate[]>([]);", "")
code = code.replace("setCandidates(cand || []);", "")
code = code.replace("const [sum, cand, block, press, que, rec]", "const [sum, _cand, block, press, que, rec]")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/WorkflowOrchestration.tsx", "w", encoding="utf-8") as f:
    f.write(code)
