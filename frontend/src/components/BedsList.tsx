import { useEffect, useState } from 'react';
import { fetchBeds, fetchBedAvailabilityPredictions, fetchBedSLA } from '../api/dashboardApi';
import type { Bed, BedAvailabilityPrediction } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function BedsList() {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [predictions, setPredictions] = useState<Record<number, BedAvailabilityPrediction>>({});
    const [bedSLAs, setBedSLAs] = useState<Record<number, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const canManageBeds = user?.role?.name === 'ADMIN' || user?.role?.name === 'FACILITY_MANAGER';

    useEffect(() => {
        const loadData = async () => {
            try {
                const [bedsData, predsData] = await Promise.all([
                    fetchBeds(),
                    fetchBedAvailabilityPredictions().catch(() => [])
                ]);
                setBeds(bedsData);
                
                const predMap: Record<number, BedAvailabilityPrediction> = {};
                predsData.forEach(p => { predMap[p.bed_id] = p; });
                setPredictions(predMap);

                // Fetch SLA for each bed
                const slas = await Promise.allSettled(
                    bedsData.map(bed => fetchBedSLA(bed.id).catch(() => null))
                );
                
                const slaMap: Record<number, any> = {};
                slas.forEach((res, index) => {
                    if (res.status === 'fulfilled' && res.value) {
                        slaMap[bedsData[index].id] = res.value;
                    }
                });
                setBedSLAs(slaMap);

            } catch (err: any) {
                setError(err.message || 'Failed to load beds');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading beds...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-slate-800">Beds Management</h1>
                    <Link to="/capacity" className="text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded transition-colors whitespace-nowrap">
                        Capacity &rarr;
                    </Link>
                    <Link to="/orchestration" className="text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1 rounded transition-colors whitespace-nowrap" title="View in Workflow Orchestration">
                        Workflow &rarr;
                    </Link>
                </div>
                {canManageBeds && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                        Create Bed
                    </button>
                )}
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ward ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">State</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prediction</th>
                            {canManageBeds && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {beds.map((bed) => (
                            <tr key={bed.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{bed.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{bed.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{bed.ward_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex flex-col space-y-1">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                                            {bed.state}
                                        </span>
                                        {bedSLAs[bed.id] && (
                                            <span className={`text-xs font-bold ${
                                                bedSLAs[bed.id].sla_status === 'Critical' ? 'text-red-600' :
                                                bedSLAs[bed.id].sla_status === 'Overdue' ? 'text-orange-600' :
                                                bedSLAs[bed.id].sla_status === 'Approaching' ? 'text-yellow-600' :
                                                bedSLAs[bed.id].sla_status === 'Approaching SLA' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                                {bedSLAs[bed.id].workflow_type} — {bedSLAs[bed.id].sla_status.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {predictions[bed.id] && predictions[bed.id].status_flag ? (
                                        <span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md text-xs">{predictions[bed.id].status_flag}</span>
                                    ) : predictions[bed.id] && predictions[bed.id].probability_available_soon > 0.5 ? (
                                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md text-xs">Available soon ({predictions[bed.id].estimated_time_to_available}m)</span>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </td>
                                {canManageBeds && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                        <button className="text-indigo-600 hover:text-indigo-900">Status</button>
                                        <button className="text-green-600 hover:text-green-900">Admit</button>
                                        <button className="text-amber-600 hover:text-amber-900">Discharge</button>
                                        <Link to={`/audit?entity_type=BED&entity_id=${bed.id}`} className="text-purple-600 hover:text-purple-900">View Activity</Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {beds.length === 0 && (
                            <tr>
                                <td colSpan={canManageBeds ? 6 : 5} className="px-6 py-8 text-center text-slate-500 text-sm">
                                    No beds found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
