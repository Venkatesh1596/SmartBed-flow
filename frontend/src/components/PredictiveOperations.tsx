import { useState, useEffect } from 'react';
import { 
    ActivitySquare, AlertCircle, AlertTriangle, TrendingUp, Zap, Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
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
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function PredictiveOperations() {
    const [summary, setSummary] = useState<PredictiveSummary | null>(null);
    const [trends, setTrends] = useState<PredictiveTrendData | null>(null);
    const [wards, setWards] = useState<WardEarlyWarning[]>([]);
    const [warnings, setWarnings] = useState<PredictiveWarning[]>([]);
    const [recommendations, setRecommendations] = useState<PredictiveRecommendation[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [sum, trnd, wrds, warn, rec] = await Promise.all([
                    fetchPredictiveSummary(),
                    fetchPredictiveTrends(7).catch(() => null),
                    fetchPredictiveWards().catch(() => []),
                    fetchPredictiveWarnings().catch(() => []),
                    fetchPredictiveRecommendations().catch(() => [])
                ]);

                setSummary(sum);
                setTrends(trnd);
                setWards(wrds || []);
                setWarnings(warn || []);
                setRecommendations(rec || []);
            } catch (err: any) {
                console.error("Failed to load predictive data:", err);
                setError(err.message || 'Failed to load predictive data');
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                    <LoadingSkeleton rows={1} className="h-32" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <LoadingSkeleton rows={1} className="h-80 lg:col-span-2" />
                    <LoadingSkeleton rows={1} className="h-80 lg:col-span-1" />
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return <EmptyState title="Error Loading Predictions" description={error || "Summary data not available."} />;
    }

    const chartData = trends ? {
        labels: trends.labels,
        datasets: [
            { label: 'Facility Pressure', data: trends.facility_pressure, borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.3 },
            { label: 'Predicted Occupancy (%)', data: trends.occupancy_prediction, borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.3 }
        ]
    } : null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <ActivitySquare className="w-6 h-6 text-primary-600" />
                        Predictive Intelligence
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">AI-driven early warnings and forecasts</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                    </span>
                    <span className="text-sm font-semibold text-primary-600">MODELS ACTIVE</span>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-slate-900 text-white border-0">
                    <CardContent className="p-4">
                        <h3 className="text-2xl font-bold mb-1">{summary.early_warning_score}</h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Early Warning</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <h3 className={`text-2xl font-bold mb-1 ${summary.capacity_pressure > 80 ? 'text-danger-600' : 'text-slate-900'}`}>{summary.capacity_pressure}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Capacity Pres</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <h3 className={`text-2xl font-bold mb-1 ${summary.sla_pressure > 80 ? 'text-warning-600' : 'text-slate-900'}`}>{summary.sla_pressure}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">SLA Pres</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <h3 className={`text-2xl font-bold mb-1 ${summary.cleaning_pressure > 80 ? 'text-info-600' : 'text-slate-900'}`}>{summary.cleaning_pressure}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cleaning Pres</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <h3 className={`text-2xl font-bold mb-1 ${summary.workflow_pressure > 80 ? 'text-danger-600' : 'text-slate-900'}`}>{summary.workflow_pressure}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Workflow Pres</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 7-Day Forecast */}
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            7-Day Pressure Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {chartData ? (
                            <div className="h-[250px] w-full">
                                <Line 
                                    options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false, 
                                        interaction: { mode: 'index', intersect: false } 
                                    }}
                                    data={chartData}
                                />
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">Forecast models are currently building data.</div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-warning-500" />
                            AI Prescriptions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recommendations.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recommendations.map((rec, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-800 text-sm">{rec.action}</span>
                                            <StatusBadge status={rec.priority} />
                                        </div>
                                        <p className="text-xs text-slate-500">{rec.impact}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">No critical actions recommended at this time.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid: Warnings and Wards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Predictive Warnings */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-danger-500" />
                            Predicted Bottlenecks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {warnings.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {warnings.map((warn, i) => (
                                    <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{warn.type}</span>
                                            <span className="text-xs text-slate-600 mt-1">{warn.message}</span>
                                        </div>
                                        <div className="flex flex-col items-end mt-2 md:mt-0">
                                            <span className="text-xs font-bold text-slate-500 mb-1">{warn.timeframe}</span>
                                            <StatusBadge status={warn.severity} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">No bottlenecks predicted in the next 24 hours.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Ward Early Warnings */}
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary-500" />
                            Ward Early Warnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {wards.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {wards.map((ward, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{ward.ward_name}</span>
                                            <span className="text-xs text-slate-500 mt-1">
                                                Predicted Occupancy: {ward.predicted_occupancy}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {ward.critical_blockers > 0 && (
                                                <span className="text-xs font-bold text-danger-600 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> {ward.critical_blockers} Blk
                                                </span>
                                            )}
                                            <StatusBadge status={ward.pressure_level} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">All wards operating within normal parameters.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
        </div>
    );
}
