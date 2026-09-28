import React from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ErrorBoundary } from '../ErrorBoundary';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
        <TopHeader />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar bg-slate-50/50">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full h-full">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>

    </div>
  );
};
