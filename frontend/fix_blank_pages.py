import os
import re

def safe_replace(filepath, pattern, replacement):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Phase24Evaluation (MVP Evaluation)
phase24_path = 'src/components/Phase24Evaluation.tsx'
safe_replace(phase24_path, r'if \(!data\) return null;', 'if (!data) return <div className="p-6">No evaluation data available.</div>;')

exec_path = 'src/components/ExecutiveDashboard.tsx'
safe_replace(exec_path, r'if \(!summary\) return null;', 'if (!summary) return <div className="p-6 text-slate-500">No executive summary data available.</div>;')
safe_replace(exec_path, r'trends\.map', '(trends || []).map')
safe_replace(exec_path, r'performance\.map', '(performance || []).map')
safe_replace(exec_path, r'wards\.map', '(wards || []).map')
safe_replace(exec_path, r'attention\.map', '(attention || []).map')
safe_replace(exec_path, r'priorities\.map', '(priorities || []).map')

pred_path = 'src/components/PredictiveOperations.tsx'
safe_replace(pred_path, r'if \(!summary\) return null;', 'if (!summary) return <div className="p-6 text-slate-500">No predictive data available.</div>;')
safe_replace(pred_path, r'trends\.map', '(trends || []).map')

sim_path = 'src/components/SimulationCenter.tsx'
safe_replace(sim_path, r'if \(!scenario\) return null;', 'if (!scenario) return <div className="p-6 text-slate-500">No simulation scenario available.</div>;')
safe_replace(sim_path, r'if \(!comparison\) return null;', 'if (!comparison) return <div className="p-6 text-slate-500">No simulation comparison available.</div>;')

print("Replaced null returns with empty states.")
