def fix_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for o, n in replacements:
        content = content.replace(o, n)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = [
    ('summary.hospital_occupancy', 'summary.utilization_percent'),
    ('{summary.pending_admissions}', '{summary.pressure_score}'),
    ('Pending Admissions', 'Pressure Score'),
    ('{summary.planned_discharges}', '{summary.cleaning}'),
    ('Planned Discharges', 'Beds Cleaning'),
    ('summary.net_capacity_gap < 0', 'summary.available < 5'),
    ('summary.net_capacity_gap > 0', 'summary.available > 5'),
    ('summary.net_capacity_gap', 'summary.available'),
    ('Net Capacity Gap', 'Available Beds'),
    ('t.demand', 't.occupied'),
    ('t.supply', 't.available'),
    ('Demand', 'Occupied'),
    ('Supply', 'Available'),
    ('b.estimated_time_to_available', 'b.estimated_available_mins'),
    ('ward.occupancy_rate', 'ward.utilization'),
    ('p.department', 'p.trend'),
    ('status={p.level}', 'status={p.score > 80 ? "HIGH" : "NORMAL"}')
]

fix_file('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/CapacityPlanning.tsx', replacements)
