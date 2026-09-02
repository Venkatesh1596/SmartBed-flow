import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, AlertTriangle, ActivitySquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
    fetchPredictiveSummary,
    fetchPredictiveTrends,
    fetchPredictiveWards,
    fetchPredictiveWarnings,
    fetchPredictiveRecommendations,
    type PredictiveSummary,
    type PredictiveTrendData,
    type WardEarlyWarning,
    type PredictiveWarning,
    type PredictiveRecommendation
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
import { Line } from 'react-chartjs-2';

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

const PredictiveOperations: React.FC = () => {
    const [summary, setSummary] = useState<PredictiveSummary | null>(null);
    const [trendData, setTrendData] = useState<PredictiveTrendData | null>(null);
    const [wards, setWards] = useState<WardEarlyWarning[]>([]);
    const [warnings, setWarnings] = useState<PredictiveWarning[]>([]);
    const [recommendations, setRecommendations] = useState<PredictiveRecommendation[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState<number>(7);

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        setError(null);
        try {
            const results = await Promise.allSettled([
                fetchPredictiveSummary(),
                fetchPredictiveTrends(days),
                fetchPredictiveWards(),
                fetchPredictiveWarnings(),
                fetchPredictiveRecommendations()
            ]);

            if (results[0].status === 'fulfilled') setSummary(results[0].value);
            if (results[1].status === 'fulfilled') setTrendData(results[1].value);
            if (results[2].status === 'fulfilled') setWards(results[2].value);
            if (results[3].status === 'fulfilled') setWarnings(results[3].value);
            if (results[4].status === 'fulfilled') setRecommendations(results[4].value);

        } catch (err) {
            setError('Unable to load predictive operations data.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            loadData(true);
        }, 30000);
        return () => clearInterval(interval);
    }, [days]);

    const getPressureColor = (score: number) => {
        if (score >= 80) return 'text-rose-600 bg-rose-100';
        if (score >= 60) return 'text-orange-600 bg-orange-100';
        if (score >= 40) return 'text-amber-600 bg-amber-100';
        return 'text-emerald-600 bg-emerald-100';
    };

    if (loading && !summary) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500 font-medium animate-pulse flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading predictive models...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
            <header className="mb-8 border-b-2 border-slate-200 pb-4 flex justify-between items-end">
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
<h1 className="text-3xl font-black tracking-tight text-slate-800">Predictive Operations</h1>
                    <p className="text-slate-500 font-medium tracking-wide text-sm mt-1 uppercase">Early Warning & Analytics</p>
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
                <div className="flex gap-4 items-center">
                    <Link to="/" className="text-sm font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 px-4 py-2 rounded transition-colors">
                        &larr; Dashboard
                    </Link>
                    <button 
                        onClick={() => loadData(true)} 
                        disabled={refreshing}
                        className="flex items-center gap-2 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> 
                        {refreshing ? 'Refreshing...' : 'Manual Refresh'}
                    </button>
                </div>
            </header>

      {/* WORKLOAD CTA */}
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl mr-4">⚖️</span>
          <div>
            <h3 className="text-md font-bold text-emerald-900">Intelligent Workload Prioritization</h3>
            <p className="text-sm text-emerald-700">View priority boards, manage queues, and balance staff workload.</p>
          </div>
        </div>
        <Link to="/workload" className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold border border-emerald-300 rounded shadow-sm hover:bg-emerald-100 transition-colors">
          View Workload
        </Link>
      </div>


      {/* SIMULATION CTA */}
      <div className="mb-8 bg-orange-50 border border-orange-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl mr-4">🧪</span>
          <div>
            <h3 className="text-md font-bold text-orange-900">Operational Simulation</h3>
            <p className="text-sm text-orange-700">Model scenarios and test operational changes before implementing them.</p>
          </div>
        </div>
        <Link to="/simulation" className="px-4 py-2 bg-white text-orange-700 text-sm font-bold border border-orange-300 rounded shadow-sm hover:bg-orange-100 transition-colors">
          Try Simulation Center
        </Link>
      </div>

            {error && (
                <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* KPI Strip */}
            <section className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Early-Warning Score</span>
                        <span className={`text-4xl font-black px-4 py-2 rounded-lg ${summary ? getPressureColor(summary.early_warning_score) : 'text-slate-400'}`}>
                            {summary?.early_warning_score || '-'}
                        </span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Capacity Pressure</span>
                        <span className="text-2xl font-black text-slate-800 mt-2">{summary?.capacity_pressure || '-'}%</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">SLA Pressure</span>
                        <span className="text-2xl font-black text-slate-800 mt-2">{summary?.sla_pressure || '-'}%</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cleaning Pressure</span>
                        <span className="text-2xl font-black text-slate-800 mt-2">{summary?.cleaning_pressure || '-'}%</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Workflow Pressure</span>
                        <span className="text-2xl font-black text-slate-800 mt-2">{summary?.workflow_pressure || '-'}%</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <ActivitySquare className="w-5 h-5 text-indigo-500" /> Operational Pressure Trend
                        </h2>
                        <select 
                            value={days} 
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="border-slate-300 rounded-md shadow-sm text-sm"
                        >
                            <option value={7}>7 Days</option>
                            <option value={14}>14 Days</option>
                            <option value={30}>30 Days</option>
                            <option value={90}>90 Days</option>
                        </select>
                    </div>
                    <div className="h-64">
                        {trendData ? (
                            <Line 
                                data={{
                                    labels: trendData.labels,
                                    datasets: [
                                        {
                                            label: 'Facility Pressure',
                                            data: trendData.facility_pressure,
                                            borderColor: 'rgb(244, 63, 94)', // rose-500
                                            backgroundColor: 'rgba(244, 63, 94, 0.5)',
                                            tension: 0.3
                                        },
                                        {
                                            label: 'Predicted Occupancy',
                                            data: trendData.occupancy_prediction,
                                            borderColor: 'rgb(59, 130, 246)', // blue-500
                                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                            tension: 0.3
                                        }
                                    ]
                                }} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100
                                        }
                                    }
                                }} 
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                No trend data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Warnings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" /> Active Warnings
                    </h2>
                    <div className="space-y-4">
                        {warnings.length > 0 ? warnings.map(w => (
                            <div key={w.id} className={`p-3 rounded-lg border-l-4 ${w.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-500' : 'bg-orange-50 border-orange-400'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-800 text-sm">{w.type}</span>
                                    <span className="text-xs font-mono text-slate-500">{w.timeframe}</span>
                                </div>
                                <div className="text-sm text-slate-600 mb-1">{w.message}</div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No active warnings.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Ward Early-Warning Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" /> Ward Early-Warning Grid
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-semibold">Ward</th>
                                    <th className="p-4 font-semibold">Warning Score</th>
                                    <th className="p-4 font-semibold">Pressure</th>
                                    <th className="p-4 font-semibold">Predicted Occ.</th>
                                    <th className="p-4 font-semibold">Blockers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {wards.length > 0 ? wards.map(w => (
                                    <tr key={w.ward_id} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-800">{w.ward_name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getPressureColor(w.warning_score)}`}>
                                                {w.warning_score}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold uppercase ${w.pressure_level === 'CRITICAL' ? 'text-rose-600' : w.pressure_level === 'HIGH' ? 'text-orange-600' : 'text-slate-600'}`}>
                                                {w.pressure_level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{w.predicted_occupancy}%</td>
                                        <td className="p-4 text-slate-600 font-medium">{w.critical_blockers}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-slate-500">No ward data available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Operational Recommendations
                    </h2>
                    <div className="space-y-4">
                        {recommendations.length > 0 ? recommendations.map(rec => (
                            <div key={rec.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-800">{rec.action}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {rec.priority}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600">Impact: <span className="font-medium text-slate-800">{rec.impact}</span></div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No recommendations at this time.</p>
                        )}
                    </div>
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

export default PredictiveOperations;
