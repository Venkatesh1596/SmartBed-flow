import { useEffect, useState } from 'react';
import { Target, TrendingUp, Clock, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { fetchPhase24Validation } from '../api/dashboardApi';
import type { Phase24ValidationResult } from '../api/dashboardApi';

export default function Phase24Evaluation() {
    const [data, setData] = useState<Phase24ValidationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchPhase24Validation();
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Failed to load evaluation data');
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
                <LoadingSkeleton rows={1} className="h-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LoadingSkeleton rows={1} className="h-64" />
                    <LoadingSkeleton rows={1} className="h-64" />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return <EmptyState title="Evaluation Data Unavailable" description={error || "Could not load phase 24 validation metrics."} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary-600" />
                        System Evaluation Metrics
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time performance and validation outcomes</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={data.conflict_bed_state_count > 0 ? 'WARNING' : 'ON_TRACK'} />
                </div>
            </div>

            {/* KPI Results */}
            <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Operational Impact
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-slate-500 mb-1">Total Simulated Journeys</span>
                            <span className="text-3xl font-bold text-slate-700">{data.total_journeys}</span>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-center bg-success-50">
                            <span className="text-sm font-semibold text-success-700 mb-1">Avg Improvement</span>
                            <span className="text-3xl font-bold text-success-600 flex items-center gap-1">
                                <TrendingUp className="w-6 h-6 text-success-500" /> {data.average_improvement_percentage ? `${data.average_improvement_percentage.toFixed(1)}%` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                        <AlertTriangle className={`w-8 h-8 ${data.missing_readiness_count > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                        <h3 className="font-bold text-slate-700">Missing Readiness</h3>
                        <p className="text-2xl font-black text-slate-900">{data.missing_readiness_count}</p>
                        <p className="text-xs text-slate-500">Unresolved readiness alerts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                        <Clock className={`w-8 h-8 ${data.stale_cleaning_count > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                        <h3 className="font-bold text-slate-700">Stale Cleaning</h3>
                        <p className="text-2xl font-black text-slate-900">{data.stale_cleaning_count}</p>
                        <p className="text-xs text-slate-500">Delayed cleaning tasks</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
                        <Target className={`w-8 h-8 ${data.conflict_bed_state_count > 0 ? 'text-rose-500' : 'text-slate-300'}`} />
                        <h3 className="font-bold text-slate-700">State Conflicts</h3>
                        <p className="text-2xl font-black text-slate-900">{data.conflict_bed_state_count}</p>
                        <p className="text-xs text-slate-500">Data mismatch errors</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
