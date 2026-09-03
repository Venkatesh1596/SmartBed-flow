def fix_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for o, n in replacements:
        content = content.replace(o, n)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = [
    ("import { Line } from 'react-chartjs-2';", ""),
    ("const [performance, setPerformance] = useState<ControlTowerPerformance | null>(null);", ""),
    ("const [wards, setWards] = useState<ControlTowerWard[]>([]);", ""),
    ("const [trends, setTrends] = useState<ControlTowerTrend[]>([]);", ""),
    ("const [activity, setActivity] = useState<ControlTowerActivity[]>([]);", ""),
    ("setPerformance(perfData);", ""),
    ("setWards(wardData || []);", ""),
    ("setTrends(trendData || []);", ""),
    ("setActivity(actData || []);", "")
]
fix_file('c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/ControlTower.tsx', replacements)
