import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchSimulationCompare, type SimulationComparison, type SimulationParams } from '../api/dashboardApi';

const SimulationCenter: React.FC = () => {
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
        if (preset === 'Additional Capacity') {
            newParams = { ...newParams, additional_available_beds: 10 };
        } else if (preset === 'Cleaning Delay') {
            newParams = { ...newParams, cleaning_time_adjustment_minutes: 30 };
        } else if (preset === 'High Admissions') {
            newParams = { ...newParams, admission_rate_multiplier: 1.5 };
        }
        setParams(newParams);
        loadComparison(newParams);
    };

    if (loading && !comparison) return <div className="p-6">Loading simulation...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
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
<h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        Operational Simulation
                        <span className="ml-4 bg-orange-100 text-orange-800 text-sm font-semibold px-2.5 py-0.5 rounded border border-orange-200">
                            SIMULATION ONLY
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-1">Read-only modeling tool. Do not use for clinical claims.</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={handleReset} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Reset Scenario
                    </button>
                    <button onClick={handleApplyScenario} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Run Simulation
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Scenario Builder</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Beds ({params.additional_available_beds})
                            </label>
                            <input 
                                type="range" min="0" max="50" step="1" 
                                value={params.additional_available_beds || 0}
                                onChange={e => setParams({...params, additional_available_beds: Number(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cleaning Time Adj (Mins) ({params.cleaning_time_adjustment_minutes})
                            </label>
                            <input 
                                type="range" min="-30" max="60" step="5" 
                                value={params.cleaning_time_adjustment_minutes || 0}
                                onChange={e => setParams({...params, cleaning_time_adjustment_minutes: Number(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admission Multiplier ({params.admission_rate_multiplier})
                            </label>
                            <input 
                                type="range" min="0.5" max="2.0" step="0.1" 
                                value={params.admission_rate_multiplier || 1.0}
                                onChange={e => setParams({...params, admission_rate_multiplier: Number(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discharge Multiplier ({params.discharge_rate_multiplier})
                            </label>
                            <input 
                                type="range" min="0.5" max="2.0" step="0.1" 
                                value={params.discharge_rate_multiplier || 1.0}
                                onChange={e => setParams({...params, discharge_rate_multiplier: Number(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <h3 className="text-md font-medium text-gray-700 mt-6 mb-3">Presets</h3>
                    <div className="flex flex-col space-y-2">
                        <button onClick={() => applyPreset('Additional Capacity')} className="px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded border border-indigo-100 hover:bg-indigo-100 text-left">
                            + Additional Capacity
                        </button>
                        <button onClick={() => applyPreset('Cleaning Delay')} className="px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded border border-indigo-100 hover:bg-indigo-100 text-left">
                            + Cleaning Delay
                        </button>
                        <button onClick={() => applyPreset('High Admissions')} className="px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded border border-indigo-100 hover:bg-indigo-100 text-left">
                            + High Admissions Surge
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {comparison && (
                        <>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Baseline vs Scenario</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Performance Index</div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xl font-medium text-gray-800">{comparison.baseline.summary.performance_index.toFixed(1)}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className={`text-xl font-bold ${comparison.scenario.summary.performance_index > comparison.baseline.summary.performance_index ? 'text-green-600' : 'text-red-600'}`}>
                                                {comparison.scenario.summary.performance_index.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Early Warning Score</div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xl font-medium text-gray-800">{comparison.baseline.summary.early_warning_score.toFixed(1)}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className={`text-xl font-bold ${comparison.scenario.summary.early_warning_score < comparison.baseline.summary.early_warning_score ? 'text-green-600' : 'text-red-600'}`}>
                                                {comparison.scenario.summary.early_warning_score.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Capacity Pressure</div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xl font-medium text-gray-800">{comparison.baseline.summary.capacity_pressure.toFixed(1)}%</span>
                                            <span className="text-gray-400">→</span>
                                            <span className={`text-xl font-bold ${comparison.scenario.summary.capacity_pressure < comparison.baseline.summary.capacity_pressure ? 'text-green-600' : 'text-red-600'}`}>
                                                {comparison.scenario.summary.capacity_pressure.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Workflow Pressure</div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xl font-medium text-gray-800">{comparison.baseline.summary.workflow_pressure.toFixed(1)}%</span>
                                            <span className="text-gray-400">→</span>
                                            <span className={`text-xl font-bold ${comparison.scenario.summary.workflow_pressure < comparison.baseline.summary.workflow_pressure ? 'text-green-600' : 'text-red-600'}`}>
                                                {comparison.scenario.summary.workflow_pressure.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Ward Impact</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Baseline Occ.</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario Occ.</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pressure Change</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {comparison.scenario.wards.map((ward: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ward.ward_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ward.baseline_occupancy}%</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{ward.scenario_occupancy}%</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            ward.pressure_change === 'Increased' ? 'bg-red-100 text-red-800' : 
                                                            ward.pressure_change === 'Decreased' ? 'bg-green-100 text-green-800' : 
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {ward.pressure_change}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {comparison.scenario.wards.length === 0 && (
                                                <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No ward data available</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Simulated Warnings</h2>
                                    <ul className="space-y-3">
                                        {comparison.scenario.warnings.map((warning: any) => (
                                            <li key={warning.id} className="flex items-start">
                                                <span className={`flex-shrink-0 h-2 w-2 mt-2 rounded-full ${
                                                    warning.severity === 'CRITICAL' ? 'bg-red-500' : 
                                                    warning.severity === 'HIGH' ? 'bg-orange-500' : 
                                                    'bg-yellow-500'
                                                }`}></span>
                                                <span className="ml-3 text-sm text-gray-700">{warning.message}</span>
                                            </li>
                                        ))}
                                        {comparison.scenario.warnings.length === 0 && (
                                            <li className="text-sm text-gray-500">No critical warnings triggered in this scenario.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Scenario Recommendations</h2>
                                    <ul className="space-y-3">
                                        {comparison.scenario.recommendations.map((rec: any) => (
                                            <li key={rec.id} className="flex flex-col p-3 bg-blue-50 rounded border border-blue-100">
                                                <span className="text-sm font-medium text-blue-900">{rec.action}</span>
                                                <span className="text-xs text-blue-700 mt-1">{rec.impact}</span>
                                            </li>
                                        ))}
                                        {comparison.scenario.recommendations.length === 0 && (
                                            <li className="text-sm text-gray-500">No specific recommendations for this scenario.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
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
};

export default SimulationCenter;
