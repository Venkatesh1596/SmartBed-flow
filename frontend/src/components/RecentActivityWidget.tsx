import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAuditLogs } from '../api/dashboardApi';
import type { AuditLog } from '../api/dashboardApi';
import { Activity } from 'lucide-react';

const RecentActivityWidget: React.FC = () => {
    const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const logs = await fetchAuditLogs({ limit: 5, skip: 0 });
                setRecentLogs(logs);
            } catch (err) {
                console.error("Failed to fetch recent audit logs", err);
            } finally {
                setLoading(false);
            }
        };
        loadLogs();
        const interval = setInterval(loadLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" /> Recent Operational Activity
                </h3>
                <Link to="/audit" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                    View All
                </Link>
            </div>
            {loading ? (
                <div className="text-sm text-slate-500 animate-pulse">Loading activity...</div>
            ) : recentLogs.length === 0 ? (
                <div className="text-sm text-slate-500">No recent activity.</div>
            ) : (
                <div className="space-y-3 overflow-y-auto flex-grow">
                    {recentLogs.map(log => (
                        <div key={log.id} className="flex flex-col text-sm border-b border-slate-100 pb-2 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-slate-700">{log.action}</span>
                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                    {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">
                                {log.username || log.user_id || 'System'} - {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivityWidget;
