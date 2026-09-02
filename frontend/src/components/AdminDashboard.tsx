import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    fetchAdminSummary,
    fetchSystemHealth,
    fetchAdminConfiguration,
    fetchAdminUsers,
    updateAdminUserStatus,
    updateAdminUserRole,
    type AdminSummary,
    type SystemHealth,
    type AdminConfiguration,
    type AdminUser
} from '../api/dashboardApi';

export default function AdminDashboard() {
    const [summary, setSummary] = useState<AdminSummary | null>(null);
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [config, setConfig] = useState<AdminConfiguration[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [sumData, healthData, configData, usersData] = await Promise.all([
                fetchAdminSummary(),
                fetchSystemHealth(),
                fetchAdminConfiguration(),
                fetchAdminUsers()
            ]);
            setSummary(sumData);
            setHealth(healthData);
            setConfig(configData);
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to load admin data", error);
        }
        setLoading(false);
    };

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        try {
            await updateAdminUserStatus(userId, !currentStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await updateAdminUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading admin dashboard...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex justify-between items-center">
                
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 flex justify-between items-center rounded shadow-sm">
                <div>
                    <p className="text-sm text-blue-700 font-bold">Real-Time Operations</p>
                    <p className="text-xs text-blue-600">Monitor all hospital metrics in real-time</p>
                </div>
                <Link to="/control-tower" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                    Go to Control Tower
                </Link>
            </div>
<h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
                <div className="flex gap-4">
                    <Link to="/capacity" className="text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded transition-colors whitespace-nowrap">Capacity Planning &rarr;</Link>
                    <Link to="/orchestration" className="text-sm font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded transition-colors whitespace-nowrap">Workflow Orchestration &rarr;</Link>
                </div>
            </div>

            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">System Status</h3>
                    <p className={`text-2xl font-bold ${health?.status === 'Healthy' ? 'text-green-600' : 'text-red-600'}`}>{health?.status}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">CPU Usage</h3>
                    <p className="text-2xl font-bold text-slate-900">{health?.cpu_usage}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Memory Usage</h3>
                    <p className="text-2xl font-bold text-slate-900">{health?.memory_usage}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500">Uptime</h3>
                    <p className="text-2xl font-bold text-slate-900">{health?.uptime}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Administration Table */}
                <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <div className="px-4 py-5 border-b border-slate-200">
                        <h3 className="text-lg font-medium leading-6 text-slate-900">User Administration</h3>
                        <p className="mt-1 text-sm text-slate-500">Total: {summary?.total_users} | Active: {summary?.active_users}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{user.username}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Staff">Staff</option>
                                                <option value="Viewer">Viewer</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Operational Configuration Viewer */}
                    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                        <div className="px-4 py-5 border-b border-slate-200">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Operational Configuration</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-slate-200">
                                {config.map((item, index) => (
                                    <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-slate-500">{item.setting_key}</dt>
                                        <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                                            {item.setting_value}
                                            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    {/* Recent Admin Activity Widget */}
                    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                        <div className="px-4 py-5 border-b border-slate-200">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Admin Activity</h3>
                        </div>
                        <div className="p-4 text-sm text-slate-500">
                            <p>Last Backup: {summary?.last_backup || 'N/A'}</p>
                            <p className="mt-2">Activity log viewer placeholder...</p>
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
