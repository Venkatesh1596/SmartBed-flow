const fs = require('fs');

const path = 'src/components/ControlTower.tsx';
let content = fs.readFileSync(path, 'utf8');

const startIndex = content.indexOf('const chartData = {');
const endIndex = content.indexOf('<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">');

if (startIndex !== -1 && endIndex !== -1) {
    const newMiddle = `const chartData = {
        labels: trends.map(t => t.date),
        datasets: [
            {
                label: 'Occupancy Rate (%)',
                data: trends.map(t => t.occupancy_rate),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Admissions',
                data: trends.map(t => t.admissions),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y1',
            },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Real-Time Operations Control Tower</h1>
                    <p className="text-sm text-gray-500 mt-1">Last Updated: {lastUpdated.toLocaleTimeString()}</p>
                </div>
                <button
                    onClick={loadData}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Refresh Now
                </button>
            </div>

            {/* WORKLOAD CTA */}
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                    <span className="text-2xl mr-4">⚖️</span>
                    <div>
                        <h3 className="text-md font-bold text-emerald-900">Intelligent Workload Prioritization</h3>
                        <p className="text-sm text-emerald-700">View priority boards, manage queues, and balance staff workload.</p>
                    </div>
                </div>
                <Link to="/workload" className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold border border-emerald-300 rounded shadow-sm hover:bg-emerald-100 transition-colors">
                    View Workload
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Hospital Status</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary?.hospital_status || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Occupancy</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary?.current_occupancy} / {summary?.total_capacity}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
                    <p className="text-2xl font-bold text-red-600">{summary?.active_alerts || 0}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Bottlenecks Detected</h3>
                    <p className="text-2xl font-bold text-orange-600">{summary?.bottlenecks_detected || 0}</p>
                </div>
            </div>

            `;
    const newContent = content.substring(0, startIndex) + newMiddle + content.substring(endIndex);
    fs.writeFileSync(path, newContent, 'utf8');
}
