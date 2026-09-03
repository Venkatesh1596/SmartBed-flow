import { useEffect, useState } from 'react';
import { RefreshCw, Activity, ShieldAlert, CheckCircle2, Clock, Server, AlertTriangle, Zap, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { 
    fetchOrchestrationSummary, 
    fetchAllocationCandidates, 
    fetchWorkflowBlockers, 
    fetchWardPressure, 
    fetchOperationalQueue, 
    fetchOrchestrationRecommendations,
    type OrchestrationSummary,
    type WorkflowBlocker,
    type WardPressure,
    type OperationalQueueItem,
    type OrchestrationRecommendation
} from '../api/dashboardApi';

export default function WorkflowOrchestration() {
    const [summary, setSummary] = useState<OrchestrationSummary | null>(null);
    const [blockers, setBlockers] = useState<WorkflowBlocker[]>([]);
    const [pressures, setPressures] = useState<WardPressure[]>([]);
    const [queue, setQueue] = useState<OperationalQueueItem[]>([]);
    const [recommendations, setRecommendations] = useState<OrchestrationRecommendation[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const [sum, _cand, block, press, que, rec] = await Promise.all([
                fetchOrchestrationSummary(),
                fetchAllocationCandidates().catch(() => []),
                fetchWorkflowBlockers().catch(() => []),
                fetchWardPressure().catch(() => []),
                fetchOperationalQueue().catch(() => []),
                fetchOrchestrationRecommendations().catch(() => [])
            ]);

            setSummary(sum);
            setBlockers(block || []);
            setPressures(press || []);
            setQueue(que || []);
            setRecommendations(rec || []);
        } catch (err: any) {
            console.error("Failed to load orchestration data:", err);
            setError(err.message || 'Failed to load orchestration data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton rows={1} className="h-10 w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LoadingSkeleton rows={1} className="h-96" />
                    <LoadingSkeleton rows={1} className="h-96" />
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return <EmptyState title="Error Loading Orchestration" description={error || "Summary data not available."} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Server className="w-6 h-6 text-primary-600" />
                        Workflow Orchestration
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Cross-department operational coordination</p>
                </div>
                <button 
                    onClick={() => loadData(true)} 
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary-100 rounded text-primary-600">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{(summary.occupied + summary.cleaning)}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Active Workflows</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-info-100 rounded text-info-600">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.available_now}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Completed Today</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-danger-100 rounded text-danger-600">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.blocked}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">SLA Breaches</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-warning-100 rounded text-warning-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.available_soon}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Pending Assignments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations & Blockers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Orchestration Recommendations */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-warning-500" />
                            AI Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recommendations.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recommendations.map((rec, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-800">{rec.action}</span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-warning-100 text-warning-700">
                                                {rec.confidence}/100 Impact
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{rec.expected_impact}</p>
                                        <div className="flex gap-2">
                                            {[rec.target].map((w: any, wi: number) => (
                                                <span key={wi} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                                    {w}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">No new recommendations available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Workflow Blockers */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-danger-500" />
                            Workflow Blockers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {blockers.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {blockers.map((block, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{block.id} - {block.type}</span>
                                            <span className="text-xs text-danger-600 font-medium mt-1">
                                                {block.description}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-slate-500 mb-1">{block.duration_mins}m</span>
                                            <StatusBadge status={'critical'} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                                <CheckCircle2 className="w-8 h-8 text-success-300 mb-2" />
                                No active blockers
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Queue & Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Operational Queue */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-info-500" />
                            Task Queue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {queue.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {queue.map((task, i) => (
                                    <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{task.task}</span>
                                            <span className="text-xs text-slate-500 mt-1">Location: {task.location}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                                            <span className="text-xs flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                <Users className="w-3 h-3" /> {task.assigned_to || 'Unassigned'}
                                            </span>
                                            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Assign</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">Task queue is empty.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Ward Pressures */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-warning-500" />
                            Department Pressures
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {pressures.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {pressures.map((press, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{press.ward_name}</span>
                                            <span className="text-xs text-slate-500 mt-1">
                                                {press.pending_admissions} Pending Adm | {press.pending_discharges} Pending DC
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${press.pressure_index > 80 ? 'bg-danger-100 text-danger-700' : 'bg-warning-100 text-warning-700'}`}>
                                                Index: {press.pressure_index}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">No high pressure departments detected.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
        </div>
    );
}
