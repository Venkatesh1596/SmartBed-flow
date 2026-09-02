import React from 'react';
import { type SLASummary, type SLAWorkflow } from '../api/dashboardApi';

interface SLAMonitorProps {
    summary: SLASummary | null;
    workflows: SLAWorkflow[];
}

export const SLAMonitor: React.FC<SLAMonitorProps> = ({ summary, workflows }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'On Track':
                return 'bg-green-100 text-green-800';
            case 'Approaching SLA':
            case 'Approaching':
                return 'bg-yellow-100 text-yellow-800';
            case 'Overdue':
                return 'bg-orange-100 text-orange-800';
            case 'Critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Operational SLA Monitor</h2>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-green-800 text-sm font-semibold">On Track</h3>
                    <p className="text-2xl font-bold text-green-700">{summary?.on_track || 0}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-yellow-800 text-sm font-semibold">Approaching</h3>
                    <p className="text-2xl font-bold text-yellow-700">{summary?.approaching || 0}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h3 className="text-orange-800 text-sm font-semibold">Overdue</h3>
                    <p className="text-2xl font-bold text-orange-700">{summary?.overdue || 0}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h3 className="text-red-800 text-sm font-semibold">Critical</h3>
                    <p className="text-2xl font-bold text-red-700">{summary?.critical || 0}</p>
                </div>
            </div>

            {/* Workflow Queue Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Info</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {workflows.map((wf) => (
                            <tr key={wf.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{wf.bed_id}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{wf.workflow_type}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{wf.status}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(wf.sla_status)}`}>
                                        {wf.sla_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {wf.time_remaining ? `Remaining: ${wf.time_remaining}` : wf.overdue_by ? `Overdue by: ${wf.overdue_by}` : wf.elapsed_time ? `Elapsed: ${wf.elapsed_time}` : '-'}
                                </td>
                            </tr>
                        ))}
                        {workflows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No active workflows</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SLAMonitor;
