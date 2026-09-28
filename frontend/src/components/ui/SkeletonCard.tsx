import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 w-full animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};
