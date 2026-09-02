import re

with open('src/components/CommandCenter.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Bell import
content = content.replace("import SLAMonitor from './SLAMonitor';", "import SLAMonitor from './SLAMonitor';\nimport { Bell } from 'lucide-react';")

if "Bell } from 'lucide-react';" not in content:
    content = content.replace("from 'lucide-react';", ", Bell } from 'lucide-react';")

# Import AppNotification and fetchNotifications
imports_replacement = "    type SLAWorkflow,\n    fetchNotifications,\n    type AppNotification\n} from '../api/dashboardApi';"
content = content.replace("    type SLAWorkflow\n} from '../api/dashboardApi';", imports_replacement)

# Add state
state_str = "    const [slaWorkflows, setSlaWorkflows] = useState<SLAWorkflow[]>([]);\n    const [notifications, setNotifications] = useState<AppNotification[]>([]);"
content = content.replace("    const [slaWorkflows, setSlaWorkflows] = useState<SLAWorkflow[]>([]);", state_str)

# Fetch notifications in fetchAllData
loadData_promises = """            fetchSLASummary().then(setSlaSummary).catch(err => console.error("Error fetching SLA summary", err)),
            fetchSLAWorkflows().then(setSlaWorkflows).catch(err => console.error("Error fetching SLA workflows", err)),
            fetchNotifications().then(setNotifications).catch(err => console.error("Error fetching notifications", err))"""
content = content.replace("""            fetchSLASummary().then(setSlaSummary).catch(err => console.error("Error fetching SLA summary", err)),
            fetchSLAWorkflows().then(setSlaWorkflows).catch(err => console.error("Error fetching SLA workflows", err))""", loadData_promises)


# Add the UI section. Let's add it right after hospital status (summary section)
notifications_widget = """            {/* NOTIFICATIONS WIDGET */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500"/> Operational Notifications</h3>
                {notifications.filter(n => !n.is_read).length === 0 ? (
                    <p className="text-sm text-slate-500">No unread notifications.</p>
                ) : (
                    <div className="space-y-3">
                        {notifications.filter(n => !n.is_read).slice(0, 3).map(n => (
                            <div key={n.id} className="flex flex-col text-sm p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-700">{n.title}</span>
                                    <span className="text-xs text-slate-500">{new Date(n.created_at).toLocaleTimeString()}</span>
                                </div>
                                <span className="text-slate-600 mt-1">{n.message}</span>
                            </div>
                        ))}
                        {notifications.filter(n => !n.is_read).length > 3 && (
                            <div className="text-sm text-blue-500 font-medium cursor-pointer" onClick={() => window.location.href='/notifications'}>
                                View {notifications.filter(n => !n.is_read).length - 3} more unread notifications...
                            </div>
                        )}
                    </div>
                )}
            </div>"""

content = content.replace("            <SLAMonitor summary={slaSummary} workflows={slaWorkflows} />", notifications_widget + "\n            <SLAMonitor summary={slaSummary} workflows={slaWorkflows} />")

with open('src/components/CommandCenter.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
