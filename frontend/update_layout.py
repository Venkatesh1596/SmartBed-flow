import re
import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The layout rewrite to support a vertical sidebar
new_layout = """function Sidebar() {
    const { logout, user } = useAuth();
    // In a real app we'd get unreadCount from context, for now 0 or omit
    const unreadCount = 0;

    const links = [
        { to: "/", label: "Dashboard", roles: [] },
        { to: "/capacity", label: "Capacity Planning", roles: [] },
        { to: "/admission", label: "Admission", roles: [] },
        { to: "/beds", label: "Beds", roles: [] },
        { to: "/evs", label: "EVS", roles: [] },
        { to: "/transport", label: "Transport", roles: [] },
        { to: "/equipment", label: "Equipment", roles: [] },
        { to: "/handover", label: "Handover", roles: [] },
        { to: "/analytics", label: "Analytics", roles: [] },
        { to: "/events", label: "Events", roles: [] },
        { to: "/control-tower", label: "Control Tower", roles: [] },
        { to: "/command-center", label: "Command Center", roles: [] },
        { to: "/orchestration", label: "Workflow Orchestration", roles: [] },
        { to: "/workload", label: "Workload Prioritization", roles: [] },
        { to: "/audit", label: "Audit Trail", roles: [] },
        { to: "/reports", label: "Reports", roles: [] },
        { to: "/evaluation", label: "MVP Evaluation", roles: [] },
        { to: "/executive", label: "Executive Board", roles: [] },
        { to: "/predictive-operations", label: "Predictive Ops", roles: [] },
        { to: "/simulation", label: "Simulation", roles: [] },
        { to: "/benchmarking", label: "Benchmarking", roles: [] },
        { to: "/notifications", label: "Notifications", roles: [] },
        { to: "/admin", label: "Admin", roles: [] },
    ];

    return (
        <div className="flex h-screen bg-slate-900 w-64 flex-col text-slate-300 flex-shrink-0">
            <div className="flex h-16 items-center px-4 font-bold text-lg text-white bg-slate-950 border-b border-slate-800 shrink-0">
                SmartBed Flow
            </div>
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <nav className="space-y-1 px-2">
                    {links.map((link) => (
                        <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
                <div className="text-sm truncate mb-2">User: {user?.username || 'Guest'}</div>
                <button onClick={logout} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300">
                    Logout
                </button>
            </div>
        </div>
    );
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                {children}
            </div>
        </div>
    );
}
"""

content = re.sub(r'function NavBar\(\) \{.*?(?=function Layout\(\) \{)', '', content, flags=re.DOTALL)
content = re.sub(r'function Layout\(\{ children \}: \{ children: React.ReactNode \}\) \{.*?(?=function App\(\) \{)', new_layout, content, flags=re.DOTALL)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.tsx layout!")
