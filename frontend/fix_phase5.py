import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Simple inject of Card if not present
    if "import { Card" not in content:
        content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';")
    
    # We won't regex the whole thing, just let it be. But wait, we want to fix the `React` import warnings to be clean.
    content = content.replace("import React, { useState, useEffect }", "import { useState, useEffect }")
    content = content.replace("import React, {", "import {")
    content = content.replace("const Reports: React.FC = () => {", "export default function Reports() {")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/Reports.tsx")
process_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/FacilityBenchmarking.tsx")
process_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/AdminDashboard.tsx")
process_file("c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/ExecutiveDashboard.tsx")
