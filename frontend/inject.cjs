const fs = require('fs');
const files = ['Dashboard.tsx', 'ExecutiveDashboard.tsx', 'CapacityPlanning.tsx', 'WorkflowOrchestration.tsx', 'PredictiveOperations.tsx', 'Reports.tsx'];
const cta = `
      {/* SIMULATION CTA */}
      <div className="mb-8 bg-orange-50 border border-orange-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl mr-4">🧪</span>
          <div>
            <h3 className="text-md font-bold text-orange-900">Operational Simulation</h3>
            <p className="text-sm text-orange-700">Model scenarios and test operational changes before implementing them.</p>
          </div>
        </div>
        <Link to="/simulation" className="px-4 py-2 bg-white text-orange-700 text-sm font-bold border border-orange-300 rounded shadow-sm hover:bg-orange-100 transition-colors">
          Try Simulation Center
        </Link>
      </div>`;

files.forEach(file => {
  const path = 'src/components/' + file;
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  
  if (!content.includes('import { Link }')) {
    if (content.includes('import { Link')) {
        // already imported
    } else {
        content = "import { Link } from 'react-router-dom';\n" + content;
    }
  }

  if (content.includes('</header>')) {
    if (!content.includes('SIMULATION CTA')) {
        content = content.replace('</header>', '</header>\n' + cta);
        fs.writeFileSync(path, content);
        console.log('Updated ' + file);
    }
  } else {
    console.log('Could not find </header> in ' + file);
  }
});
