import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    CapacityPriority,
    CapacityPressure
} from '../api/dashboardApi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    Title,
    Tooltip,
    Legend
);

export default function CapacityPlanning() {
    const [summary, setSummary] = useState<CapacityPlanningSummary | null>(null);
    const [wards, setWards] = useState<WardCapacityItem[]>([]);
    const [availableSoon, setAvailableSoon] = useState<AvailableSoonBed[]>([]);
    const [trends, setTrends] = useState<CapacityTrend[]>([]);
    const [priorities, setPriorities] = useState<CapacityPriority[]>([]);
    const [pressure, setPressure] = useState<CapacityPressure | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trendDays, setTrendDays] = useState(7);
    
    const refreshIntervalRef = useRef<number | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - trendDays);
            
            const [
                summaryRes,
                wardsRes,
                availableRes,
                trendsRes,
                prioritiesRes,
                pressureRes
            ] = await Promise.allSettled([
                fetchCapacitySummary(),
                fetchWardCapacity(),
                fetchAvailableSoonBeds(),
                fetchCapacityTrends(startDate.toISOString(), endDate.toISOString()),
                fetchCapacityPriorities(),
                fetchCapacityPressure()
            ]);

            if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
            if (wardsRes.status === 'fulfilled') setWards(wardsRes.value);
            if (availableRes.status === 'fulfilled') setAvailableSoon(availableRes.value);
            if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value);
            if (prioritiesRes.status === 'fulfilled') setPriorities(prioritiesRes.value);
            if (pressureRes.status === 'fulfilled') setPressure(pressureRes.value);
            
        } catch (err: any) {
            setError(err.message || 'Error fetching capacity data');
        } finally {
            setLoading(false);
        }
    }, [trendDays]);

    useEffect(() => {
        loadData();
        
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
        }
        
        refreshIntervalRef.current = setInterval(() => {
            loadData();
        }, 30000); // 30 seconds
        
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [loadData]);

    const getPressureColor = (score: number) => {
        if (score >= 80) return 'text-red-600 bg-red-100';
        if (score >= 60) return 'text-orange-600 bg-orange-100';
        if (score >= 40) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    const getPriorityStyle = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'bg-red-50 border-red-200 text-red-800';
            case 'HIGH': return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'WARNING': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'INFO': return 'bg-blue-50 border-blue-200 text-blue-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 flex justify-between items-center rounded shadow-sm">
                <div>
                    <p className="text-sm text-blue-700 font-bold">Real-Time Operations</p>
                    <p className="text-xs text-blue-600">Monitor all hospital metrics in real-time</p>
                </div>
                <Link to="/control-tower" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                    Go to Control Tower
                </Link>
            </div>
<h1 className="text-3xl font-bold text-gray-900">Capacity Planning</h1>
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

                <button 
                    onClick={loadData}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:opacity-50"
                >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-sm text-gray-500 font-medium">Total Beds</div>
                    <div className="text-2xl font-bold text-gray-900">{summary?.total_beds || '-'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-sm text-gray-500 font-medium">Occupied</div>
                    <div className="text-2xl font-bold text-gray-900">{summary?.occupied || '-'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-sm text-gray-500 font-medium">Available</div>
                    <div className="text-2xl font-bold text-green-600">{summary?.available || '-'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-sm text-gray-500 font-medium">Cleaning</div>
                    <div className="text-2xl font-bold text-orange-500">{summary?.cleaning || '-'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-sm text-gray-500 font-medium">Utilization</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {summary ? `${summary.utilization_percent.toFixed(1)}%` : '-'}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-sm text-gray-500 font-medium">Pressure</div>
                    <div className={`text-2xl font-bold ${pressure ? getPressureColor(pressure.score).split(' ')[0] : 'text-gray-900'}`}>
                        {pressure?.score || '-'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Pressure Panel */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Capacity Pressure</h2>
                    {pressure ? (
                        <div className="text-center">
                            <div className={`text-6xl font-bold py-8 rounded-full w-48 h-48 mx-auto flex items-center justify-center mb-4 ${getPressureColor(pressure.score)}`}>
                                {pressure.score}
                            </div>
                            <div className="text-lg font-medium text-gray-700 mb-4">
                                Trend: <span className="capitalize">{pressure.trend}</span>
                            </div>
                            <div className="text-sm text-gray-600 text-left">
                                <strong className="block mb-2">Key Factors:</strong>
                                <ul className="list-disc pl-5">
                                    {pressure.factors.map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-10">No pressure data</div>
                    )}
                    <div className="mt-6 border-t pt-4 space-y-3">
                        <p className="text-sm text-gray-500 text-center">View active blockers and allocation candidates.</p>
                        <Link to="/orchestration" className="block text-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full border border-indigo-200">
                            Workflow Orchestration &rarr;
                        </Link>
                        <Link to="/predictive-operations" className="block text-center bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full border border-purple-200">
                            Predictive Operations &rarr;
                        </Link>
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Capacity Trends</h2>
                        <select 
                            value={trendDays} 
                            onChange={(e) => setTrendDays(Number(e.target.value))}
                            className="border-gray-300 rounded-md shadow-sm text-sm"
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={14}>Last 14 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                        </select>
                    </div>
                    <div className="h-64">
                        {trends.length > 0 ? (
                            <Line 
                                data={{
                                    labels: trends.map(t => t.date),
                                    datasets: [
                                        {
                                            label: 'Utilization %',
                                            data: trends.map(t => t.utilization),
                                            borderColor: 'rgb(59, 130, 246)',
                                            tension: 0.1
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
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No trend data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Ward Grid */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Ward Capacity</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avail</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Util %</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {wards.map((w, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{w.ward_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{w.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{w.occupied}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{w.available}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <span className="mr-2">{w.utilization.toFixed(1)}%</span>
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${w.utilization > 90 ? 'bg-red-500' : w.utilization > 75 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                                        style={{width: `${Math.min(w.utilization, 100)}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {wards.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No ward data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Available Soon & Priorities */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Available Soon</h2>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {availableSoon.map((b, idx) => (
                                <li key={idx} className="px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-gray-900 mr-2">Bed {b.bed_id}</span>
                                        <span className="text-sm text-gray-500">({b.ward})</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm capitalize px-2 py-1 rounded bg-blue-100 text-blue-800">{b.status}</span>
                                        <span className="text-sm font-medium text-gray-700">~{b.estimated_available_mins} mins</span>
                                    </div>
                                </li>
                            ))}
                            {availableSoon.length === 0 && (
                                <li className="px-6 py-4 text-center text-sm text-gray-500">No beds available soon</li>
                            )}
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Operational Priorities</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {priorities.map(p => (
                                <div key={p.id} className={`p-3 rounded border ${getPriorityStyle(p.level)}`}>
                                    <div className="flex items-center">
                                        <span className="font-bold text-sm mr-2">{p.level}:</span>
                                        <span className="text-sm">{p.message}</span>
                                    </div>
                                </div>
                            ))}
                            {priorities.length === 0 && (
                                <div className="text-center text-sm text-gray-500 py-4">No active priorities</div>
                            )}
                        </div>
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
}
