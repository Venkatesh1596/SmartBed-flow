import React from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export type FreshnessState = 'FRESH' | 'AGING' | 'STALE' | 'MISSING';

interface FreshnessIndicatorProps {
  state: FreshnessState;
  lastUpdated?: string | Date;
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ 
  state, 
  lastUpdated 
}) => {
  const getMinutesAgo = (date: string | Date) => {
    const past = new Date(date).getTime();
    const now = new Date().getTime();
    return Math.floor((now - past) / 60000);
  };

  const minutes = lastUpdated ? getMinutesAgo(lastUpdated) : null;
  const timeText = minutes !== null 
    ? `Updated ${minutes === 0 ? 'just now' : `${minutes} min ago`}`
    : 'Never updated';

  const config = {
    FRESH: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
      label: 'Live'
    },
    AGING: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: <Clock className="h-3.5 w-3.5 mr-1.5" />,
      label: 'Aging'
    },
    STALE: {
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />,
      label: 'Stale'
    },
    MISSING: {
      color: 'text-slate-600 bg-slate-100 border-slate-200',
      icon: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
      label: 'No Data'
    }
  };

  const currentConfig = config[state] || config.MISSING;

  return (
    <div className="flex items-center space-x-3">
      <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${currentConfig.color}`}>
        {currentConfig.icon}
        {currentConfig.label}
      </div>
      <span className="text-xs text-slate-500 font-medium">
        {timeText}
      </span>
    </div>
  );
};
