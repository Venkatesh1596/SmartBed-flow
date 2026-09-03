import { useEffect, useState } from 'react';
import { fetchUnreadNotificationCount } from './api/dashboardApi';
import NotificationCenter from './components/NotificationCenter';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import BedsList from './components/BedsList';
import EventsList from './components/EventsList';
import CommandCenter from './components/CommandCenter';
import AuditTrail from './components/AuditTrail';
import Reports from './components/Reports';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AdminDashboard from './components/AdminDashboard';
import CapacityPlanning from './components/CapacityPlanning';
import WorkflowOrchestration from './components/WorkflowOrchestration';
import PredictiveOperations from './components/PredictiveOperations';
import SimulationCenter from './components/SimulationCenter';
import ControlTower from './components/ControlTower';
import WorkloadPrioritization from './components/WorkloadPrioritization';
import FacilityBenchmarking from './components/FacilityBenchmarking';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

import Phase24Evaluation from './components/Phase24Evaluation';

function NavBar() {
    const { logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const count = await fetchUnreadNotificationCount();
                setUnreadCount(count);
            } catch (err) {
                console.error("Failed to fetch unread count", err);
            }
        };
        fetchCount();
        const intervalId = setInterval(fetchCount, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <nav className="bg-slate-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl">SmartBed</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8 overflow-x-auto">
                            <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link to="/evaluation" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium text-pink-300 hover:text-pink-100">
                                MVP Evaluation
                            </Link>
                            <Link to="/executive" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Executive
                            </Link>
                            <Link to="/control-tower" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Control Tower
                            </Link>
                            <Link to="/command-center" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Command Center
                            </Link>
                            <Link to="/audit" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Audit Trail
                            </Link>
                            <Link to="/beds" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Beds
                            </Link>
                            <Link to="/events" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Events
                            </Link>
                            <Link to="/capacity" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Capacity Planning
                            </Link>
                            <Link to="/orchestration" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Workflow
                            </Link>
                            <Link to="/predictive-operations" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium text-purple-300 hover:text-purple-100">
                                Predictive Ops
                            </Link>
                            <Link to="/simulation" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium text-orange-300 hover:text-orange-100">
                                Simulation
                            </Link>
                            <Link to="/reports" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">Reports</Link>
                            <Link to="/workload" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium text-emerald-300 hover:text-emerald-100">
                                Workload
                            </Link>
                            <Link to="/benchmarking" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium text-teal-300 hover:text-teal-100">
                                Benchmarking
                            </Link>
                            <Link to="/admin" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Admin
                            </Link>
                            <Link to="/notifications" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Notifications
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/capacity" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium whitespace-nowrap text-blue-300">Capacity Planning &rarr;</Link>
                        <Link to="/reports" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">Reports</Link>
                        <Link to="/notifications" className="relative p-1 text-slate-300 hover:text-white">
                            <span className="sr-only">View notifications</span>
                            <span className="text-xl">ðŸ””</span>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-center text-[10px] font-bold leading-4 text-white transform translate-x-1/2 -translate-y-1/4">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={logout} className="text-sm font-medium hover:text-slate-300">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function Sidebar() {
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
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                  <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/beds" element={
            <ProtectedRoute>
              <Layout>
                  <BedsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Layout>
                  <EventsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/control-tower" element={
            <ProtectedRoute>
              <Layout>
                  <ControlTower />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/command-center" element={
            <ProtectedRoute>
              <Layout>
                  <CommandCenter />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/audit" element={
            <ProtectedRoute>
              <Layout>
                  <AuditTrail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Layout>
                  <NotificationCenter />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/executive" element={
            <ProtectedRoute>
              <Layout>
                  <ExecutiveDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/evaluation" element={
            <ProtectedRoute>
              <Layout>
                  <Phase24Evaluation />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/capacity" element={<ProtectedRoute><Layout><CapacityPlanning /></Layout></ProtectedRoute>} />
          <Route path="/orchestration" element={<ProtectedRoute><Layout><WorkflowOrchestration /></Layout></ProtectedRoute>} />
          <Route path="/predictive-operations" element={<ProtectedRoute><Layout><PredictiveOperations /></Layout></ProtectedRoute>} />
          <Route path="/simulation" element={<ProtectedRoute><Layout><SimulationCenter /></Layout></ProtectedRoute>} />
          <Route path="/workload" element={<ProtectedRoute><Layout><WorkloadPrioritization /></Layout></ProtectedRoute>} />
          <Route path="/benchmarking" element={<ProtectedRoute><Layout><FacilityBenchmarking /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
