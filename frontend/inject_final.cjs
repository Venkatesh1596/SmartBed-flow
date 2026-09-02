const fs = require('fs');

const ctaHtml = `
        {/* Simulation CTA */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-blue-900">Test Scenarios in Simulation Center</h3>
                <p className="text-sm text-blue-700 mt-1">Run 'what-if' models without affecting live hospital data.</p>
            </div>
            <Link to="/simulation" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Open Simulation
            </Link>
        </div>
`;

['ExecutiveDashboard.tsx', 'CapacityPlanning.tsx', 'Reports.tsx', 'Dashboard.tsx', 'WorkflowOrchestration.tsx', 'PredictiveOperations.tsx'].forEach(f => {
    let content = fs.readFileSync('src/components/' + f, 'utf8');
    if (content.includes('Simulation CTA')) {
        console.log('Already in ' + f);
        return;
    }
    
    if (!content.includes('import { Link }')) {
        content = content.replace(/(import React.*?from 'react';)/, '$1\nimport { Link } from \'react-router-dom\';');
    }
    
    let idx = content.indexOf('</h1>');
    if (idx !== -1) {
        const pIdx = content.indexOf('</p>', idx);
        const insertPos = (pIdx !== -1 && pIdx - idx < 200) ? pIdx + 4 : idx + 5;
        content = content.substring(0, insertPos) + ctaHtml + content.substring(insertPos);
        fs.writeFileSync('src/components/' + f, content);
        console.log('Injected into ' + f);
    } else {
        console.log('Could not find h1 in ' + f);
    }
});
