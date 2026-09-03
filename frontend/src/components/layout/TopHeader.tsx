import React from 'react';
import { Search, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Fake state to emulate what was requested - we would get these from real context/sockets
  const wsStatus = 'Live'; 

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
      
      {/* Left section: Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
            placeholder="Search patients, beds, tasks... (Ctrl+K)"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        
        {/* Status indicator */}
        <div className="hidden lg:flex items-center text-sm font-medium text-slate-600 mr-2">
          <span className="flex h-2 w-2 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
          </span>
          {wsStatus}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        {/* User profile dropdown / status */}
        <div className="flex items-center">
          <div className="flex flex-col items-end mr-3 hidden sm:flex">
            <span className="text-sm font-medium text-slate-900 leading-none mb-1">
              {user?.username || 'Guest'}
            </span>
            <span className="text-xs text-slate-500 font-medium leading-none">
              {user?.role?.name || 'Staff'} • Central Hospital
            </span>
          </div>
          <button className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500">
            <UserIcon className="h-4 w-4" />
          </button>
          
          <button 
            onClick={logout}
            className="ml-4 p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-full transition-colors focus:outline-none"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
