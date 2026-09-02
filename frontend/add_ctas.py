import os
import glob

components = [
    'Dashboard.tsx', 'CommandCenter.tsx', 'ExecutiveDashboard.tsx', 
    'Reports.tsx', 'CapacityPlanning.tsx', 'WorkflowOrchestration.tsx', 
    'PredictiveOperations.tsx', 'SimulationCenter.tsx', 'ControlTower.tsx', 
    'WorkloadPrioritization.tsx', 'AdminDashboard.tsx'
]

cta_code = '''
            {/* BENCHMARKING CTA */}
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-4 flex flex-col justify-center items-center text-center mt-4 mb-4">
                <h3 className="font-bold text-teal-900 mb-2">Facility Benchmarking</h3>
                <p className="text-sm text-teal-700 mb-4">Compare operational performance against standards.</p>
                <Link to="/benchmarking" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 w-full transition-colors shadow-sm">View Benchmarks</Link>
            </div>
'''

for comp in components:
    filepath = f'C:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/{comp}'
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We need to make sure Link is imported
        if 'import { Link' not in content and 'import {Link' not in content and 'import {  Link' not in content:
            content = content.replace("import React", "import { Link } from 'react-router-dom';\nimport React")
            
        if '<RecentActivityWidget />' in content:
            content = content.replace('<RecentActivityWidget />', cta_code + '\n            <RecentActivityWidget />')
        else:
            # find the last </div> before );
            last_div_idx = content.rfind('</div>')
            if last_div_idx != -1:
                content = content[:last_div_idx] + cta_code + '\n' + content[last_div_idx:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {comp}')
    else:
        print(f'Missing {comp}')
