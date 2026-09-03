import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  BedDouble, 
  CheckSquare, 
  Sparkles, 
  Activity, 
  CalendarClock, 
  LineChart,
  Target,
  MonitorPlay,
  Box,
  Network,
  Settings,
  BellRing,
  ClipboardList,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarGroup {
  title: string;
  items: {
    to: string;
    label: string;
    icon: React.ReactNode;
    roles?: string[];
  }[];
}

const navGroups: SidebarGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { to: '/executive', label: 'Executive', icon: <Target size={18} /> },
      { to: '/control-tower', label: 'Control Tower', icon: <MonitorPlay size={18} /> },
      { to: '/command-center', label: 'Command Center', icon: <Activity size={18} /> },
    ]
  },
  {
    title: 'PATIENT FLOW',
    items: [
      { to: '/beds', label: 'Beds', icon: <BedDouble size={18} /> },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { to: '/capacity', label: 'Capacity', icon: <LineChart size={18} /> },
      { to: '/events', label: 'Events', icon: <CalendarClock size={18} /> },
      { to: '/notifications', label: 'Notifications', icon: <BellRing size={18} /> },
      { to: '/orchestration', label: 'Orchestration', icon: <Sparkles size={18} /> },
      { to: '/workload', label: 'Workload', icon: <ClipboardList size={18} /> },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { to: '/predictive-operations', label: 'Predictive Ops', icon: <TrendingDown size={18} /> },
      { to: '/evaluation', label: 'MVP Evaluation', icon: <ShieldCheck size={18} /> },
      { to: '/simulation', label: 'Simulation', icon: <Box size={18} /> },
    ]
  },
  {
    title: 'ENTERPRISE',
    items: [
      { to: '/reports', label: 'Reports', icon: <BarChart3 size={18} /> },
      { to: '/benchmarking', label: 'Benchmarking', icon: <Network size={18} /> },
      { to: '/audit', label: 'Audit Trail', icon: <CheckSquare size={18} /> },
      { to: '/admin', label: 'Admin', icon: <Settings size={18} /> },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role?.name;

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen flex-shrink-0 transition-all duration-300">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 bg-slate-950">
        <div className="flex items-center gap-2 text-white">
          <Activity className="h-6 w-6 text-primary-500" />
          <span className="font-bold text-lg tracking-tight">SmartBed <span className="font-light opacity-80">FLOW</span></span>
        </div>
      </div>

      {/* Facility Context */}
      <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 shrink-0">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Central Hospital</div>
        <div className="flex items-center text-xs font-medium text-success-400">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
          </span>
          Operations Center
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="px-3 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => {
                // Skip rendering if user doesn't have role (basic check, full RBAC is handled by ProtectedRoute)
                if (item.roles && userRole && !item.roles.includes(userRole)) {
                  // For now, render all to preserve existing navigation, backend enforces access
                }
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-600/10 text-primary-400'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer minimal info */}
      <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-950">
        <div className="text-xs text-slate-500 text-center">
          SmartBed Flow OS v2.4
        </div>
      </div>

    </div>
  );
};
