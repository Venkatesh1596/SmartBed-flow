import { useEffect, useState } from 'react';
import { 
    fetchWorkloadKPIs, 
    fetchWorkloadPriorities, 
    fetchWorkloadQueues, 
    fetchWorkloadDistribution, 
    fetchWorkloadTrends, 
    fetchWorkloadRecommendations,
} from '../api/dashboardApi';
import type {
    WorkloadKPIs,
    WorkloadPriorityItem,
    WorkloadQueue,
    WorkloadDistribution,
    WorkloadTrend,
    WorkloadRecommendation
} from '../api/dashboardApi';
import { RefreshCw, AlertTriangle, Zap, List, Clock, BarChart3, Target } from 'lucide-react';
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

const WorkloadPrioritization = () => {
    const [kpis, setKpis] = useState<WorkloadKPIs | null>(null);
    const [priorities, setPriorities] = useState<WorkloadPriorityItem[]>([]);
    const [queues, setQueues] = useState<WorkloadQueue[]>([]);
    const [distribution, setDistribution] = useState<WorkloadDistribution | null>(null);
    const [trends, setTrends] = useState<WorkloadTrend[]>([]);
    const [recommendations, setRecommendations] = useState<WorkloadRecommendation[]>([]);
    
    const [days, setDays] = useState<number>(7);
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [filterQueue, setFilterQueue] = useState<string>('ALL');
    const [filterWard] = useState<string>('ALL');
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async (currentDays: number = days) => {
        try {
            setError(null);
            const results = await Promise.allSettled([
                fetchWorkloadKPIs(),
                fetchWorkloadPriorities(),
                fetchWorkloadQueues(),
                fetchWorkloadDistribution(),
                fetchWorkloadTrends(currentDays),
                fetchWorkloadRecommendations()
            ]);

            if (results[0].status === 'fulfilled') setKpis(results[0].value);
            if (results[1].status === 'fulfilled') setPriorities(results[1].value);
            if (results[2].status === 'fulfilled') setQueues(results[2].value);
            if (results[3].status === 'fulfilled') setDistribution(results[3].value);
            if (results[4].status === 'fulfilled') setTrends(results[4].value);
            if (results[5].status === 'fulfilled') setRecommendations(results[5].value);
            
        } catch {
            setError('Failed to load workload data');
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

    const filteredPriorities = priorities.filter(p => {
        if (filterPriority !== 'ALL' && p.priority !== filterPriority) return false;
        if (filterQueue !== 'ALL' && p.type !== filterQueue) return false;
        if (filterWard !== 'ALL' && p.ward !== filterWard) return false;
        return true;
    });

    if (loading && !kpis) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500 font-medium animate-pulse flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading intelligent workload...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
            <header className="mb-8 border-b-2 border-slate-200 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800">INTELLIGENT WORKLOAD</h1>
                    <p className="text-slate-500 font-medium tracking-wide text-sm mt-1 uppercase">Prioritization & Distribution</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block px-2 py-1"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={14}>Last 14 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 90 Days</option>
                    </select>
                    <button onClick={() => loadData(days)} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                        <RefreshCw className="w-4 h-4" /> Refresh Data
                    </button>
                </div>
            </header>

            {error && (
                <div className="mb-8 bg-rose-50 p-4 rounded-lg border border-rose-200 text-rose-800 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* KPI Strip */}
            {kpis && (
                <section className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-sm font-semibold">Total Items</span>
                        <span className="text-3xl font-bold text-slate-800">{kpis.total_items}</span>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl shadow-sm border border-rose-100 flex flex-col">
                        <span className="text-rose-600 text-sm font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Critical</span>
                        <span className="text-3xl font-bold text-rose-700">{kpis.critical}</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-100 flex flex-col">
                        <span className="text-orange-600 text-sm font-semibold">High Priority</span>
                        <span className="text-3xl font-bold text-orange-700">{kpis.high}</span>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100 flex flex-col">
                        <span className="text-indigo-600 text-sm font-semibold">Active Queues</span>
                        <span className="text-3xl font-bold text-indigo-700">{kpis.active_queues}</span>
                    </div>
                    <div className={`p-4 rounded-xl shadow-sm border flex flex-col ${kpis.system_pressure === 'HIGH' ? 'bg-rose-100 border-rose-200' : kpis.system_pressure === 'MEDIUM' ? 'bg-orange-100 border-orange-200' : 'bg-emerald-100 border-emerald-200'}`}>
                        <span className="text-slate-600 text-sm font-semibold">System Pressure</span>
                        <span className="text-2xl font-bold text-slate-800 mt-1">{kpis.system_pressure}</span>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Priority Board */}
                <section className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <List className="w-5 h-5 text-blue-500" /> Priority Board
                            </h2>
                            <div className="flex gap-2">
                                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="text-xs border-slate-300 rounded">
                                    <option value="ALL">All Priorities</option>
                                    <option value="CRITICAL">Critical</option>
                                    <option value="HIGH">High</option>
                                    <option value="NORMAL">Normal</option>
                                </select>
                                <select value={filterQueue} onChange={(e) => setFilterQueue(e.target.value)} className="text-xs border-slate-300 rounded">
                                    <option value="ALL">All Queues</option>
                                    {[...new Set(priorities.map(p => p.type))].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                            {filteredPriorities.map((item, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : item.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {item.priority}
                                            </span>
                                            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{item.type}</span>
                                            <span className="text-xs font-semibold text-slate-500">{item.ward}</span>
                                        </div>
                                        <div className="font-semibold text-slate-800">{item.title}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-slate-500 uppercase tracking-wide">Wait Time</span>
                                            <span className="text-sm font-bold text-slate-700">{item.wait_time_mins}m</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-slate-500 uppercase tracking-wide">Score</span>
                                            <span className="text-sm font-bold text-indigo-600">{item.score}</span>
                                        </div>
                                        {item.action_url ? (
                                            <Link to={item.action_url} className="px-3 py-1 bg-blue-50 text-blue-600 font-medium text-sm rounded hover:bg-blue-100 transition-colors">
                                                Action
                                            </Link>
                                        ) : (
                                            <button className="px-3 py-1 bg-slate-100 text-slate-400 font-medium text-sm rounded cursor-not-allowed">
                                                Action
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredPriorities.length === 0 && (
                                <div className="p-8 text-center text-slate-500">No priority items found for these filters.</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Queue Board & Recommendations */}
                <section className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-500" /> Queue Board
                        </h2>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                            {queues.map((q, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-slate-700 text-sm">{q.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">Avg Wait: {q.avg_wait_time}m</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-black text-indigo-600">{q.count}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${q.highest_priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : q.highest_priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                                            MAX: {q.highest_priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" /> Recommendations
                        </h2>
                        <div className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400 text-sm">
                                    <div className="font-bold text-slate-800">{rec.action}</div>
                                    <div className="flex justify-between items-center mt-2 text-xs">
                                        <span className="text-amber-700">Impact: <strong>{rec.impact}</strong></span>
                                        <span className="text-slate-500">Effort: {rec.effort}</span>
                                    </div>
                                </div>
                            ))}
                            {recommendations.length === 0 && (
                                <div className="text-sm text-slate-500 italic">No current recommendations.</div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {distribution && (
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" /> Workload Distribution
                        </h2>
                        <div className="h-64">
                            <Bar
                                options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }}
                                data={{
                                    labels: distribution.labels,
                                    datasets: [
                                        { label: 'Critical', data: distribution.critical, backgroundColor: '#ef4444' },
                                        { label: 'High', data: distribution.high, backgroundColor: '#f97316' },
                                        { label: 'Normal', data: distribution.normal, backgroundColor: '#3b82f6' },
                                    ]
                                }}
                            />
                        </div>
                    </section>
                )}

                {trends.length > 0 && (
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" /> Trends ({days} Days)
                        </h2>
                        <div className="h-64">
                            <Line
                                options={{ responsive: true, maintainAspectRatio: false }}
                                data={{
                                    labels: trends.map(t => t.date),
                                    datasets: [
                                        { label: 'Total Volume', data: trends.map(t => t.total), borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.3 },
                                        { label: 'Critical Volume', data: trends.map(t => t.critical), borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.3 },
                                    ]
                                }}
                            />
                        </div>
                    </section>
                )}
            </div>
            
            <section className="mb-8">
                <div className="bg-rose-50 rounded-xl p-6 border border-rose-100 flex items-center justify-between shadow-sm">
                    <div>
                        <h2 className="text-lg font-bold text-rose-900 mb-1 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Critical Workload</h2>
                        <p className="text-rose-700 text-sm">Review workloads that have breached SLA or have critical impact on patient flow.</p>
                    </div>
                    <button className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
                        Review Critical Items
                    </button>
                </div>
            </section>
        
            {/* BENCHMARKING CTA */}
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-4 flex flex-col justify-center items-center text-center mt-4 mb-4">
                <h3 className="font-bold text-teal-900 mb-2">Facility Benchmarking</h3>
                <p className="text-sm text-teal-700 mb-4">Compare operational performance against standards.</p>
                <Link to="/benchmarking" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 w-full transition-colors shadow-sm">View Benchmarks</Link>
            </div>

</div>
    );
};

export default WorkloadPrioritization;
