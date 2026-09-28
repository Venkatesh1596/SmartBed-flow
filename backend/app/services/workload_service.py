from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
import uuid

from app.models.facility import Bed, Ward
from app.models.encounter import Encounter
from app.models.enums import BedState, EncounterStatus
from app.schemas.workload import (
    WorkloadItem, WorkloadSummary, WorkloadQueue, WorkloadQueueType,
    WorkloadPriority, WorkloadCategory, WorkloadRecommendation,
    WorkloadDistribution, WorkloadTrendPoint
)

def get_category(score: float) -> WorkloadCategory:
    if score >= 80:
        return WorkloadCategory.CRITICAL
    elif score >= 60:
        return WorkloadCategory.HIGH
    elif score >= 40:
        return WorkloadCategory.WATCH
    return WorkloadCategory.NORMAL

class WorkloadService:
    def __init__(self, db: Session):
        self.db = db

    def generate_priority(self, sla: float, capacity: float, workflow: float, cleaning: float, predictive: float, age: float) -> WorkloadPriority:
        score = (sla * 0.25) + (capacity * 0.20) + (workflow * 0.20) + (cleaning * 0.15) + (predictive * 0.10) + (age * 0.10)
        score = min(max(score, 0), 100)
        return WorkloadPriority(
            score=score,
            category=get_category(score),
            sla_component=sla,
            capacity_component=capacity,
            workflow_component=workflow,
            cleaning_component=cleaning,
            predictive_component=predictive,
            age_component=age
        )

    def _get_cleaning_items(self) -> list[WorkloadItem]:
        cleaning_beds = self.db.query(Bed).filter(Bed.state == BedState.CLEANING).all()
        items = []
        now = datetime.now(timezone.utc)
        for bed in cleaning_beds:
            # calculate age
            hours_in_state = 1
            age_score = min(hours_in_state * 10, 100)
            priority = self.generate_priority(
                sla=0, capacity=0, workflow=0, cleaning=100, predictive=0, age=age_score
            )
            items.append(WorkloadItem(
                id=f"clean_{bed.id}",
                queue_type=WorkloadQueueType.CLEANING,
                title=f"Clean Bed {bed.name}",
                description=f"Bed {bed.name} needs cleaning",
                priority=priority,
                created_at=now,
                metadata_data={"bed_id": bed.id, "ward_id": bed.ward_id}
            ))
        return items
        
    def _get_capacity_items(self) -> list[WorkloadItem]:
        wards = self.db.query(Ward).all()
        items = []
        now = datetime.now(timezone.utc)
        for ward in wards:
            total_beds = len(ward.beds)
            if total_beds == 0:
                continue
            available_beds = sum(1 for b in ward.beds if b.state == BedState.AVAILABLE)
            capacity_pressure = (1 - (available_beds / total_beds)) * 100
            if capacity_pressure >= 80:
                priority = self.generate_priority(
                    sla=0, capacity=capacity_pressure, workflow=0, cleaning=0, predictive=0, age=50
                )
                items.append(WorkloadItem(
                    id=f"cap_{ward.id}",
                    queue_type=WorkloadQueueType.CAPACITY,
                    title=f"Capacity Pressure in {ward.name}",
                    description=f"Ward {ward.name} has high capacity pressure",
                    priority=priority,
                    created_at=now,
                    metadata_data={"ward_id": ward.id}
                ))
        return items

    def _get_sla_items(self) -> list[WorkloadItem]:
        items = []
        return items
        
    def _get_workflow_items(self) -> list[WorkloadItem]:
        items = []
        return items
        
    def _get_predictive_items(self) -> list[WorkloadItem]:
        items = []
        return items

    def get_all_items(self) -> list[WorkloadItem]:
        items = []
        items.extend(self._get_cleaning_items())
        items.extend(self._get_capacity_items())
        items.extend(self._get_sla_items())
        items.extend(self._get_workflow_items())
        items.extend(self._get_predictive_items())
        items.sort(key=lambda x: x.priority.score, reverse=True)
        return items

    def get_summary(self) -> WorkloadSummary:
        items = self.get_all_items()
        total = len(items)
        from app.schemas.freshness import calculate_freshness
        freshness_info = calculate_freshness()
        
        if total == 0:
            return WorkloadSummary(total_items=0, critical_items=0, high_items=0, avg_priority=0, by_queue={}, **freshness_info)
            
        critical = sum(1 for i in items if i.priority.category == WorkloadCategory.CRITICAL)
        high = sum(1 for i in items if i.priority.category == WorkloadCategory.HIGH)
        avg = sum(i.priority.score for i in items) / total
        
        by_queue = {}
        for i in items:
            by_queue[i.queue_type.value] = by_queue.get(i.queue_type.value, 0) + 1
            
        return WorkloadSummary(
            total_items=total,
            critical_items=critical,
            high_items=high,
            avg_priority=avg,
            by_queue=by_queue,
            **freshness_info
        )
        
    def get_queues(self) -> list[WorkloadQueue]:
        items = self.get_all_items()
        queues = {}
        for qt in WorkloadQueueType:
            queues[qt] = []
        for i in items:
            queues[i.queue_type].append(i)
            
        result = []
        for qt, q_items in queues.items():
            count = len(q_items)
            avg = sum(i.priority.score for i in q_items) / count if count > 0 else 0
            max_p = max((i.priority.score for i in q_items), default=0)
            result.append(WorkloadQueue(
                queue_type=qt,
                item_count=count,
                avg_priority=avg,
                max_priority=max_p,
                items=q_items
            ))
        return result

    def get_distribution(self) -> WorkloadDistribution:
        items = self.get_all_items()
        cat_dist = {}
        q_dist = {}
        w_dist = {}
        for i in items:
            cat_dist[i.priority.category.value] = cat_dist.get(i.priority.category.value, 0) + 1
            q_dist[i.queue_type.value] = q_dist.get(i.queue_type.value, 0) + 1
            if "ward_id" in i.metadata_data:
                wid = str(i.metadata_data["ward_id"])
                w_dist[wid] = w_dist.get(wid, 0) + 1
        return WorkloadDistribution(by_category=cat_dist, by_queue=q_dist, by_ward=w_dist)

    def get_recommendations(self) -> list[WorkloadRecommendation]:
        items = self.get_all_items()
        recs = []
        for i in items:
            if i.priority.score >= 50:
                recs.append(WorkloadRecommendation(
                    id=f"rec_{i.id}",
                    action="Review and resolve",
                    target_id=i.id,
                    priority_score=i.priority.score,
                    description=f"Action needed for: {i.title}",
                    queue_type=i.queue_type
                ))
        return recs

    def get_trends(self) -> list[WorkloadTrendPoint]:
        summary = self.get_summary()
        return [WorkloadTrendPoint(
            timestamp=datetime.now(timezone.utc),
            total_items=summary.total_items,
            avg_priority=summary.avg_priority
        )]
