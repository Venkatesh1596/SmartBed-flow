import os
import re

api_path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/api/dashboardApi.ts"
dash_path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/AdminDashboard.tsx"

# Fix SystemHealth interface in API
with open(api_path, "r") as f:
    api_content = f.read()

new_health_interface = """export interface SystemHealth {
    status: string;
    db_connection: boolean;
    services_ok: boolean;
}"""
api_content = re.sub(r"export interface SystemHealth\s*\{[^}]+\}", new_health_interface, api_content)

with open(api_path, "w") as f:
    f.write(api_content)

# Fix AdminDashboard usages
with open(dash_path, "r") as f:
    dash_content = f.read()

# Replace CPU / Memory / Uptime with DB Connection / Services Ok
dash_content = re.sub(
    r'<h3 className="text-sm font-medium text-slate-500">CPU Usage</h3>.*?<p className="text-2xl font-bold text-slate-900">\{health\?\.cpu_usage\}%</p>',
    r'<h3 className="text-sm font-medium text-slate-500">DB Connection</h3>\n                    <p className={`text-2xl font-bold ${health?.db_connection ? \'text-green-600\' : \'text-red-600\'}`}>{health?.db_connection ? \'Connected\' : \'Disconnected\'}</p>',
    dash_content, flags=re.DOTALL
)

dash_content = re.sub(
    r'<h3 className="text-sm font-medium text-slate-500">Memory Usage</h3>.*?<p className="text-2xl font-bold text-slate-900">\{health\?\.memory_usage\}%</p>',
    r'<h3 className="text-sm font-medium text-slate-500">Services Status</h3>\n                    <p className={`text-2xl font-bold ${health?.services_ok ? \'text-green-600\' : \'text-red-600\'}`}>{health?.services_ok ? \'OK\' : \'Degraded\'}</p>',
    dash_content, flags=re.DOTALL
)

dash_content = re.sub(
    r'<div className="bg-white p-4 rounded-lg shadow border border-slate-200">\s*<h3 className="text-sm font-medium text-slate-500">Uptime</h3>\s*<p className="text-2xl font-bold text-slate-900">\{health\?\.uptime\}</p>\s*</div>',
    '',
    dash_content, flags=re.DOTALL
)

with open(dash_path, "w") as f:
    f.write(dash_content)
print("Fixed SystemHealth dependencies")
