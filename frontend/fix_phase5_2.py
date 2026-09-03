import re
import os

def clean_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        code = f.read()

    # Remove the unused imports line I added
    if "import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton }" in code:
        code = code.replace("import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';\n", "")
    
    # Fix Reports.tsx multiple default exports
    if "export default function Reports() {" in code and "export default Reports;" in code:
        code = code.replace("export default function Reports() {", "const Reports = () => {")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(code)

clean_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Reports.tsx")
clean_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/FacilityBenchmarking.tsx")
clean_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/AdminDashboard.tsx")
clean_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/ExecutiveDashboard.tsx")
