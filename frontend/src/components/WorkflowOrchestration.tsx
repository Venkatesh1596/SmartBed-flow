import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Activity, ShieldAlert, CheckCircle2, Clock, Server, AlertTriangle, Zap } from 'lucide-react';
import { 
    fetchOrchestrationSummary, 
    fetchAllocationCandidates, 
    fetchWorkflowBlockers, 
    fetchWardPressure, 
    fetchOperationalQueue, 
    fetchOrchestrationRecommendations,
    type OrchestrationSummary,
    type AllocationCandidate,
    type WorkflowBlocker,
    type WardPressure,
    type OperationalQueueItem,
    type OrchestrationRecommendation
} from '../api/dashboardApi';

const WorkflowOrchestration = () => {
    const [summary, setSummary] = useState<OrchestrationSummary | null>(null);
    const [candidates, setCandidates] = useState<AllocationCandidate[]>([]);
    const [blockers, setBlockers] = useState<WorkflowBlocker[]>([]);
    const [pressures, setPressures] = useState<WardPressure[]>([]);
    const [queue, setQueue] = useState<OperationalQueueItem[]>([]);
    const [recommendations, setRecommendations] = useState<OrchestrationRecommendation[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        setError(null);
        try {
            const results = await Promise.allSettled([
                fetchOrchestrationSummary(),
                fetchAllocationCandidates(),
                fetchWorkflowBlockers(),
                fetchWardPressure(),
                fetchOperationalQueue(),
                fetchOrchestrationRecommendations()
            ]);

            if (results[0].status === 'fulfilled') setSummary(results[0].value);
            if (results[1].status === 'fulfilled') setCandidates(results[1].value);
            if (results[2].status === 'fulfilled') setBlockers(results[2].value);
            if (results[3].status === 'fulfilled') setPressures(results[3].value);
            if (results[4].status === 'fulfilled') setQueue(results[4].value);
            if (results[5].status === 'fulfilled') setRecommendations(results[5].value);

            if (results[0].status === 'rejected') throw new Error('Failed to load summary');
        } catch (err) {
            setError('Unable to load workflow orchestration data.');
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
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500 font-medium animate-pulse flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading orchestration data...
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
                <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">{error || 'Data unavailable'}</h2>
                <button onClick={() => loadData(true)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors mt-4">
                    Retry
                </button>
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
<h1 className="text-3xl font-black tracking-tight text-slate-800">Workflow Orchestration</h1>
                    <p className="text-slate-500 font-medium tracking-wide text-sm mt-1 uppercase">Operational Allocation & Flow Control</p>
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
                    <Link to="/predictive-operations" className="text-sm font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded transition-colors">
                        Predictive Ops &rarr;
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

            {/* KPI Strip */}
            <section className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Beds</span>
                        <span className="text-2xl font-black text-slate-800">{summary.total_beds}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Available Now</span>
                        <span className="text-2xl font-black text-emerald-600">{summary.available_now}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Available Soon</span>
                        <span className="text-2xl font-black text-blue-600">{summary.available_soon}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Occupied</span>
                        <span className="text-2xl font-black text-slate-700">{summary.occupied}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cleaning</span>
                        <span className="text-2xl font-black text-purple-500">{summary.cleaning}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Blocked</span>
                        <span className="text-2xl font-black text-rose-600">{summary.blocked}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">High Pressure</span>
                        <span className="text-2xl font-black text-orange-600">{summary.high_pressure_wards}</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Allocation Candidates */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" /> Allocation Candidates
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-semibold">Patient</th>
                                    <th className="p-4 font-semibold">Priority</th>
                                    <th className="p-4 font-semibold">Required Level</th>
                                    <th className="p-4 font-semibold">Wait Time</th>
                                    <th className="p-4 font-semibold">Best Match</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {candidates.length > 0 ? candidates.map((cand) => (
                                    <tr key={cand.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-800">{cand.patient_name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${cand.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : cand.priority === 'URGENT' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {cand.priority}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{cand.required_level}</td>
                                        <td className="p-4 font-mono">{cand.wait_time_mins}m</td>
                                        <td className="p-4">
                                            <span className="font-semibold text-indigo-600">{cand.best_match_ward}</span>
                                            <span className="text-xs text-slate-400 ml-2">({cand.match_score}%)</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-slate-500">No pending candidates</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Workflow Blockers */}
                <div>
                    <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Server className="w-5 h-5 text-rose-500" /> Workflow Blockers
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
                        {blockers.length > 0 ? blockers.map(b => (
                            <div key={b.id} className={`p-3 rounded-lg border-l-4 ${b.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-500' : 'bg-orange-50 border-orange-400'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-800 text-sm">{b.type}</span>
                                    <span className="text-xs font-mono text-slate-500">{b.duration_mins}m</span>
                                </div>
                                <div className="text-sm text-slate-600 mb-1">{b.description}</div>
                                <div className="text-xs font-semibold text-slate-500">Ward: {b.ward}</div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No active blockers</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Ward Pressure */}
                <div>
                    <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" /> Ward Pressure
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-3 font-semibold">Ward</th>
                                    <th className="p-3 font-semibold">Occupancy</th>
                                    <th className="p-3 font-semibold">Pending</th>
                                    <th className="p-3 font-semibold">Pressure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {pressures.map(p => (
                                    <tr key={p.ward_id} className="hover:bg-slate-50">
                                        <td className="p-3 font-medium text-slate-800">{p.ward_name}</td>
                                        <td className="p-3 text-slate-600">{p.current_occupancy} / {p.capacity}</td>
                                        <td className="p-3 text-slate-600">
                                            <span className="text-rose-500 mr-2">+{p.pending_admissions}</span>
                                            <span className="text-emerald-500">-{p.pending_discharges}</span>
                                        </td>
                                        <td className="p-3">
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${p.pressure_index > 80 ? 'bg-rose-500' : p.pressure_index > 60 ? 'bg-orange-400' : 'bg-emerald-500'}`} 
                                                    style={{ width: `${Math.min(p.pressure_index, 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Operational Queue */}
                <div>
                    <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" /> Operational Queue
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
                        {queue.length > 0 ? queue.map(q => (
                            <div key={q.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <div className="font-semibold text-slate-800 text-sm">{q.task}</div>
                                    <div className="text-xs text-slate-500 mt-1">Location: {q.location} • Assigned: {q.assigned_to}</div>
                                </div>
                                <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${q.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {q.priority}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${q.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                                        {q.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">Queue empty</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <section>
                <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> Recommendations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.length > 0 ? recommendations.map(rec => (
                        <div key={rec.id} className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 hover:border-amber-300 transition-colors">
                            <div className="font-bold text-slate-800 mb-2">{rec.action}</div>
                            <div className="text-sm text-slate-600 mb-3">Target: <span className="font-semibold">{rec.target}</span></div>
                            <div className="text-sm bg-slate-50 p-2 rounded border border-slate-100 mb-3">
                                {rec.expected_impact}
                            </div>
                            <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Confidence: {rec.confidence}%
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
                            No active recommendations
                        </div>
                    )}
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

export default WorkflowOrchestration;
