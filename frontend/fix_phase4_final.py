with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "r", encoding="utf-8") as f:
    code = f.read()

target = """                        urgent: {
                            name: "ICU Stepdown",
                            timeline: ["ICU transfer requested", "Priority bed assigned", "Rapid cleaning triggered", "Bed ready", "Patient transferred"]
                        }
                    }"""

replacement = """                        urgent: {
                            name: "ICU Stepdown",
                            timeline: ["ICU transfer requested", "Priority bed assigned", "Rapid cleaning triggered", "Bed ready", "Patient transferred"]
                        }
                    },
                    edge_cases: [],
                    human_review_points: [],
                    failure_cases: [],
                    error_analysis: ""
"""
code = code.replace(target, replacement)

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx", "w", encoding="utf-8") as f:
    f.write(code)


with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("import React, { Play", "import { Play")
code = code.replace("import { Play, Settings2, RotateCcw, ActivitySquare, AlertTriangle, ChevronRight, Zap }", "import { Play, Settings2, RotateCcw, ActivitySquare, ChevronRight, Zap }")
code = code.replace("params.cleaning_time_adjustment_minutes > 0", "(params.cleaning_time_adjustment_minutes || 0) > 0")
code = code.replace("import React, { useState, useEffect }", "import { useState, useEffect }")

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/SimulationCenter.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/WorkflowOrchestration.tsx", "r", encoding="utf-8") as f:
    code = f.read()
code = code.replace("const [candidates, setCandidates] = useState<AllocationCandidate[]>([]);\n", "")
code = code.replace("setCandidates(cand || []);\n", "")
code = code.replace("const [sum, cand, block, press, que, rec] = await Promise.all([\n", "const [sum, _cand, block, press, que, rec] = await Promise.all([\n")
with open("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/WorkflowOrchestration.tsx", "w", encoding="utf-8") as f:
    f.write(code)
