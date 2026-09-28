import React from 'react';
import { Search, Bell, User as UserIcon, LogOut, Settings, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  
  const wsStatus = 'Operational'; 

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 shadow-sm relative">
      
      {/* Left section: Global Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-xl hidden md:flex items-center group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm transition-all shadow-inner"
            placeholder="Search patients, beds, tasks, equipment..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="flex items-center text-slate-400 text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              <Command className="h-3 w-3 mr-0.5" /> K
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-5">
        
        {/* Status indicator */}
        <div className="hidden lg:flex flex-col items-end mr-2">
          <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="flex h-1.5 w-1.5 relative mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            {wsStatus}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
            <Settings className="h-5 w-5" />
          </button>
          <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User profile */}
        <div className="flex items-center">
          <div className="flex flex-col items-end mr-3 hidden sm:flex">
            <span className="text-sm font-semibold text-slate-900 leading-none mb-1">
              {user?.username || 'Guest'}
            </span>
            <span className="text-xs text-slate-500 font-medium leading-none">
              {user?.role?.name || 'Administrator'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
            <UserIcon className="h-5 w-5" />
          </div>
          
          <button 
            onClick={logout}
            className="ml-3 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors focus:outline-none"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
