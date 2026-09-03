import { useEffect, useState } from 'react';
import { Target, CheckCircle2, TrendingUp, Clock, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, EmptyState, LoadingSkeleton } from './ui';
import { fetchPhase24Validation } from '../api/dashboardApi';
import type { Phase24ValidationResult } from '../api/dashboardApi';

export default function Phase24Evaluation() {
    const [data, setData] = useState<Phase24ValidationResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchPhase24Validation();
                setData(result);
            } catch (err: any) {
                // Fallback mock data
                setData({
                    problem_statement: "Hospitals lack real-time visibility into bed readiness, leading to delays in patient admission and suboptimal capacity utilization.",
                    kpi: {
                        metric: "Readiness -> Next Safe Bed",
                        baseline: "45 mins",
                        target: "< 20 mins",
                        smartbed_flow_result: "18 mins",
                        improvement: "60%"
                    },
                    journeys: {
                        routine: {
                            name: "Routine Admission",
                            timeline: ["Patient admitted to ER", "Bed requested", "Bed marked ready", "Patient transported", "Patient in bed"]
                        },
                        urgent: {
                            name: "ICU Stepdown",
                            timeline: ["ICU transfer requested", "Priority bed assigned", "Rapid cleaning triggered", "Bed ready", "Patient transferred"]
                        }
                    },
                    edge_cases: [],
                    human_review_points: [],
                    failure_cases: [],
                    error_analysis: ""
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton rows={1} className="h-10 w-64 mb-6" />
                <LoadingSkeleton rows={1} className="h-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LoadingSkeleton rows={1} className="h-64" />
                    <LoadingSkeleton rows={1} className="h-64" />
                </div>
            </div>
        );
    }

    if (!data) {
        return <EmptyState title="Evaluation Data Unavailable" description="Could not load phase 24 validation metrics." />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary-600" />
                        MVP Evaluation (Phase 24)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Validation metrics and outcome tracking</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={'ON_TRACK'} />
                </div>
            </div>

            {/* Problem Statement */}
            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> The Problem
                    </h3>
                    <p className="text-slate-800 font-medium leading-relaxed">
                        "{data.problem_statement}"
                    </p>
                </CardContent>
            </Card>

            {/* KPI Results */}
            <Card>
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Core KPI: {data.kpi.metric}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-slate-500 mb-1">Baseline</span>
                            <span className="text-3xl font-bold text-slate-700">{data.kpi.baseline}</span>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-slate-500 mb-1">Target</span>
                            <span className="text-3xl font-bold text-primary-600">{data.kpi.target}</span>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-center bg-success-50">
                            <span className="text-sm font-semibold text-success-700 mb-1">SmartBed Flow</span>
                            <span className="text-3xl font-bold text-success-600">{data.kpi.smartbed_flow_result}</span>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-slate-500 mb-1">Improvement</span>
                            <span className="text-3xl font-bold text-slate-800 flex items-center gap-1">
                                <TrendingUp className="w-6 h-6 text-success-500" /> {data.kpi.improvement}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Journeys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-info-500" />
                            {data.journeys.routine.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                            {data.journeys.routine.timeline.map((step, index) => (
                                <div key={index} className="relative pl-6">
                                    <div className="absolute w-4 h-4 bg-white border-2 border-primary-500 rounded-full -left-[9px] top-1"></div>
                                    <p className="font-medium text-sm text-slate-700">{step}</p>
                                </div>
                            ))}
                            <div className="relative pl-6">
                                <div className="absolute w-4 h-4 bg-success-500 border-2 border-white rounded-full -left-[9px] top-1 shadow"></div>
                                <p className="font-bold text-sm text-success-700 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Completed Routine
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-warning-500" />
                            {data.journeys.urgent.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                            {data.journeys.urgent.timeline.map((step, index) => (
                                <div key={index} className="relative pl-6">
                                    <div className="absolute w-4 h-4 bg-white border-2 border-warning-500 rounded-full -left-[9px] top-1"></div>
                                    <p className="font-medium text-sm text-slate-700">{step}</p>
                                </div>
                            ))}
                            <div className="relative pl-6">
                                <div className="absolute w-4 h-4 bg-success-500 border-2 border-white rounded-full -left-[9px] top-1 shadow"></div>
                                <p className="font-bold text-sm text-success-700 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Completed Urgent
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
