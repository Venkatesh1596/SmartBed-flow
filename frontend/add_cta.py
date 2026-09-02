import os

components = [
    'Dashboard.tsx', 'CommandCenter.tsx', 'ExecutiveDashboard.tsx', 
    'CapacityPlanning.tsx', 'WorkflowOrchestration.tsx', 'PredictiveOperations.tsx', 
    'Reports.tsx', 'SimulationCenter.tsx', 'AdminDashboard.tsx'
]

cta_html = r'''
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 flex justify-between items-center rounded shadow-sm">
                <div>
                    <p className="text-sm text-blue-700 font-bold">Real-Time Operations</p>
                    <p className="text-xs text-blue-600">Monitor all hospital metrics in real-time</p>
                </div>
                <Link to="/control-tower" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                    Go to Control Tower
                </Link>
            </div>
'''

for comp in components:
    filepath = os.path.join('src', 'components', comp)
    if not os.path.exists(filepath):
        print(f"Skipping {comp}, not found.")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'Go to Control Tower' in content:
        continue

    # Need to make sure Link is imported
    if 'from \'react-router-dom\'' not in content and 'from "react-router-dom"' not in content:
        content = content.replace("import React", "import { Link } from 'react-router-dom';\nimport React")
    elif 'Link' not in content:
        content = content.replace("from 'react-router-dom';", "Link, from 'react-router-dom';").replace("Link, from", "Link, { from").replace("from 'react-router-dom'", "} from 'react-router-dom'") # rough logic, let's just insert it safely
        
    # Better import injection:
    if 'import { Link' not in content and 'import {Link' not in content:
        if 'react-router-dom' in content:
            content = content.replace('react-router-dom\';', 'react-router-dom\';\nimport { Link } from \'react-router-dom\';')
            content = content.replace('react-router-dom\";', 'react-router-dom\";\nimport { Link } from \'react-router-dom\';')
        else:
            content = "import { Link } from 'react-router-dom';\n" + content
            
    # Inject CTA after the first main div
    # Usually it's something like `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`
    # Let's just find the first `<h1` or `<h2` and insert before its parent or before it
    
    parts = content.split('<h1')
    if len(parts) > 1:
        # Find the preceding div or just put it before the h1 block
        content = parts[0] + cta_html + '<h1' + parts[1]
    else:
        parts = content.split('<h2')
        if len(parts) > 1:
            content = parts[0] + cta_html + '<h2' + parts[1]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {comp}")
