import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, BarChart2, TrendingUp, AlertTriangle, Zap, Target, Compass } from 'lucide-react';
import {
    fetchBenchmarkingKPIs,
    fetchBenchmarkingDimensions,
    fetchBenchmarkingTrends,
    fetchBenchmarkingWards,
    fetchBenchmarkingGaps,
    fetchBenchmarkingOptimizations,
    fetchBenchmarkingPriorities,
    fetchBenchmarkingPeriodComparison,
    type BenchmarkingKPI,
    type BenchmarkingDimension,
    type BenchmarkingTrend,
    type BenchmarkingWard,
    type BenchmarkingGap,
    type BenchmarkingOptimization,
    type BenchmarkingPriority,
    type BenchmarkingPeriodComparison
} from '../api/dashboardApi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const FacilityBenchmarking: React.FC = () => {
    const [days, setDays] = useState<number>(30);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const [kpis, setKpis] = useState<BenchmarkingKPI | null>(null);
    const [dimensions, setDimensions] = useState<BenchmarkingDimension[]>([]);
    const [trends, setTrends] = useState<BenchmarkingTrend[]>([]);
    const [wards, setWards] = useState<BenchmarkingWard[]>([]);
    const [gaps, setGaps] = useState<BenchmarkingGap[]>([]);
    const [optimizations, setOptimizations] = useState<BenchmarkingOptimization[]>([]);
    const [priorities, setPriorities] = useState<BenchmarkingPriority[]>([]);
    const [comparisons, setComparisons] = useState<BenchmarkingPeriodComparison[]>([]);

    const fetchAllData = async (currentDays: number = days) => {
        setLoading(true);
        Promise.allSettled([
            fetchBenchmarkingKPIs(currentDays).then(setKpis).catch(console.error),
            fetchBenchmarkingDimensions(currentDays).then(setDimensions).catch(console.error),
            fetchBenchmarkingTrends(currentDays).then(setTrends).catch(console.error),
            fetchBenchmarkingWards(currentDays).then(setWards).catch(console.error),
            fetchBenchmarkingGaps(currentDays).then(setGaps).catch(console.error),
            fetchBenchmarkingOptimizations(currentDays).then(setOptimizations).catch(console.error),
            fetchBenchmarkingPriorities(currentDays).then(setPriorities).catch(console.error),
            fetchBenchmarkingPeriodComparison(currentDays).then(setComparisons).catch(console.error),
        ]).finally(() => {
            setLoading(false);
            setLastRefresh(new Date());
        });
    };

    useEffect(() => {
        fetchAllData(days);
        const interval = setInterval(() => {
            fetchAllData(days);
        }, 30000);
        return () => clearInterval(interval);
    }, [days]);

    const getStatusColor = (status: string) => {
        if (status === 'EXCELLENT' || status === 'ON_TRACK') return 'text-emerald-600 bg-emerald-100';
        if (status === 'GOOD' || status === 'WARNING') return 'text-amber-600 bg-amber-100';
        if (status === 'POOR' || status === 'CRITICAL') return 'text-rose-600 bg-rose-100';
        return 'text-slate-600 bg-slate-100';
    };

    const getPriorityColor = (level: string) => {
        if (level === 'CRITICAL') return 'border-rose-500 bg-rose-50';
        if (level === 'HIGH') return 'border-orange-500 bg-orange-50';
        if (level === 'MEDIUM') return 'border-amber-500 bg-amber-50';
        return 'border-blue-500 bg-blue-50';
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <BarChart2 className="w-8 h-8 text-blue-600" />
                        Facility Benchmarking
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Operational standards and peer comparison</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span className="text-xs text-slate-500 font-medium">Last updated: {lastRefresh.toLocaleTimeString()}</span>
                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block px-3 py-2"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={14}>Last 14 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 90 Days</option>
                    </select>
                    <button
                        onClick={() => fetchAllData(days)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Benchmark Score</p>
                    <p className="text-3xl font-black text-indigo-600">{kpis?.benchmark_score || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Occupancy Efficiency</p>
                    <p className="text-3xl font-black text-blue-600">{kpis?.occupancy_efficiency || 0}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Bed Availability</p>
                    <p className="text-3xl font-black text-emerald-600">{kpis?.bed_availability || 0}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">SLA Performance</p>
                    <p className="text-3xl font-black text-purple-600">{kpis?.sla_performance || 0}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Turnover Perf.</p>
                    <p className="text-3xl font-black text-amber-600">{kpis?.turnover_performance || 0}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Trends Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Facility Trend vs Peer Average
                    </h2>
                    <div className="h-64">
                        {trends.length > 0 ? (
                            <Line
                                options={{ responsive: true, maintainAspectRatio: false }}
                                data={{
                                    labels: trends.map(t => t.date),
                                    datasets: [
                                        { label: 'Facility Score', data: trends.map(t => t.score), borderColor: '#4f46e5', backgroundColor: '#4f46e5', tension: 0.3 },
                                        { label: 'Peer Average', data: trends.map(t => t.peer_average), borderColor: '#94a3b8', backgroundColor: '#94a3b8', borderDash: [5, 5], tension: 0.3 },
                                    ]
                                }}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No trend data</div>
                        )}
                    </div>
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-500" /> Performance Dimensions
                    </h2>
                    <div className="space-y-4">
                        {dimensions.map((dim, idx) => (
                            <div key={idx} className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold text-slate-700">{dim.category}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getStatusColor(dim.status)}`}>{dim.status}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">{dim.score} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                                    <span className="text-xs text-slate-500">Target: {dim.target}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(dim.score / 100) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Period Comparison */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-blue-500" /> Period Comparison
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-4 py-2 rounded-tl-lg">Metric</th>
                                    <th className="px-4 py-2 text-right">Current</th>
                                    <th className="px-4 py-2 text-right">Previous</th>
                                    <th className="px-4 py-2 text-right rounded-tr-lg">Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {comparisons.map((comp, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-3 font-semibold text-slate-700">{comp.metric}</td>
                                        <td className="px-4 py-3 text-right">{comp.current_period}</td>
                                        <td className="px-4 py-3 text-right text-slate-500">{comp.previous_period}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${comp.change_pct > 0 ? 'text-emerald-600' : comp.change_pct < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                                            {comp.change_pct > 0 ? '+' : ''}{comp.change_pct}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Gaps */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" /> Performance Gaps
                    </h2>
                    <div className="space-y-3">
                        {gaps.map((gap, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{gap.metric}</p>
                                    <p className="text-xs text-slate-500">Current: <span className="font-semibold text-slate-700">{gap.current}</span> | Benchmark: <span className="font-semibold text-slate-700">{gap.benchmark}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-rose-600">Gap: {gap.gap}</p>
                                    <p className="text-xs text-slate-500 capitalize">{gap.impact} impact</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ward Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-slate-500" /> Ward Benchmarks
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-500 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-4 py-3">Ward</th>
                                <th className="px-4 py-3 text-center">Beds</th>
                                <th className="px-4 py-3 text-center">Occupancy</th>
                                <th className="px-4 py-3 text-center">SLA Comp.</th>
                                <th className="px-4 py-3 text-center">Workflow Eff.</th>
                                <th className="px-4 py-3 text-center">Clean Time</th>
                                <th className="px-4 py-3 text-center">Score</th>
                                <th className="px-4 py-3 text-center">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {wards.map((ward, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-slate-800">{ward.ward_name}</td>
                                    <td className="px-4 py-3 text-center">{ward.beds}</td>
                                    <td className="px-4 py-3 text-center font-medium">{ward.occupancy_rate}%</td>
                                    <td className="px-4 py-3 text-center font-medium text-purple-600">{ward.sla_compliance}%</td>
                                    <td className="px-4 py-3 text-center font-medium text-blue-600">{ward.workflow_efficiency}%</td>
                                    <td className="px-4 py-3 text-center font-medium">{ward.cleaning_time}m</td>
                                    <td className="px-4 py-3 text-center font-bold text-indigo-600">{ward.benchmark_score}</td>
                                    <td className="px-4 py-3 text-center text-xs uppercase font-bold text-slate-500">{ward.trend}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Strategic Priorities */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-500" /> Strategic Priorities
                    </h2>
                    <div className="space-y-3">
                        {priorities.map((pri, idx) => (
                            <div key={idx} className={`p-3 border-l-4 rounded-r-lg ${getPriorityColor(pri.priority_level)}`}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-800">{pri.initiative}</span>
                                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white bg-opacity-50">{pri.priority_level}</span>
                                </div>
                                <p className="text-xs text-slate-600">{pri.expected_outcome}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optimization Opportunities */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" /> Optimization Opportunities
                    </h2>
                    <div className="space-y-3">
                        {optimizations.map((opt, idx) => (
                            <div key={idx} className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold text-amber-800 uppercase mb-0.5">{opt.area}</p>
                                    <p className="text-sm font-semibold text-slate-800">{opt.action}</p>
                                    <p className="text-xs text-amber-700 mt-1">Potential Gain: {opt.potential_gain}</p>
                                </div>
                                <Link to={opt.destination} className="whitespace-nowrap px-3 py-1.5 bg-white border border-amber-300 text-amber-700 text-xs font-bold rounded shadow-sm hover:bg-amber-100 transition-colors text-center">
                                    Take Action
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityBenchmarking;
