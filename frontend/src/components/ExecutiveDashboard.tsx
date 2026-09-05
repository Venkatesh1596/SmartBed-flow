import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchExecutiveSummary, 
  fetchExecutivePerformance, 
  fetchExecutiveWards, 
  fetchExecutiveTrends, 
  fetchExecutiveAttention, 
  fetchExecutivePriorities,
  type ExecutiveSummary,
  type ExecutivePerformance,
  type ExecutiveWard,
  type ExecutiveTrend,
  type ExecutiveAttention,
  type ExecutivePriority 
} from '../api/dashboardApi';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

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

const ExecutiveDashboard = () => {
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [performance, setPerformance] = useState<ExecutivePerformance[]>([]);
  const [wards, setWards] = useState<ExecutiveWard[]>([]);
  const [trends, setTrends] = useState<ExecutiveTrend[]>([]);
  const [attention, setAttention] = useState<ExecutiveAttention[]>([]);
  const [priorities, setPriorities] = useState<ExecutivePriority[]>([]);

  const loadData = async (currentDays: number) => {
    setLoading(true);
    setError(null);
    try {
      const [sum, perf, wds, trnds, att, prios] = await Promise.all([
        fetchExecutiveSummary(currentDays),
        fetchExecutivePerformance(currentDays),
        fetchExecutiveWards(currentDays),
        fetchExecutiveTrends(currentDays),
        fetchExecutiveAttention(currentDays),
        fetchExecutivePriorities(currentDays)
      ]);
      setSummary(sum);
      setPerformance(perf);
      setWards(wds);
      setTrends(trnds);
      setAttention(att);
      setPriorities(prios);
    } catch {
      setError('Unable to load executive dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
    const interval = setInterval(() => {
      loadData(days);
    }, 60000); // 1 minute refresh
    return () => clearInterval(interval);
  }, [days]);

  const trendChartData = {
    labels: (trends || []).map(t => t.date),
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: (trends || []).map(t => t.occupancy_rate || 0),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        yAxisID: 'y'
      }
    ]
  };

  const flowChartData = {
    labels: (trends || []).map(t => t.date),
    datasets: [
      {
        label: 'Admissions',
        data: (trends || []).map(t => t.admissions || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
      {
        label: 'Discharges',
        data: (trends || []).map(t => t.discharges || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      }
    ]
  };

  if (loading && !summary) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Executive Reporting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
<h1 className="text-2xl font-bold text-slate-900">Executive Reporting</h1>
          <p className="text-sm text-slate-500">High-level overview of hospital performance and operations.</p>
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
        <div className="flex flex-row items-center gap-4">
          <Link to="/capacity" className="text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded transition-colors whitespace-nowrap">Capacity Planning &rarr;</Link>
          <Link to="/orchestration" className="text-sm font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded transition-colors whitespace-nowrap">Workflow Orchestration &rarr;</Link>
          <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {[7, 14, 30, 90].map((period) => (
            <button
              key={period}
              onClick={() => setDays(period)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                days === period
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {period} Days
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* SYSTEM ADMINISTRATION CTA */}
      <section className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">System Administration</h2>
            <p className="text-slate-300 text-sm">Manage users, system configurations, and view system health.</p>
          </div>
          <Link to="/admin" className="px-5 py-2.5 bg-white text-slate-800 hover:bg-slate-100 font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
            System Administration
          </Link>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-purple-900 mb-1">Predictive Operations</h2>
            <p className="text-purple-700 text-sm">Early warning, analytic trends, and predictive pressure modeling.</p>
          </div>
          <Link to="/predictive-operations" className="px-5 py-2.5 bg-purple-600 text-white hover:bg-purple-700 font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
            Predictive Ops
          </Link>
        </div>
      </section>

      {error && (
        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-800 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* KPI Strips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Avg Occupancy</div>
          <div className="text-3xl font-bold text-slate-900">
            {summary?.occupancy_rate?.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Admissions</div>
          <div className="text-3xl font-bold text-slate-900">
            {summary?.admissions_total?.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Discharges</div>
          <div className="text-3xl font-bold text-slate-900">
            {summary?.discharges_total?.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Avg Turnover Time</div>
          <div className="text-3xl font-bold text-slate-900">
            {summary?.avg_turnover_time?.toFixed(1)} <span className="text-lg text-slate-500 font-normal">mins</span>
          </div>
        </div>
        <Link to="/orchestration" className="block bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm hover:bg-indigo-100 transition-colors">
          <div className="text-sm font-bold text-indigo-700 mb-1">Operational Allocation Pressure</div>
          <div className="text-3xl font-black text-indigo-900 flex items-center justify-between">
            {summary?.occupancy_rate ? Math.round(summary.occupancy_rate * 0.8) : '-'}
            <span className="text-sm font-medium bg-indigo-200 text-indigo-800 px-2 py-1 rounded">View Queue &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facility Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Facility Occupancy Trend</h2>
          <div className="h-64">
            <Line
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 100 }
                }
              }}
            />
          </div>
        </div>

        {/* Flow Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Patient Flow Trend</h2>
          <div className="h-64">
            <Bar
              data={flowChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Index */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Performance Index</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(performance || []).map((p, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{p.kpi}</div>
                  <div className="text-xs text-slate-500">Target: {p.target}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{p.value}</div>
                  <div className={`text-xs font-medium ${
                    p.status === 'on-track' ? 'text-emerald-600' :
                    p.status === 'warning' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {p.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            {performance.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No performance data available.</div>
            )}
          </div>
        </div>

        {/* Operational Attention */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Operational Attention</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(attention || []).map((att, idx) => (
              <div key={idx} className="p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">{att.area}</div>
                  <div className="text-sm text-slate-600 mt-1">{att.issue}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase font-medium">Impact: {att.impact}</div>
                </div>
              </div>
            ))}
            {attention.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No critical operational issues.</div>
            )}
          </div>
        </div>

        {/* Priorities */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Strategic Priorities</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(priorities || []).map((prio, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-slate-900">{prio.priority}</div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    prio.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {prio.status}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mt-2">{prio.action}</div>
              </div>
            ))}
            {priorities.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No active priorities listed.</div>
            )}
          </div>
        </div>
      </div>

      {/* Ward Performance Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Ward Performance Grid</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Ward</th>
                <th className="px-6 py-3 text-right">Occupancy (%)</th>
                <th className="px-6 py-3 text-right">Admissions</th>
                <th className="px-6 py-3 text-right">Discharges</th>
                <th className="px-6 py-3 text-right">Avg Turnover (min)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(wards || []).map((ward, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-900">{ward.ward_name}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ward.occupancy_rate.toFixed(1)}%</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ward.admissions}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ward.discharges}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ward.avg_turnover_time.toFixed(1)}</td>
                </tr>
              ))}
              {wards.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No ward data available for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    
            {/* BENCHMARKING CTA */}
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-4 flex flex-col justify-center items-center text-center mt-4 mb-4">
                <h3 className="font-bold text-teal-900 mb-2">Facility Benchmarking</h3>
                <p className="text-sm text-teal-700 mb-4">Compare operational performance against standards.</p>
                <Link to="/benchmarking" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 w-full transition-colors shadow-sm">View Benchmarks</Link>
            </div>

</div>
  );
};

export default ExecutiveDashboard;
