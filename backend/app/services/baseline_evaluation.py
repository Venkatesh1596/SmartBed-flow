from typing import Dict, Any, List
import statistics
import random
from datetime import datetime, timedelta

class BaselineEvaluationService:
    def __init__(self):
        # We don't need a DB connection since we generate synthetic data
        pass

    def evaluate(self, sample_size: int = 100) -> Dict[str, Any]:
        baseline_times = []
        smartbed_times = []
        
        # Simulate 'Time to Next Safe Bed' in minutes
        # Baseline typically 4 to 8 hours (240 to 480 mins)
        # SmartBed Flow typically 1.5 to 3 hours (90 to 180 mins)
        for _ in range(sample_size):
            baseline = random.uniform(240, 480)
            smartbed = random.uniform(90, 180)
            
            baseline_times.append(baseline)
            smartbed_times.append(smartbed)
            
        def get_metrics(data: List[float]) -> Dict[str, float]:
            return {
                "average_minutes": round(statistics.mean(data), 2),
                "median_minutes": round(statistics.median(data), 2),
                "minimum_minutes": round(min(data), 2),
                "maximum_minutes": round(max(data), 2),
                "sample_size": len(data)
            }
            
        baseline_metrics = get_metrics(baseline_times)
        smartbed_metrics = get_metrics(smartbed_times)
        
        abs_time_saved = baseline_metrics["average_minutes"] - smartbed_metrics["average_minutes"]
        improvement_pct = (abs_time_saved / baseline_metrics["average_minutes"]) * 100 if baseline_metrics["average_minutes"] > 0 else 0
        
        return {
            "kpi": "Time to Next Safe Bed",
            "description": "Time from Clinical Discharge Readiness to Next Safe Bed Available",
            "baseline": baseline_metrics,
            "smartbed_flow": smartbed_metrics,
            "comparison": {
                "absolute_time_saved_minutes": round(abs_time_saved, 2),
                "improvement_percentage": round(improvement_pct, 2)
            }
        }
