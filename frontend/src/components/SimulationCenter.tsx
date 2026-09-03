import { useState, useEffect } from 'react';
import { Play, Settings2, RotateCcw, ActivitySquare, ChevronRight, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { fetchSimulationCompare, type SimulationComparison, type SimulationParams } from '../api/dashboardApi';

export default function SimulationCenter() {
    const [params, setParams] = useState<SimulationParams>({
        additional_available_beds: 0,
        cleaning_time_adjustment_minutes: 0,
        admission_rate_multiplier: 1.0,
        discharge_rate_multiplier: 1.0,
    });
    
    const [comparison, setComparison] = useState<SimulationComparison | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadComparison = async (currentParams: SimulationParams) => {
        try {
            setLoading(true);
            const data = await fetchSimulationCompare(currentParams);
            setComparison(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load simulation data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComparison(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApplyScenario = () => {
        loadComparison(params);
    };

    const handleReset = () => {
        const resetParams = {
            additional_available_beds: 0,
            cleaning_time_adjustment_minutes: 0,
            admission_rate_multiplier: 1.0,
            discharge_rate_multiplier: 1.0,
        };
        setParams(resetParams);
        loadComparison(resetParams);
    };

    const applyPreset = (preset: string) => {
        let newParams = { ...params };
        if (preset === 'surge') {
            newParams.admission_rate_multiplier = 1.5;
            newParams.discharge_rate_multiplier = 0.8;
        } else if (preset === 'efficiency') {
            newParams.cleaning_time_adjustment_minutes = -15;
            newParams.discharge_rate_multiplier = 1.2;
        } else if (preset === 'capacity_expansion') {
            newParams.additional_available_beds = 20;
        }
        setParams(newParams);
        loadComparison(newParams);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary-600" />
                        Simulation Sandbox
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Test operational scenarios and predict outcomes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Scenario Builder */}
                <Card className="lg:col-span-1 bg-slate-50 border-slate-200">
                    <CardHeader className="border-b border-slate-200 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-slate-600" />
                            Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-6">
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Admission Rate Multiplier</label>
                            <input 
                                type="range" 
                                min="0.5" max="2.0" step="0.1" 
                                value={params.admission_rate_multiplier} 
                                onChange={e => setParams({...params, admission_rate_multiplier: parseFloat(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>0.5x</span>
                                <span className="text-primary-700 font-bold bg-primary-100 px-2 py-0.5 rounded">{params.admission_rate_multiplier}x</span>
                                <span>2.0x</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Discharge Rate Multiplier</label>
                            <input 
                                type="range" 
                                min="0.5" max="2.0" step="0.1" 
                                value={params.discharge_rate_multiplier} 
                                onChange={e => setParams({...params, discharge_rate_multiplier: parseFloat(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>0.5x</span>
                                <span className="text-primary-700 font-bold bg-primary-100 px-2 py-0.5 rounded">{params.discharge_rate_multiplier}x</span>
                                <span>2.0x</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">EVS Cleaning Adjustment (mins)</label>
                            <input 
                                type="range" 
                                min="-30" max="30" step="5" 
                                value={params.cleaning_time_adjustment_minutes} 
                                onChange={e => setParams({...params, cleaning_time_adjustment_minutes: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>-30m</span>
                                <span className="text-primary-700 font-bold bg-primary-100 px-2 py-0.5 rounded">{(params.cleaning_time_adjustment_minutes || 0) > 0 ? '+' : ''}{params.cleaning_time_adjustment_minutes}m</span>
                                <span>+30m</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Additional Beds</label>
                            <input 
                                type="number" 
                                value={params.additional_available_beds} 
                                onChange={e => setParams({...params, additional_available_beds: parseInt(e.target.value) || 0})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-200 space-y-3">
                            <p className="text-xs font-semibold text-slate-500 uppercase">Presets</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => applyPreset('surge')} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium transition-colors">Mass Casualty Surge</button>
                                <button onClick={() => applyPreset('efficiency')} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium transition-colors">EVS Efficiency</button>
                                <button onClick={() => applyPreset('capacity_expansion')} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium transition-colors">Wing Expansion</button>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                onClick={handleReset} 
                                className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                            <button 
                                onClick={handleApplyScenario} 
                                disabled={loading}
                                className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} 
                                Simulate
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Simulation Results */}
                <div className="lg:col-span-3 space-y-6">
                    {loading && !comparison ? (
                        <div className="space-y-6">
                            <LoadingSkeleton rows={1} className="h-32" />
                            <LoadingSkeleton rows={1} className="h-64" />
                        </div>
                    ) : error ? (
                        <EmptyState title="Simulation Failed" description={error} />
                    ) : comparison ? (
                        <>
                            {/* KPI Comparison */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardContent className="p-5 flex flex-col justify-center">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Performance Index</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold text-slate-700">{comparison.baseline.summary.performance_index}</span>
                                                <span className="text-xs text-slate-400 font-medium">Baseline</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                            <div className="flex flex-col">
                                                <span className={`text-2xl font-bold ${comparison.scenario.summary.performance_index > comparison.baseline.summary.performance_index ? 'text-success-600' : 'text-danger-600'}`}>
                                                    {comparison.scenario.summary.performance_index}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium border-b border-dashed border-slate-300 pb-0.5">Scenario</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardContent className="p-5 flex flex-col justify-center">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Early Warning Score</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold text-slate-700">{comparison.baseline.summary.early_warning_score}</span>
                                                <span className="text-xs text-slate-400 font-medium">Baseline</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                            <div className="flex flex-col">
                                                <span className={`text-2xl font-bold ${comparison.scenario.summary.early_warning_score < comparison.baseline.summary.early_warning_score ? 'text-success-600' : 'text-danger-600'}`}>
                                                    {comparison.scenario.summary.early_warning_score}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium border-b border-dashed border-slate-300 pb-0.5">Scenario</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-5 flex flex-col justify-center">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Capacity Pressure</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold text-slate-700">{comparison.baseline.summary.capacity_pressure}</span>
                                                <span className="text-xs text-slate-400 font-medium">Baseline</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                            <div className="flex flex-col">
                                                <span className={`text-2xl font-bold ${comparison.scenario.summary.capacity_pressure < comparison.baseline.summary.capacity_pressure ? 'text-success-600' : 'text-danger-600'}`}>
                                                    {comparison.scenario.summary.capacity_pressure}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium border-b border-dashed border-slate-300 pb-0.5">Scenario</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Ward Impact Grid */}
                            <Card>
                                <CardHeader className="border-b border-slate-100 pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ActivitySquare className="w-5 h-5 text-primary-500" />
                                        Ward-Level Impact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ward</th>
                                                    <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Baseline Occ.</th>
                                                    <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Scenario Occ.</th>
                                                    <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status Change</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {comparison.scenario.wards.map((ward: any, i: number) => {
                                                    const isWorse = ward.scenario_occupancy > ward.baseline_occupancy;
                                                    const isBetter = ward.scenario_occupancy < ward.baseline_occupancy;
                                                    return (
                                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="p-4 font-semibold text-sm text-slate-800">{ward.ward_name}</td>
                                                            <td className="p-4 text-sm text-slate-600">{ward.baseline_occupancy}%</td>
                                                            <td className={`p-4 text-sm font-bold ${isWorse ? 'text-danger-600' : isBetter ? 'text-success-600' : 'text-slate-600'}`}>
                                                                {ward.scenario_occupancy}%
                                                            </td>
                                                            <td className="p-4">
                                                                <StatusBadge status={ward.pressure_change} />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                        </>
                    ) : null}
                </div>
            </div>
            
        </div>
    );
}
