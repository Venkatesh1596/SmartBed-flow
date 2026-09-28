import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-4">
                  <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <div className={`h-4 bg-slate-200 rounded animate-pulse ${
                      colIndex === 0 ? 'w-32' : 'w-20'
                    }`}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
