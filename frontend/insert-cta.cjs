const fs = require('fs');
const path = require('path');

const files = [
    'Dashboard.tsx',
    'CommandCenter.tsx',
    'ExecutiveDashboard.tsx',
    'CapacityPlanning.tsx',
    'WorkflowOrchestration.tsx',
    'PredictiveOperations.tsx',
    'Reports.tsx',
    'SimulationCenter.tsx',
    'AdminDashboard.tsx',
    'ControlTower.tsx'
];

const ctaHtml = `
      {/* WORKLOAD CTA */}
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl mr-4">⚖️</span>
          <div>
            <h3 className="text-md font-bold text-emerald-900">Intelligent Workload Prioritization</h3>
            <p className="text-sm text-emerald-700">View priority boards, manage queues, and balance staff workload.</p>
          </div>
        </div>
        <Link to="/workload" className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold border border-emerald-300 rounded shadow-sm hover:bg-emerald-100 transition-colors">
          View Workload
        </Link>
      </div>
`;

files.forEach(file => {
    const filePath = path.join(__dirname, 'src', 'components', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Ensure Link from react-router-dom is imported if not already.
        // Easiest is to check if `import { Link }` or similar exists, but let's assume it does because it's a dashboard.
        if (!content.includes('import { Link }') && !content.includes('import { Link,')) {
            content = content.replace("import React", "import React\nimport { Link } from 'react-router-dom';");
            if (!content.includes('import { Link }')) { // fallback
                content = "import { Link } from 'react-router-dom';\n" + content;
            }
        }
        
        if (!content.includes('WORKLOAD CTA')) {
            content = content.replace('</header>', `</header>\n${ctaHtml}`);
            fs.writeFileSync(filePath, content);
            console.log('Updated', file);
        }
    }
});
