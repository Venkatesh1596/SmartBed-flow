import { useState, useEffect } from 'react';
import {
    fetchControlTowerSummary,
    fetchControlTowerPerformance,
    fetchControlTowerWards,
    fetchControlTowerTrends,
    fetchControlTowerAttention,
    fetchControlTowerPriorities,
    fetchControlTowerQueue,
    fetchControlTowerActivity
} from '../api/dashboardApi';
import type {
    ControlTowerSummary,
    ControlTowerAttention,
    ControlTowerPriority,
    ControlTowerQueueItem
} from '../api/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { MonitorPlay, Activity, AlertCircle, Clock, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

import 'chart.js/auto';

export default function ControlTower() {
    const [summary, setSummary] = useState<ControlTowerSummary | null>(null);
    
    
    
    const [attention, setAttention] = useState<ControlTowerAttention[]>([]);
    const [priorities, setPriorities] = useState<ControlTowerPriority[]>([]);
    const [queue, setQueue] = useState<ControlTowerQueueItem[]>([]);
    
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [
                    sumData, _perfData, _wardData, _trendData, 
                    attData, prioData, queueData, _actData
                ] = await Promise.all([
                    fetchControlTowerSummary(),
                    fetchControlTowerPerformance(),
                    fetchControlTowerWards(),
                    fetchControlTowerTrends(),
                    fetchControlTowerAttention(),
                    fetchControlTowerPriorities(),
                    fetchControlTowerQueue(),
                    fetchControlTowerActivity()
                ]);

                setSummary(sumData);
                
                
                
                setAttention(attData || []);
                setPriorities(prioData || []);
                setQueue(queueData || []);
                
            } catch (err: any) {
                console.error("Control Tower Load Error:", err);
                setError(err.message || 'Failed to load control tower data');
            } finally {
                setLoading(false);
            }
        };
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <LoadingSkeleton rows={1} className="h-64 lg:col-span-2" />
                    <LoadingSkeleton rows={1} className="h-64 lg:col-span-1" />
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return <EmptyState title="Error Loading Control Tower" description={error || "Summary data not available."} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <MonitorPlay className="w-6 h-6 text-primary-600" />
                        Live Control Tower
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time operational orchestration</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                    </span>
                    <span className="text-sm font-semibold text-success-600">LIVE SYNC</span>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-slate-900 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-slate-800 rounded">
                                <Activity className="w-5 h-5 text-primary-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{summary.active_workflows}</h3>
                        <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Active Workflows</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-info-100 rounded text-info-600">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.pending_tasks}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Pending Tasks</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-danger-100 rounded text-danger-600">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.blocked_tasks}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Blocked Tasks</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-warning-100 rounded text-warning-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.critical_alerts}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Critical Alerts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Workflows Queue */}
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-500" />
                            Active Workflow Queue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {queue.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {queue.map((item, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{item.workflow_type}</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <Users className="w-3 h-3" /> {item.assignee || 'Unassigned'} • Bed {item.bed_id}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <StatusBadge status={item.status} />
                                            {item.sla_breach && (
                                                <span className="text-xs font-bold text-danger-600 mt-1 uppercase">SLA Breach</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">No active workflows in the queue.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Priority / Attention Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-none">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-danger-500" />
                                Requires Attention
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                            {attention.length > 0 ? attention.map((att, i) => (
                                <div key={i} className="flex flex-col p-3 bg-danger-50 text-danger-900 rounded-lg border border-danger-100">
                                    <div className="flex justify-between items-center mb-1 text-sm font-bold">
                                        <span>{att.type}</span>
                                        <span>Bed {att.bed_id}</span>
                                    </div>
                                    <span className="text-xs text-danger-700 leading-snug">{att.reason}</span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">No immediate attention required.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-none">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                Operational Priorities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                            {priorities.length > 0 ? priorities.map((pri, i) => (
                                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0">
                                    <span className="font-medium text-slate-700">{pri.action}</span>
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">{pri.impact}</span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">No specific priorities defined.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
        </div>
    );
}
