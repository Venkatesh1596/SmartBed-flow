import os
path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/api/dashboardApi.ts"
with open(path, "r") as f:
    content = f.read()

# I need to remove:
# export interface AdminSummary { ... }
# export async function fetchAdminSummary() { ... }

import re
content = re.sub(r"export interface AdminSummary\s*\{[^}]+\}\s*", "", content)

func_regex = r"export async function fetchAdminSummary\(\):\s*Promise<AdminSummary>\s*\{.*?\n\}\n"
content = re.sub(func_regex, "", content, flags=re.DOTALL)

with open(path, "w") as f:
    f.write(content)
print("Removed AdminSummary from dashboardApi.ts")
