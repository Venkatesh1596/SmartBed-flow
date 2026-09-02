import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Import AppNotification and fetchNotifications
imports_replacement = "fetchOperationalRecommendations, type DashboardSummary, type OccupancyTrendData, type FlowAnalyticsData, type DashboardAlert, type BedAvailabilityPrediction, type Bottleneck, type OperationalRecommendation, fetchNotifications, type AppNotification } from '../api/dashboardApi';"
content = content.replace("fetchOperationalRecommendations, type DashboardSummary, type OccupancyTrendData, type FlowAnalyticsData, type DashboardAlert, type BedAvailabilityPrediction, type Bottleneck, type OperationalRecommendation } from '../api/dashboardApi';", imports_replacement)

# Import Bell icon
bell_import = "import { Clock, CheckCircle2, ShieldAlert, RefreshCw, Calendar, AlertTriangle, Zap, Server, Activity, Bell } from 'lucide-react';"
content = content.replace("import { Clock, CheckCircle2, ShieldAlert, RefreshCw, Calendar, AlertTriangle, Zap, Server, Activity } from 'lucide-react';", bell_import)

# Add state for notifications
state_str = """  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [recommendations, setRecommendations] = useState<OperationalRecommendation[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);"""
content = content.replace("  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);\n  const [recommendations, setRecommendations] = useState<OperationalRecommendation[]>([]);", state_str)

# Fetch notifications in loadData
loadData_promises = """        fetchDashboardAlerts().catch(() => []),
        fetchPredictionSummary().catch(() => null),
        fetchBedAvailabilityPredictions().catch(() => []),
        fetchBottlenecks().catch(() => []),
        fetchOperationalRecommendations().catch(() => []),
        fetchNotifications().catch(() => [])
      ]);"""
content = content.replace("""        fetchDashboardAlerts().catch(() => []),
        fetchPredictionSummary().catch(() => null),
        fetchBedAvailabilityPredictions().catch(() => []),
        fetchBottlenecks().catch(() => []),
        fetchOperationalRecommendations().catch(() => [])
      ]);""", loadData_promises)

loadData_destructure = "const [summary, trend, flow, alertsData, , bedPreds, bottlenecksData, recsData, notifsData] = await Promise.all(["
content = content.replace("const [summary, trend, flow, alertsData, , bedPreds, bottlenecksData, recsData] = await Promise.all([", loadData_destructure)

setNotifs = """      setBottlenecks(bottlenecksData || []);
      setRecommendations(recsData || []);
      setNotifications(notifsData || []);"""
content = content.replace("""      setBottlenecks(bottlenecksData || []);
      setRecommendations(recsData || []);""", setNotifs)

# Add the UI section below Emergency Demand
emergency_demand_section = """      {/* NOTIFICATIONS WIDGET */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" /> Operational Notifications
        </h2>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
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
        </div>
      </section>

      <hr className="border-slate-200 mb-8" />"""

content = content.replace("{alerts.length > 0 && (", emergency_demand_section + "\n      {alerts.length > 0 && (")

with open('src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
