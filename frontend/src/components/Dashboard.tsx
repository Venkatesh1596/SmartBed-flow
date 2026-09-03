import React, { useEffect, useState } from 'react';
import { 
  fetchDashboardSummary, 
  fetchOccupancyTrend, 
  fetchFlowAnalytics, 
  fetchBedAvailabilityPredictions, 
  fetchBottlenecks, 
  fetchOperationalRecommendations 
} from '../api/dashboardApi';
import { 
  Activity, BedDouble, Truck, RefreshCw, AlertTriangle, TrendingUp 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, EmptyState, LoadingSkeleton } from './ui';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const KpiCard = ({ title, value, label, icon: Icon, colorClass, trend }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.positive ? 'text-success-600' : 'text-danger-600'} flex items-center`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      {label && <p className="text-xs text-slate-400 mt-1">{label}</p>}
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);
  const [_flowData, setFlowData] = useState<any>(null); // Kept with _ to suppress lint
  const [predictions, setPredictions] = useState<any[]>([]);
  const [bottlenecks, setBottlenecks] = useState<any[]>([]);
  const [_recommendations, setRecommendations] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [sumRes, trRes, flRes, prRes, bnRes, rcRes] = await Promise.all([
          fetchDashboardSummary(),
          fetchOccupancyTrend(days),
          fetchFlowAnalytics(days),
          fetchBedAvailabilityPredictions(),
          fetchBottlenecks(),
          fetchOperationalRecommendations()
        ]);
        setSummary(sumRes);
        setTrendData(trRes);
        setFlowData(flRes);
        setPredictions(prRes || []);
        setBottlenecks(bnRes || []);
        setRecommendations(rcRes || []);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [days]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <LoadingSkeleton rows={1} className="w-64 h-8" />
          <LoadingSkeleton rows={1} className="w-32 h-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton rows={1} className="h-32" />
          <LoadingSkeleton rows={1} className="h-32" />
          <LoadingSkeleton rows={1} className="h-32" />
          <LoadingSkeleton rows={1} className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton rows={1} className="h-64 lg:col-span-2" />
          <LoadingSkeleton rows={1} className="h-64 lg:col-span-1" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return <EmptyState title="Unable to load Command Center" description={error || "Data is unavailable"} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Live operational overview for Central Hospital</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-sm border-slate-300 rounded-md bg-white py-1.5 pl-3 pr-8 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          title="Occupancy" 
          value={`${((summary.beds.occupied / summary.beds.total) * 100).toFixed(1)}%`}
          label={`${summary.beds.occupied} of ${summary.beds.total} beds filled`}
          icon={Activity}
          colorClass="bg-primary-100 text-primary-600"
        />
        <KpiCard 
          title="Available Beds" 
          value={summary.beds.available}
          label="Ready for immediate admission"
          icon={BedDouble}
          colorClass="bg-success-100 text-success-600"
        />
        <KpiCard 
          title="In Transit" 
          value={summary.transport.in_progress}
          label="Active patient transports"
          icon={Truck}
          colorClass="bg-info-100 text-info-600"
        />
        <KpiCard 
          title="Pending Clean" 
          value={summary.evs.pending}
          label="Requires EVS dispatch"
          icon={RefreshCw}
          colorClass="bg-warning-100 text-warning-600"
        />
      </div>

      {/* Analytics & Early Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Occupancy & Flow Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData ? (
              <div className="h-[300px] w-full">
                <Line
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { position: 'top' as const } },
                    scales: { y: { beginAtZero: true } }
                  }}
                  data={{
                    labels: trendData.labels,
                    datasets: [
                      { label: 'Occupied', data: trendData.occupied, borderColor: '#2563eb', backgroundColor: '#2563eb', tension: 0.3 },
                      { label: 'Available', data: trendData.available, borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 },
                    ]
                  }}
                />
              </div>
            ) : (
              <EmptyState title="No Trend Data" description="Not enough data points collected yet." />
            )}
          </CardContent>
        </Card>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-none">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-500" />
                Active Bottlenecks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {bottlenecks.length > 0 ? bottlenecks.map((bn, i) => (
                <div key={i} className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-slate-800">{bn.resource}</span>
                    <Badge variant={bn.severity === 'HIGH' ? 'danger' : 'warning'} size="sm">{bn.severity}</Badge>
                  </div>
                  <span className="text-xs text-slate-500 leading-snug">{bn.impact}</span>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No operational bottlenecks detected.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-none">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-info-500" />
                Predicted Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {predictions.length > 0 ? predictions.slice(0, 3).map((pr, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-700">Bed {pr.bed_id}</span>
                  <span className="text-success-600 font-medium">~{pr.estimated_time_to_available}m</span>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No predictions available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
