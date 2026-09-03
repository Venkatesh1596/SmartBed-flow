import os
import re

path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/AdminDashboard.tsx"
with open(path, "r") as f:
    content = f.read()

# Remove fetchAdminSummary and AdminSummary from import
content = re.sub(r"fetchAdminSummary,\s*", "", content)
content = re.sub(r"type AdminSummary,\s*", "", content)

# Remove summary state
content = re.sub(r"const \[summary, setSummary\] = useState<AdminSummary \| null>\(null\);\n", "", content)

# Remove fetchAdminSummary from Promise.all
content = re.sub(r"fetchAdminSummary\(\),\s*", "", content)
content = re.sub(r"const \[sumData, healthData, configData, usersData\] =", "const [healthData, configData, usersData] =", content)
content = re.sub(r"setSummary\(sumData\);\s*", "", content)

# Update KPIs in UI
# <p className="mt-1 text-sm text-slate-500">Total: {summary?.total_users} | Active: {summary?.active_users}</p>
new_users_kpi = r'<p className="mt-1 text-sm text-slate-500">Total: {users.length} | Active: {users.filter(u => u.is_active).length}</p>'
content = re.sub(r'<p className="mt-1 text-sm text-slate-500">Total: \{summary\?\.total_users\}.*?</p>', new_users_kpi, content, flags=re.DOTALL)

# <p>Last Backup: {summary?.last_backup || 'N/A'}</p>
new_backup_kpi = r'<p>Last Backup: N/A</p>'
content = re.sub(r"<p>Last Backup: \{summary\?\.last_backup \|\| 'N/A'\}</p>", new_backup_kpi, content)

with open(path, "w") as f:
    f.write(content)
print("Updated AdminDashboard.tsx")
