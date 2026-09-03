import { useState, useEffect } from 'react';
import {
    fetchCapacitySummary,
    fetchWardCapacity,
    fetchAvailableSoonBeds,
    fetchCapacityTrends,
    fetchCapacityPriorities,
    fetchCapacityPressure
} from '../api/dashboardApi';
import type {
    CapacityPlanningSummary,
    WardCapacityItem,
    AvailableSoonBed,
    CapacityTrend,
    CapacityPressure
} from '../api/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { LineChart, Activity, Clock, AlertTriangle, Building2, UserPlus, FileOutput } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function CapacityPlanning() {
    const [summary, setSummary] = useState<CapacityPlanningSummary | null>(null);
    const [wards, setWards] = useState<WardCapacityItem[]>([]);
    const [availableSoon, setAvailableSoon] = useState<AvailableSoonBed[]>([]);
    const [trends, setTrends] = useState<CapacityTrend[]>([]);
    const [pressure, setPressure] = useState<CapacityPressure[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [
                    sumData, wardData, availData, trendData, _prioData, pressData
                ] = await Promise.all([
                    fetchCapacitySummary(),
                    fetchWardCapacity(),
                    fetchAvailableSoonBeds(),
                    fetchCapacityTrends(),
                    fetchCapacityPriorities(),
                    fetchCapacityPressure()
                ]);

                setSummary(sumData);
                setWards(wardData || []);
                setAvailableSoon(availData || []);
                setTrends(trendData || []);
                setPressure(pressData ? [pressData] : []);
            } catch (err: any) {
                console.error("Capacity Planning Load Error:", err);
                setError(err.message || 'Failed to load capacity data');
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
        return <EmptyState title="Error Loading Capacity Planning" description={error || "Summary data not available."} />;
    }

    // Chart Data
    const chartData = {
        labels: trends.map(t => t.date),
        datasets: [
            { label: 'Occupied', data: trends.map(t => t.occupied), borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.3 },
            { label: 'Available', data: trends.map(t => t.available), borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.3 }
        ]
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <LineChart className="w-6 h-6 text-primary-600" />
                        Capacity Planning
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Predictive supply vs demand analysis</p>
                </div>
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
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">
                            {summary.utilization_percent.toFixed(1)}%
                        </h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Hospital Occupancy</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-info-100 rounded text-info-600">
                                <UserPlus className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.pressure_score}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Pressure Score</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-warning-100 rounded text-warning-600">
                                <FileOutput className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{summary.cleaning}</h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Beds Cleaning</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded ${summary.available < 5 ? 'bg-danger-100 text-danger-600' : 'bg-success-100 text-success-600'}`}>
                                <Building2 className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className={`text-3xl font-bold mb-1 ${summary.available < 5 ? 'text-danger-600' : 'text-success-600'}`}>
                            {summary.available > 5 ? '+' : ''}{summary.available}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Available Beds</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-500" />
                            Available vs Occupied Projection (7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {trends.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <Line
                                    options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false, 
                                        interaction: { mode: 'index', intersect: false },
                                    }}
                                    data={chartData}
                                />
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">No trend data available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Side Panel */}
                <div className="space-y-6">
                    
                    {/* Pressure Panel */}
                    <Card>
                        <CardHeader className="pb-3 border-none">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-warning-500" />
                                Department Pressure
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                            {pressure.length > 0 ? pressure.map((p, i) => (
                                <div key={i} className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-semibold text-slate-800">{p.trend}</span>
                                        <StatusBadge status={p.score > 80 ? "HIGH" : "NORMAL"} />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">No pressure points reported.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Available Soon Panel */}
                    <Card>
                        <CardHeader className="pb-3 border-none">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="w-4 h-4 text-success-500" />
                                Available Soon
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                            {availableSoon.length > 0 ? availableSoon.map((b, i) => (
                                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">Bed {b.bed_id}</span>
                                        <span className="text-xs text-slate-500">{b.ward}</span>
                                    </div>
                                    <span className="text-success-600 font-bold">~{b.estimated_available_mins}m</span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">No beds projected to be available soon.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Wards List */}
            <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary-500" />
                        Ward Capacity Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                        {wards.map((ward, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-800">{ward.ward_name}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${ward.utilization > 90 ? 'bg-danger-100 text-danger-700' : 'bg-primary-100 text-primary-700'}`}>
                                        {ward.utilization}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                                    <div 
                                        className={`h-1.5 rounded-full ${ward.utilization > 90 ? 'bg-danger-500' : 'bg-primary-500'}`} 
                                        style={{ width: `${Math.min(ward.utilization, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>{ward.occupied} / {ward.total} Occupied</span>
                                    <span className="font-medium text-success-600">{ward.available} Free</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
        </div>
    );
}
