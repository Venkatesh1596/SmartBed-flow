import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldAlert, RefreshCw, Calendar, AlertTriangle, Zap, Server, Activity, Bell } from 'lucide-react';
import { fetchDashboardSummary, fetchOccupancyTrend, fetchFlowAnalytics, fetchDashboardAlerts, fetchPredictionSummary, fetchBedAvailabilityPredictions, fetchBottlenecks, fetchOperationalRecommendations, type DashboardSummary, type OccupancyTrendData, type FlowAnalyticsData, type DashboardAlert, type BedAvailabilityPrediction, type Bottleneck, type OperationalRecommendation, fetchNotifications, type AppNotification } from '../api/dashboardApi';
import RecentActivityWidget from './RecentActivityWidget';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [trendData, setTrendData] = useState<OccupancyTrendData | null>(null);
  const [flowData, setFlowData] = useState<FlowAnalyticsData | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  
  // Predictive Operations States
  const [bedPredictions, setBedPredictions] = useState<BedAvailabilityPrediction[]>([]);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [recommendations, setRecommendations] = useState<OperationalRecommendation[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (currentDays: number = days) => {
    setError(null);
    try {
      const [summary, trend, flow, alertsData, , bedPreds, bottlenecksData, recsData, notifsData] = await Promise.all([
        fetchDashboardSummary(),
        fetchOccupancyTrend(currentDays).catch(() => null),
        fetchFlowAnalytics(currentDays).catch(() => null),
        fetchDashboardAlerts().catch(() => []),
        fetchPredictionSummary().catch(() => null),
        fetchBedAvailabilityPredictions().catch(() => []),
        fetchBottlenecks().catch(() => []),
        fetchOperationalRecommendations().catch(() => []),
        fetchNotifications().catch(() => [])
      ]);
      setData(summary);
      if (trend) setTrendData(trend);
      if (flow) setFlowData(flow);
      setAlerts(alertsData || []);
      setBedPredictions(bedPreds || []);
      setBottlenecks(bottlenecksData || []);
      setRecommendations(recsData || []);
      setNotifications(notifsData || []);
    } catch (err) {
      setError('Unable to load hospital operations data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData(days);
    const interval = setInterval(() => {
      loadData(days);
    }, 30000);
    return () => clearInterval(interval);
  }, [days]);

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'READY': return 'bg-amber-100 text-amber-800';
      case 'REVIEW': return 'bg-blue-100 text-blue-800';
      case 'AVAILABLE': return 'bg-emerald-100 text-emerald-800';
      case 'EXITED': return 'bg-slate-100 text-slate-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFreshnessIndicator = (freshness: string) => {
    switch (freshness) {
      case 'FRESH': return <><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Fresh</>;
      case 'AGING': return <><div className="w-2 h-2 rounded-full bg-amber-400"></div> Aging</>;
      case 'STALE': return <><div className="w-2 h-2 rounded-full bg-rose-500"></div> Stale</>;
      case 'MISSING': return <><div className="w-2 h-2 rounded-full bg-slate-400"></div> Missing</>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-medium animate-pulse flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading operational data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{error}</h2>
        <p className="text-slate-500 mb-6">Backend connection unavailable</p>
        <button onClick={() => loadData(days)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data || (!data.beds || data.beds.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 font-medium mb-4">No operational bed data available.</p>
        <button onClick={() => loadData(days)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors">
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* HEADER */}
      <header className="mb-8 border-b-2 border-slate-200 pb-4 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 flex justify-between items-center rounded shadow-sm">
                <div>
                    <p className="text-sm text-blue-700 font-bold">Real-Time Operations</p>
                    <p className="text-xs text-blue-600">Monitor all hospital metrics in real-time</p>
                </div>
                <Link to="/control-tower" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                    Go to Control Tower
                </Link>
            </div>
<h1 className="text-3xl font-black tracking-tight text-slate-800">SMARTBED FLOW</h1>
            <p className="text-slate-500 font-medium tracking-wide text-sm mt-1 uppercase">Coordination Board</p>
        {/* Simulation CTA */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-blue-900">Test Scenarios in Simulation Center</h3>
                <p className="text-sm text-blue-700 mt-1">Run 'what-if' models without affecting live hospital data.</p>
            </div>
            <Link to="/simulation" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Open Simulation
            </Link>
        </div>

          </div>
          <Link to="/capacity" className="text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded transition-colors whitespace-nowrap mb-2">Capacity Planning &rarr;</Link>
          <Link to="/orchestration" className="text-sm font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded transition-colors whitespace-nowrap mb-2">Workflow Orchestration &rarr;</Link>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">
              {user?.username ? `User: ${user.username} (${user?.role?.name})` : ''}
            </span>
            <button onClick={logout} className="text-xs font-bold bg-rose-100 text-rose-600 hover:bg-rose-200 px-3 py-1 rounded transition-colors">
              Logout
            </button>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded flex items-center">Synthetic / De-identified Data</span>
            {(user?.role?.name === 'ADMIN' || user?.role?.name === 'FACILITY_MANAGER') && (
              <div className="flex items-center gap-2">
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block px-2 py-1"
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={14}>Last 14 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
                <button onClick={() => loadData(days)} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                  <RefreshCw className="w-4 h-4" /> Refresh Data
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* WORKLOAD CTA */}
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl mr-4">âš–ï¸</span>
          <div>
            <h3 className="text-md font-bold text-emerald-900">Intelligent Workload Prioritization</h3>
            <p className="text-sm text-emerald-700">View priority boards, manage queues, and balance staff workload.</p>
          </div>
        </div>
        <Link to="/workload" className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold border border-emerald-300 rounded shadow-sm hover:bg-emerald-100 transition-colors">
          View Workload
        </Link>
      </div>

      {/* EXECUTIVE OVERVIEW CTA */}
      <section className="mb-8">
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-indigo-900 mb-1">Executive Overview</h2>
            <p className="text-indigo-700 text-sm">View high-level performance metrics, operational attention areas, and strategic priorities.</p>
          </div>
          <Link to="/executive" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
            View Executive Dashboard
          </Link>
        </div>
      </section>

      {/* SYSTEM ADMINISTRATION CTA */}
      {(user?.role?.name === 'ADMIN' || user?.role?.name === 'FACILITY_MANAGER') && (
        <section className="mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">System Administration</h2>
              <p className="text-slate-300 text-sm">Manage users, system configurations, and view system health.</p>
            </div>
            <Link to="/admin" className="px-5 py-2.5 bg-white text-slate-800 hover:bg-slate-100 font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
              System Administration
            </Link>
          </div>
        </section>
      )}

      {/* BED CAPACITY */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider">Bed Capacity</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <span className="text-slate-500 text-sm font-semibold">Total</span>
            <span className="text-3xl font-bold text-slate-800">{data.capacity.total}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <span className="text-slate-500 text-sm font-semibold">Occupied</span>
            <span className="text-3xl font-bold text-blue-600">{data.capacity.occupied}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <span className="text-slate-500 text-sm font-semibold">Ready</span>
            <span className="text-3xl font-bold text-amber-500">{data.capacity.ready}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <span className="text-slate-500 text-sm font-semibold">Turnover</span>
            <span className="text-3xl font-bold text-purple-500">{data.capacity.turnover}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <span className="text-slate-500 text-sm font-semibold">Available</span>
            <span className="text-3xl font-bold text-emerald-600">{data.capacity.available}</span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200 mb-8" />

      {/* DISCHARGE READINESS & BED TURNOVER */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider">Discharge Readiness & Bed Turnover</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold">Bed</th>
                <th className="p-4 font-semibold">Readiness</th>
                <th className="p-4 font-semibold">Turnover</th>
                <th className="p-4 font-semibold">Freshness</th>
                <th className="p-4 font-semibold">ETA</th>
                <th className="p-4 font-semibold">Blocker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.beds.map((bed, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">{bed.bed_id}</td>
                  <td className="p-4"><span className={`${getReadinessColor(bed.readiness)} px-2 py-1 rounded-md font-bold text-xs uppercase`}>{bed.readiness}</span></td>
                  <td className="p-4 text-slate-600 font-medium">{bed.turnover}</td>
                  <td className="p-4 flex items-center gap-2">{getFreshnessIndicator(bed.freshness)}</td>
                  <td className="p-4 font-mono font-medium text-slate-600">{bed.eta_minutes !== null ? `${bed.eta_minutes}m` : 'Ã¢â‚¬â€'}</td>
                  <td className="p-4 text-slate-500">{bed.blocker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-200 mb-8" />

      {/* EMERGENCY DEMAND */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider">Emergency Demand</h2>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 flex items-center gap-4 min-w-[200px]">
            <div className="bg-rose-100 p-3 rounded-full">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Critical</div>
              <div className="text-2xl font-black text-rose-600">{data.emergency_demand.critical}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center gap-4 min-w-[200px]">
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Urgent</div>
              <div className="text-2xl font-black text-orange-600">{data.emergency_demand.urgent}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-4 min-w-[200px]">
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Routine</div>
              <div className="text-2xl font-black text-emerald-600">{data.emergency_demand.routine}</div>
            </div>
          </div>
        </div>
      </section>

            {/* NOTIFICATIONS WIDGET */}
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

      <hr className="border-slate-200 mb-8" />
      {alerts.length > 0 && (
        <>
          <hr className="border-slate-200 mb-8" />
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Active Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-xl shadow-sm border flex items-start gap-3 ${alert.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                  <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${alert.severity === 'CRITICAL' ? 'text-rose-600' : 'text-orange-500'}`} />
                  <div>
                    <div className="font-bold text-sm tracking-wide">{alert.severity}</div>
                    <div className="text-sm mt-1">{alert.message}</div>
                    <div className="text-xs mt-2 opacity-70 font-medium">{new Date(alert.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* PREDICTIVE OPERATIONS */}
      <hr className="border-slate-200 mb-8" />
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" /> Predictive Operations
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Beds Available Soon */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" /> Beds Available Soon
            </h3>
            {bedPredictions.length > 0 ? (
              <div className="space-y-3">
                {bedPredictions.map((pred, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700">Bed {pred.bed_id}</span>
                    <span className="text-emerald-600 font-medium">~{pred.estimated_time_to_available}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No predictions available.</p>
            )}
          </div>

          {/* Bottlenecks */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-500" /> Bottlenecks
            </h3>
            {bottlenecks.length > 0 ? (
              <div className="space-y-3">
                {bottlenecks.map((bn, idx) => (
                  <div key={idx} className="flex flex-col text-sm p-2 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-700">{bn.resource}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${bn.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>{bn.severity}</span>
                    </div>
                    <span className="text-slate-500 text-xs">{bn.impact}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No current bottlenecks.</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" /> Operational Recommendations
            </h3>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex flex-col text-sm p-2 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                    <span className="font-bold text-slate-700">{rec.action}</span>
                    <span className="text-slate-500 text-xs mt-1">{rec.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recommendations at this time.</p>
            )}
          </div>
          
          {/* Recent Activity */}
          {/* Reporting CTA */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-slate-700 mb-2">Reporting Snapshot</h3>
            <p className="text-sm text-slate-500 mb-4">View detailed metrics and generate PDF/CSV reports.</p>
            <button onClick={() => window.location.href='/reports'} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full">Go to Reports</button>
          </div>
          {/* Predictive Operations CTA */}
          <div className="bg-purple-50 rounded-xl shadow-sm border border-purple-100 p-4 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-purple-900 mb-2">Early Warning</h3>
            <p className="text-sm text-purple-700 mb-4">Predictive operational pressures.</p>
            <Link to="/predictive-operations" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 w-full transition-colors shadow-sm">Predictive Ops</Link>
          </div>
          
            {/* BENCHMARKING CTA */}
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-4 flex flex-col justify-center items-center text-center mt-4 mb-4">
                <h3 className="font-bold text-teal-900 mb-2">Facility Benchmarking</h3>
                <p className="text-sm text-teal-700 mb-4">Compare operational performance against standards.</p>
                <Link to="/benchmarking" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 w-full transition-colors shadow-sm">View Benchmarks</Link>
            </div>

            <RecentActivityWidget />
        </div>
      </section>

      {(trendData || flowData) && (
        <>
          <hr className="border-slate-200 mb-8" />
          <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {trendData ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" /> Occupancy Trend ({days} Days)
                </h2>
                <div className="h-64">
                  <Line
                    options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }}
                    data={{
                      labels: trendData.labels,
                      datasets: [
                        { label: 'Occupied', data: trendData.occupied, borderColor: '#2563eb', backgroundColor: '#2563eb', tension: 0.3 },
                        { label: 'Available', data: trendData.available, borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 },
                        { label: 'Cleaning', data: trendData.cleaning, borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.3 },
                      ]
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center h-[340px]">
                <p className="text-slate-500 font-medium">Occupancy data unavailable</p>
              </div>
            )}

            {flowData ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-indigo-500" /> Flow Analytics ({days} Days)
                </h2>
                <div className="h-64">
                  <Bar
                    options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }}
                    data={{
                      labels: flowData.labels,
                      datasets: [
                        { label: 'Admissions', data: flowData.admissions, backgroundColor: '#6366f1' },
                        { label: 'Discharges', data: flowData.discharges, backgroundColor: '#0ea5e9' },
                      ]
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center h-[340px]">
                <p className="text-slate-500 font-medium">Flow data unavailable</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;


