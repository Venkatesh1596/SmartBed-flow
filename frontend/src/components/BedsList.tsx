import { useEffect, useState } from 'react';
import { fetchBeds, fetchBedAvailabilityPredictions, fetchBedSLA } from '../api/dashboardApi';
import type { Bed, BedAvailabilityPrediction } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { BedDouble, ShieldCheck, Clock, Search } from 'lucide-react';

export default function BedsList() {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [predictions, setPredictions] = useState<Record<number, BedAvailabilityPrediction>>({});
    const [bedSLAs, setBedSLAs] = useState<Record<number, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    const canManageBeds = user?.role?.name === 'ADMIN' || user?.role?.name === 'FACILITY_MANAGER';

    useEffect(() => {
        const loadData = async () => {
            try {
                const [bedsData, predsData] = await Promise.all([
                    fetchBeds(),
                    fetchBedAvailabilityPredictions().catch(() => [])
                ]);
                setBeds(bedsData || []);
                
                const predMap: Record<number, BedAvailabilityPrediction> = {};
                if (predsData) {
                    predsData.forEach(p => { predMap[p.bed_id] = p; });
                }
                setPredictions(predMap);

                const slas: Record<number, any> = {};
                if (bedsData) {
                    for (const bed of bedsData) {
                        try {
                            slas[bed.id] = await fetchBedSLA(bed.id);
                        } catch {
                            slas[bed.id] = null;
                        }
                    }
                }
                setBedSLAs(slas);
            } catch (err) {
                console.error("Failed to fetch beds data:", err);
                setError('Could not load beds. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredBeds = beds.filter(bed => {
        const searchStr = searchTerm.toLowerCase();
        
        // Safely extract properties that match the backend Bed contract
        const bedName = bed.name ? String(bed.name).toLowerCase() : '';
        const bedState = bed.state ? String(bed.state).toLowerCase() : '';
        const wardStr = bed.ward_id ? `ward ${bed.ward_id}` : '';
        const idStr = `bed ${bed.id}`;

        return (
            bedName.includes(searchStr) ||
            bedState.includes(searchStr) ||
            wardStr.includes(searchStr) ||
            idStr.includes(searchStr)
        );
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <LoadingSkeleton rows={1} className="w-48 h-8" />
                    <LoadingSkeleton rows={1} className="w-64 h-10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => <LoadingSkeleton key={i} rows={4} className="h-40" />)}
                </div>
            </div>
        );
    }

    if (error) {
        return <EmptyState title="Error Loading Beds" description={error} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <BedDouble className="w-6 h-6 text-primary-600" />
                        Facility Beds
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time status and operational SLAs</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter beds..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {canManageBeds && (
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Add Bed
                        </button>
                    )}
                </div>
            </div>

            {/* Bed Grid */}
            {filteredBeds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBeds.map(bed => {
                        const pred = predictions[bed.id];
                        const sla = bedSLAs[bed.id];
                        
                        return (
                            <Card key={bed.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50 rounded-t-xl">
                                    <CardTitle className="text-lg">
                                        <span className="text-slate-500 text-sm font-medium mr-1">BED</span>
                                        {bed.name || bed.id}
                                    </CardTitle>
                                    <StatusBadge status={bed.state} />
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Ward</span>
                                        <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                            {bed.ward_id ? `Ward ${bed.ward_id}` : 'Unassigned'}
                                        </span>
                                    </div>
                                    
                                    {pred && bed.state === 'OCCUPIED' && (
                                        <div className="flex items-center justify-between text-sm bg-indigo-50 text-indigo-700 p-2 rounded-md border border-indigo-100">
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Available In</span>
                                            <span className="font-bold">~{pred.estimated_time_to_available}m</span>
                                        </div>
                                    )}

                                    {sla && bed.state !== 'AVAILABLE' && (
                                        <div className="mt-4 pt-3 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> SLA Status
                                                </span>
                                                {sla.breached ? (
                                                    <span className="text-xs font-bold text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded">BREACHED</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-success-600 bg-success-50 px-1.5 py-0.5 rounded">ON TRACK</span>
                                                )}
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                                                <div 
                                                    className={`h-2 rounded-full ${sla.breached ? 'bg-danger-500' : 'bg-success-500'}`} 
                                                    style={{ width: `${Math.min((sla.elapsed_time / sla.target_time) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs text-slate-500 font-medium">
                                                <span>{sla.elapsed_time}m</span>
                                                <span>{sla.target_time}m limit</span>
                                            </div>
                                        </div>
                                    )}

                                    {!sla && bed.state === 'AVAILABLE' && (
                                        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                                            <span className="text-xs text-slate-400 font-medium tracking-wide">READY FOR PATIENT</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState 
                    title="No Beds Found" 
                    description={searchTerm ? `No beds matching "${searchTerm}"` : "There are no beds available in the system."} 
                />
            )}
        </div>
    );
}
