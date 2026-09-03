const fs = require('fs');
let code = fs.readFileSync('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx', 'utf-8');
code = code.replace(
    'urgent: {\n                            name: "ICU Stepdown",\n                            timeline: ["ICU transfer requested", "Priority bed assigned", "Rapid cleaning triggered", "Bed ready", "Patient transferred"]\n                        }\n                    },',
    'urgent: {\n                            name: "ICU Stepdown",\n                            timeline: ["ICU transfer requested", "Priority bed assigned", "Rapid cleaning triggered", "Bed ready", "Patient transferred"]\n                        }\n                    },\n                    edge_cases: [],\n                    human_review_points: [],\n                    failure_cases: [],\n                    error_analysis: ""'
);
fs.writeFileSync('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Phase24Evaluation.tsx', code);
