import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    fetchCommandCenterSummary,
    fetchWardOperationalSummary,
    fetchBedPriority,
    fetchDischargeQueue,
    fetchCommandCenterPriorities,
    fetchSLASummary,
    fetchSLAWorkflows,
    type CommandCenterSummary,
    type WardOperationalSummary,
    type BedPriorityItem,
    type DischargeQueueItem,
    type CommandCenterPriority,
    type SLASummary,
    type SLAWorkflow,
    fetchNotifications,
    type AppNotification
} from '../api/dashboardApi';
import SLAMonitor from './SLAMonitor';
import RecentActivityWidget from './RecentActivityWidget';
import { Bell } from 'lucide-react';

export const CommandCenter: React.FC = () => {
    const [summary, setSummary] = useState<CommandCenterSummary | null>(null);
    const [wards, setWards] = useState<WardOperationalSummary[]>([]);
    const [bedPriorities, setBedPriorities] = useState<BedPriorityItem[]>([]);
    const [dischargeQueue, setDischargeQueue] = useState<DischargeQueueItem[]>([]);
    const [priorities, setPriorities] = useState<CommandCenterPriority[]>([]);
    const [slaSummary, setSlaSummary] = useState<SLASummary | null>(null);
    const [slaWorkflows, setSlaWorkflows] = useState<SLAWorkflow[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchAllData = async () => {
        setLoading(true);
        
        // Independent error handling for each endpoint
        Promise.allSettled([
            fetchCommandCenterSummary().then(setSummary).catch(err => console.error("Error fetching summary", err)),
            fetchWardOperationalSummary().then(setWards).catch(err => console.error("Error fetching wards", err)),
            fetchBedPriority().then(setBedPriorities).catch(err => console.error("Error fetching bed priorities", err)),
            fetchDischargeQueue().then(setDischargeQueue).catch(err => console.error("Error fetching discharge queue", err)),
            fetchCommandCenterPriorities().then(setPriorities).catch(err => console.error("Error fetching priorities", err)),
            fetchSLASummary().then(setSlaSummary).catch(err => console.error("Error fetching SLA summary", err)),
            fetchSLAWorkflows().then(setSlaWorkflows).catch(err => console.error("Error fetching SLA workflows", err)),
            fetchNotifications().then(setNotifications).catch(err => console.error("Error fetching notifications", err))
        ]).finally(() => {
            setLoading(false);
            setLastRefresh(new Date());
        });
    };

    useEffect(() => {
        fetchAllData();
        const intervalId = setInterval(() => {
            fetchAllData();
        }, 30000); // 30 seconds polling

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
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
<h1 className="text-3xl font-bold text-gray-800">Operations Command Center</h1>
                    <p className="text-sm text-gray-500">
                        Hospital Status: <span className="font-semibold text-blue-600">{summary?.hospital_status || 'Unknown'}</span>
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span className="text-sm text-gray-500">
                        Last Refreshed: {lastRefresh.toLocaleTimeString()}
                    </span>
                    <button 
                        onClick={fetchAllData}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition flex items-center disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Now'}
                    </button>
                    <Link to="/capacity" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded transition whitespace-nowrap">
                        Capacity Planning &rarr;
                    </Link>
                    <Link to="/admin" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded transition">
                        System Admin
                    </Link>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-semibold">Total Capacity / Occupancy</h3>
                    <p className="text-2xl font-bold">
                        {summary?.current_occupancy || 0} / {summary?.total_capacity || 0}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-semibold">Pending Admissions</h3>
                    <p className="text-2xl font-bold text-yellow-600">{summary?.pending_admissions || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-semibold">Pending Discharges</h3>
                    <p className="text-2xl font-bold text-green-600">{summary?.pending_discharges || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm font-semibold">Active Alerts</h3>
                    <p className="text-2xl font-bold text-red-600">{summary?.active_alerts || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area - Wards and Queues */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ward Overview */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Ward Operational Overview</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Admt/Dschg</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {wards.map((ward, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{ward.ward_name || 'N/A'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {ward.occupancy || 0} / {ward.capacity || 0}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-yellow-600">{ward.pending_admissions || 0}</span> / 
                                                <span className="text-green-600 ml-1">{ward.pending_discharges || 0}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    ward.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                                                    ward.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {ward.status || 'Normal'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {wards.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-center text-gray-500">No ward data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bed Priority Queue */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Bed Priority Queue</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Ward</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bedPriorities.map((req, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{req.request_type || 'Unknown'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">{req.requested_ward || 'Any'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">{req.wait_time_mins || 0} mins</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    req.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                                    req.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {req.priority || 'Low'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {bedPriorities.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-center text-gray-500">No pending bed requests</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="space-y-6">
                    {/* Command Center Priorities */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Action Required</h2>
                        <ul className="space-y-3">
                            {priorities.map((item, idx) => (
                                <li key={idx} className="p-3 bg-gray-50 rounded border-l-4 border-red-500">
                                    <p className="text-sm font-bold text-gray-800">{item.type || 'Alert'}</p>
                                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                </li>
                            ))}
                            {priorities.length === 0 && (
                                <li className="text-sm text-gray-500 text-center py-2">All operations nominal</li>
                            )}
                        </ul>
                    </div>

                    {/* Discharge Queue */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Discharge Pipeline</h2>
                        <ul className="space-y-3">
                            {dischargeQueue.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border">
                                    <div>
                                        <p className="text-sm font-semibold">Bed #{item.bed_id}</p>
                                        <p className="text-xs text-gray-500">{item.ward || 'Unknown Ward'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-blue-600">{item.status}</p>
                                        <p className="text-xs text-gray-500">{item.estimated_time}</p>
                                    </div>
                                </li>
                            ))}
                            {dischargeQueue.length === 0 && (
                                <li className="text-sm text-gray-500 text-center py-2">No pending discharges</li>
                            )}
                        </ul>
                    </div>
                    
                    {/* Recent Activity */}
                    {/* Reporting CTA */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center items-center text-center">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">Reporting Snapshot</h2>
                        <p className="text-sm text-gray-500 mb-4">View detailed metrics and generate PDF/CSV reports.</p>
                        <button onClick={() => window.location.href='/reports'} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full">Go to Reports</button>
                    </div>

                    {/* Allocation Queue CTA */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Allocation Queue</h2>
                        <p className="text-sm text-gray-500 mb-4">View operational queues, ward pressures, and active blockers in Workflow Orchestration.</p>
                        <Link to="/orchestration" className="block text-center bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full border border-blue-200">
                            Workflow Orchestration &rarr;
                        </Link>
                    </div>

                    {/* Executive CTA */}
                    <div className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 p-4 flex flex-col justify-center items-center text-center">
                        <h2 className="text-xl font-bold mb-2 text-indigo-900">Executive Overview</h2>
                        <p className="text-sm text-indigo-700 mb-4">High-level hospital performance metrics.</p>
                        <button onClick={() => window.location.href='/executive'} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full shadow-sm">View Executive Performance</button>
                    </div>

                    {/* Predictive Operations CTA */}
                    <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-100 p-4 flex flex-col justify-center items-center text-center">
                        <h2 className="text-xl font-bold mb-2 text-purple-900">Early Warning</h2>
                        <p className="text-sm text-purple-700 mb-4">Predictive operational pressures.</p>
                        <Link to="/predictive-operations" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 w-full transition-colors shadow-sm">Predictive Ops</Link>
                    </div>
                    
            {/* BENCHMARKING CTA */}
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-4 flex flex-col justify-center items-center text-center mt-4 mb-4">
                <h3 className="font-bold text-teal-900 mb-2">Facility Benchmarking</h3>
                <p className="text-sm text-teal-700 mb-4">Compare operational performance against standards.</p>
                <Link to="/benchmarking" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 w-full transition-colors shadow-sm">View Benchmarks</Link>
            </div>

            <RecentActivityWidget />
                </div>
            </div>

            {/* SLA Monitoring Section */}
            <div className="mt-8">
                {/* NOTIFICATIONS WIDGET */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500"/> Operational Notifications</h3>
                {notifications.filter(n => !n.is_read).length === 0 ? (
                    <p className="text-sm text-slate-500">No unread notifications.</p>
                ) : (
                    <div className="space-y-3">
                        {notifications.filter(n => !n.is_read).slice(0, 3).map(n => (
                            <div key={n.id} className="flex flex-col text-sm p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-700">{n.title}</span>
                                    <span className="text-xs text-slate-500">{new Date(n.created_at).toLocaleTimeString()}</span>
                                </div>
                                <span className="text-slate-600 mt-1">{n.message}</span>
                            </div>
                        ))}
                        {notifications.filter(n => !n.is_read).length > 3 && (
                            <div className="text-sm text-blue-500 font-medium cursor-pointer" onClick={() => window.location.href='/notifications'}>
                                View {notifications.filter(n => !n.is_read).length - 3} more unread notifications...
                            </div>
                        )}
                    </div>
                )}
            </div>
            <SLAMonitor summary={slaSummary} workflows={slaWorkflows} />
            </div>
        </div>
    );
};

export default CommandCenter;

