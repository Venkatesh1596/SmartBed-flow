import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface StaleDataBannerProps {
  lastUpdated?: string | Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const StaleDataBanner: React.FC<StaleDataBannerProps> = ({
  lastUpdated,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md shadow-sm mb-4">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">
              Data might be stale
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              The information shown may not reflect the latest changes. 
              {lastUpdated && ` Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded hover:bg-amber-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        )}
      </div>
    </div>
  );
};
