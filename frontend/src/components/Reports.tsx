import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
import { Download, FileText, TrendingUp, Activity, Users, Clock, AlertTriangle } from 'lucide-react';
import {
  fetchReportSummary,
  fetchOccupancyReport,
  fetchFlowReport,
  fetchTurnoverReport,
  fetchSLAReport,
  fetchNotificationReport,
  fetchAuditReport,
  exportReportCSV,
  exportReportPDF,
  type ReportFilters
} from '../api/dashboardApi';

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

const Reports = () => {
  const [dateRange, setDateRange] = useState<string>('7'); // '7', '14', '30', 'custom'
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [occupancyData, setOccupancyData] = useState<any>(null);
  const [flowData, setFlowData] = useState<any>(null);
  const [turnoverData, setTurnoverData] = useState<any>(null);
  const [slaData, setSlaData] = useState<any>(null);
  const [notificationData, setNotificationData] = useState<any>(null);
  const [auditData, setAuditData] = useState<any>(null);
  
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const getFilters = useCallback((): ReportFilters => {
    if (dateRange === 'custom') {
      return { start_date: startDate, end_date: endDate };
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - parseInt(dateRange));
      return {
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0]
      };
    }
  }, [dateRange, startDate, endDate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = getFilters();
      
      const [sum, occ, flow, turn, sla, notif, audit] = await Promise.all([
        fetchReportSummary(filters).catch(() => null),
        fetchOccupancyReport(filters).catch(() => null),
        fetchFlowReport(filters).catch(() => null),
        fetchTurnoverReport(filters).catch(() => null),
        fetchSLAReport(filters).catch(() => null),
        fetchNotificationReport(filters).catch(() => null),
        fetchAuditReport(filters).catch(() => null),
      ]);

      setSummary(sum);
      setOccupancyData(occ);
      setFlowData(flow);
      setTurnoverData(turn);
      setSlaData(sla);
      setNotificationData(notif);
      setAuditData(audit);

    } catch (err) {
      console.error("Failed to load report data", err);
    } finally {
      setLoading(false);
    }
  }, [getFilters]);

  useEffect(() => {
    if (dateRange !== 'custom') {
      loadData();
    }
  }, [dateRange, loadData]);

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      loadData();
    }
  };

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      await exportReportCSV(getFilters());
    } catch (err) {
      console.error("Failed to export CSV", err);
      alert("Failed to export CSV.");
    } finally {
      setExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      await exportReportPDF(getFilters());
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Failed to export PDF.");
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
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
<h1 className="text-2xl font-bold text-slate-800">Reporting & Analytics</h1>
            <p className="text-sm text-slate-500">Comprehensive hospital operations analysis</p>
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
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/capacity" className="text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors flex items-center whitespace-nowrap">Capacity Planning &rarr;</Link>
          <Link to="/orchestration" className="text-sm font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-2 rounded-lg transition-colors flex items-center whitespace-nowrap">Workflow Orchestration &rarr;</Link>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {dateRange === 'custom' && (
            <form onSubmit={handleCustomDateSubmit} className="flex gap-2 items-center">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="text-sm border-slate-300 rounded-lg" />
              <span className="text-slate-500">-</span>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="text-sm border-slate-300 rounded-lg" />
              <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium">Apply</button>
            </form>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              disabled={exportingCSV}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
              {exportingCSV ? 'Exporting...' : 'CSV'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exportingPDF}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              <FileText className="w-4 h-4" />
              {exportingPDF ? 'Exporting...' : 'PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Executive Performance CTA */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-indigo-900 mb-1">Executive Dashboard</h2>
            <p className="text-indigo-700 text-sm">High-level KPIs & strategic priorities.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/executive" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap inline-block">
              View Executive
            </Link>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-purple-900 mb-1">Predictive Operations</h2>
            <p className="text-purple-700 text-sm">Early warning & predictive modeling.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/predictive-operations" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap inline-block">
              Predictive Ops
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Strips */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-slate-500">Avg Occupancy</h3>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{summary?.avg_occupancy ? `${(summary.avg_occupancy).toFixed(1)}%` : 'N/A'}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-slate-500">Total Admissions</h3>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{summary?.total_admissions || 'N/A'}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-slate-500">Total Discharges</h3>
                <Activity className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{summary?.total_discharges || 'N/A'}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-slate-500">Avg Turnaround Time</h3>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{summary?.avg_turnaround_mins ? `${summary.avg_turnaround_mins} min` : 'N/A'}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Occupancy Trends</h3>
              <div className="h-72">
                {occupancyData ? (
                  <Line
                    options={{ responsive: true, maintainAspectRatio: false }}
                    data={{
                      labels: occupancyData.labels || [],
                      datasets: [
                        { label: 'Occupancy Rate (%)', data: occupancyData.rates || [], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.5)', tension: 0.3 },
                      ]
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Patient Flow</h3>
              <div className="h-72">
                {flowData ? (
                  <Bar
                    options={{ responsive: true, maintainAspectRatio: false }}
                    data={{
                      labels: flowData.labels || [],
                      datasets: [
                        { label: 'Admissions', data: flowData.admissions || [], backgroundColor: '#10b981' },
                        { label: 'Discharges', data: flowData.discharges || [], backgroundColor: '#6366f1' },
                      ]
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SLA Compliance */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500"/> SLA Compliance</h3>
              {slaData ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="font-medium text-emerald-800">On Track Workflows</span>
                    <span className="font-bold text-emerald-600">{slaData.on_track || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                    <span className="font-medium text-rose-800">Overdue Workflows</span>
                    <span className="font-bold text-rose-600">{slaData.overdue || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Average Overdue Time</span>
                    <span className="font-bold text-slate-600">{slaData.avg_overdue_mins || 0} mins</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No SLA data available</div>
              )}
            </div>

            {/* Turnover Info */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500"/> Bed Turnover</h3>
              {turnoverData ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-800">Total Turnovers</span>
                    <span className="font-bold text-blue-600">{turnoverData.total_turnovers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Fastest Turnover</span>
                    <span className="font-bold text-slate-600">{turnoverData.fastest_mins || 0} mins</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Slowest Turnover</span>
                    <span className="font-bold text-slate-600">{turnoverData.slowest_mins || 0} mins</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No Turnover data available</div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500"/> Notification Summary</h3>
              {notificationData ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="font-medium text-amber-800">Total Notifications</span>
                    <span className="font-bold text-amber-600">{notificationData.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Critical Alerts</span>
                    <span className="font-bold text-slate-600">{notificationData.critical || 0}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No Notification data available</div>
              )}
            </div>

            {/* Audit Summary */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-500"/> Audit Activity</h3>
              {auditData ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-purple-800">Total Audit Events</span>
                    <span className="font-bold text-purple-600">{auditData.total_events || 0}</span>
                  </div>
                  {auditData.top_modules && Object.entries(auditData.top_modules).map(([mod, count]) => (
                    <div key={mod} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg text-sm">
                      <span className="text-slate-600 capitalize">{mod}</span>
                      <span className="font-bold text-slate-700">{String(count)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500">No Audit data available</div>
              )}
            </div>

          </div>
        </div>
      )}
    
            {/* BENCHMARKING CTA */}
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-4 flex flex-col justify-center items-center text-center mt-4 mb-4">
                <h3 className="font-bold text-teal-900 mb-2">Facility Benchmarking</h3>
                <p className="text-sm text-teal-700 mb-4">Compare operational performance against standards.</p>
                <Link to="/benchmarking" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 w-full transition-colors shadow-sm">View Benchmarks</Link>
            </div>

</div>
  );
};

export default Reports;

