import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../api/dashboardApi';
import type { AuditLog, AuditLogFilters } from '../api/dashboardApi';
import { useLocation } from 'react-router-dom';

const AuditTrail: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialEntityType = queryParams.get('entity_type') || undefined;
    const initialEntityId = queryParams.get('entity_id') || undefined;

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<AuditLogFilters>({ 
        skip: 0, 
        limit: 50,
        entity_type: initialEntityType,
        entity_id: initialEntityId
    });

    const loadLogs = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAuditLogs(filters);
            setLogs(data);
        } catch (error) {
            console.error('Failed to load audit logs', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
            skip: 0 // reset pagination on filter change
        }));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Operational Audit Trail</h1>
            
            <div className="bg-white p-4 rounded shadow-sm mb-6 flex flex-wrap gap-4 border border-slate-200">
                <input type="text" placeholder="Action" className="border border-slate-300 p-2 rounded text-sm focus:ring-slate-500 focus:border-slate-500" 
                    value={filters.action || ''}
                    onChange={e => handleFilterChange('action', e.target.value)} />
                <input type="text" placeholder="Module" className="border border-slate-300 p-2 rounded text-sm focus:ring-slate-500 focus:border-slate-500" 
                    value={filters.module || ''}
                    onChange={e => handleFilterChange('module', e.target.value)} />
                <input type="text" placeholder="Entity Type" className="border border-slate-300 p-2 rounded text-sm focus:ring-slate-500 focus:border-slate-500" 
                    value={filters.entity_type || ''}
                    onChange={e => handleFilterChange('entity_type', e.target.value)} />
                <input type="text" placeholder="Entity ID" className="border border-slate-300 p-2 rounded text-sm focus:ring-slate-500 focus:border-slate-500" 
                    value={filters.entity_id || ''}
                    onChange={e => handleFilterChange('entity_id', e.target.value)} />
                <input type="date" className="border border-slate-300 p-2 rounded text-sm focus:ring-slate-500 focus:border-slate-500" 
                    value={filters.start_date || ''}
                    onChange={e => handleFilterChange('start_date', e.target.value)} />
                <button 
                    onClick={() => setFilters({ skip: 0, limit: 50 })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium">
                    Clear Filters
                </button>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200 overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading audit trail...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No audit logs found matching the criteria.</div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Module</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{log.username || log.user_id || 'System'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">{log.action}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{log.module}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {log.details && Object.keys(log.details).length > 0 ? (
                                            <pre className="text-[10px] bg-slate-50 p-2 rounded border border-slate-100 overflow-x-auto max-w-xs">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        ) : (
                                            <span className="text-slate-400 italic">None</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {!loading && (
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                        Showing {logs.length} logs
                    </div>
                    <div className="space-x-2">
                        <button 
                            disabled={filters.skip === 0} 
                            onClick={() => setFilters({...filters, skip: Math.max(0, (filters.skip || 0) - (filters.limit || 50))})}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                            Previous
                        </button>
                        <button 
                            disabled={logs.length < (filters.limit || 50)}
                            onClick={() => setFilters({...filters, skip: (filters.skip || 0) + (filters.limit || 50)})}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditTrail;
