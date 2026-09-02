import os

content = r"""import { useState, useEffect } from 'react';
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
    ControlTowerPerformance,
    ControlTowerWard,
    ControlTowerTrend,
    ControlTowerAttention,
    ControlTowerPriority,
    ControlTowerQueueItem,
    ControlTowerActivity
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

export default function ControlTower() {
    const [summary, setSummary] = useState<ControlTowerSummary | null>(null);
    const [performance, setPerformance] = useState<ControlTowerPerformance[]>([]);
    const [wards, setWards] = useState<ControlTowerWard[]>([]);
    const [trends, setTrends] = useState<ControlTowerTrend[]>([]);
    const [attention, setAttention] = useState<ControlTowerAttention[]>([]);
    const [priorities, setPriorities] = useState<ControlTowerPriority[]>([]);
    const [queue, setQueue] = useState<ControlTowerQueueItem[]>([]);
    const [activity, setActivity] = useState<ControlTowerActivity[]>([]);
    const [trendDays, setTrendDays] = useState(7);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const loadData = async () => {
        try {
            setError(null);
            
            const results = await Promise.allSettled([
                fetchControlTowerSummary(),
                fetchControlTowerPerformance(),
                fetchControlTowerWards(),
                fetchControlTowerTrends(trendDays),
                fetchControlTowerAttention(),
                fetchControlTowerPriorities(),
                fetchControlTowerQueue(),
                fetchControlTowerActivity()
            ]);

            if (results[0].status === 'fulfilled') setSummary(results[0].value);
            if (results[1].status === 'fulfilled') setPerformance(results[1].value);
            if (results[2].status === 'fulfilled') setWards(results[2].value);
            if (results[3].status === 'fulfilled') setTrends(results[3].value);
            if (results[4].status === 'fulfilled') setAttention(results[4].value);
            if (results[5].status === 'fulfilled') setPriorities(results[5].value);
            if (results[6].status === 'fulfilled') setQueue(results[6].value);
            if (results[7].status === 'fulfilled') setActivity(results[7].value);

            setLastUpdated(new Date());
        } catch (err) {
            setError('Failed to load Control Tower data.');
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            loadData();
        }, 30000); // 30 sec auto-refresh
        return () => clearInterval(interval);
    }, [trendDays]);

    const chartData = {
        labels: trends.map(t => t.date),
        datasets: [
            {
                label: 'Occupancy Rate (%)',
                data: trends.map(t => t.occupancy_rate),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Admissions',
                data: trends.map(t => t.admissions),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y1',
            },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Real-Time Operations Control Tower</h1>
                    <p className="text-sm text-gray-500 mt-1">Last Updated: {lastUpdated.toLocaleTimeString()}</p>
                </div>
                <button
                    onClick={loadData}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Refresh Now
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Hospital Status</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary?.hospital_status || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Occupancy</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary?.current_occupancy} / {summary?.total_capacity}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
                    <p className="text-2xl font-bold text-red-600">{summary?.active_alerts || 0}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Bottlenecks Detected</h3>
                    <p className="text-2xl font-bold text-orange-600">{summary?.bottlenecks_detected || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Operational Trends</h2>
                        <select
                            value={trendDays}
                            onChange={(e) => setTrendDays(Number(e.target.value))}
                            className="border rounded p-1"
                        >
                            <option value={7}>7 Days</option>
                            <option value={14}>14 Days</option>
                            <option value={30}>30 Days</option>
                            <option value={90}>90 Days</option>
                        </select>
                    </div>
                    <div className="h-64">
                        {trends.length > 0 ? (
                            <Line 
                                data={chartData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { type: 'linear', display: true, position: 'left' },
                                        y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
                                    }
                                }} 
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No trend data available</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Strip</h2>
                    <div className="space-y-4">
                        {performance.map((perf, i) => (
                            <div key={i} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-medium text-gray-800">{perf.kpi}</p>
                                    <p className="text-sm text-gray-500">Target: {perf.target}</p>
                                </div>
                                <div className={`font-bold ${perf.status === 'Off Track' ? 'text-red-600' : 'text-green-600'}`}>
                                    {perf.value}
                                </div>
                            </div>
                        ))}
                        {performance.length === 0 && <p className="text-gray-500">No performance data.</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded shadow p-4 overflow-x-auto">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Ward Pressure Grid / Live Bed Board</h2>
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ward</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Turnover (avg)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {wards.map((w, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2 text-sm text-gray-900">{w.ward_name}</td>
                                    <td className="px-4 py-2 text-sm">
                                        <div className="flex items-center">
                                            <span className="mr-2">{w.occupancy_rate}%</span>
                                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                                <div className={`h-2.5 rounded-full ${w.occupancy_rate > 90 ? 'bg-red-600' : w.occupancy_rate > 75 ? 'bg-yellow-400' : 'bg-green-600'}`} style={{width: `${Math.min(w.occupancy_rate, 100)}%`}}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-500">{w.avg_turnover_time} mins</td>
                                </tr>
                            ))}
                            {wards.length === 0 && (
                                <tr><td colSpan={3} className="px-4 py-2 text-sm text-gray-500 text-center">No ward data.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Operational Queue</h2>
                    <div className="space-y-3">
                        {queue.map((q, i) => (
                            <div key={i} className="p-3 border rounded-md flex justify-between items-center">
                                <div>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 mr-2">{q.type}</span>
                                    <span className="font-medium">Patient {q.patient_id}</span>
                                    <span className="text-sm text-gray-500 ml-2">Ward: {q.ward}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{q.status}</p>
                                    <p className="text-xs text-red-500">Wait: {q.wait_time_mins}m</p>
                                </div>
                            </div>
                        ))}
                        {queue.length === 0 && <p className="text-gray-500">Queue is empty.</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Operational Attention</h2>
                    <ul className="space-y-3">
                        {attention.map((a, i) => (
                            <li key={i} className="flex flex-col border-l-4 border-red-500 pl-3">
                                <span className="font-bold text-gray-800">{a.area}</span>
                                <span className="text-sm text-red-600">{a.issue}</span>
                                <span className="text-xs text-gray-500">Impact: {a.impact}</span>
                            </li>
                        ))}
                        {attention.length === 0 && <p className="text-gray-500">No urgent attention needed.</p>}
                    </ul>
                </div>
                
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Change Summary & Priorities</h2>
                    <ul className="space-y-3">
                        {priorities.map((p, i) => (
                            <li key={i} className="border-b pb-2 last:border-0">
                                <div className="flex justify-between">
                                    <span className="font-medium">{p.action}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${p.priority === 'High' ? 'bg-red-100 text-red-800' : p.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{p.priority}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Status: {p.status}</p>
                            </li>
                        ))}
                        {priorities.length === 0 && <p className="text-gray-500">No current priorities.</p>}
                    </ul>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {activity.map((act, i) => (
                            <div key={i} className="flex space-x-3 text-sm">
                                <span className="text-gray-400 whitespace-nowrap">{new Date(act.timestamp).toLocaleTimeString()}</span>
                                <div>
                                    <span className="font-medium">{act.action}: </span>
                                    <span className="text-gray-600">{act.details}</span>
                                </div>
                            </div>
                        ))}
                        {activity.length === 0 && <p className="text-gray-500">No recent activity.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
"""

with open('src/components/ControlTower.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
