import React from 'react';
import { FileQuestion, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon = <FileQuestion className="w-12 h-12 text-slate-300" />,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200 border-dashed ${className}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-danger-50 rounded-xl border border-danger-100 ${className}`}>
      <AlertCircle className="w-10 h-10 text-danger-500 mb-4" />
      <h3 className="text-lg font-semibold text-danger-900 mb-2">{title}</h3>
      <p className="text-sm text-danger-700 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white text-danger-700 text-sm font-medium rounded-md shadow-sm border border-danger-200 hover:bg-danger-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number, className?: string }> = ({ rows = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-200 rounded w-full"></div>
      ))}
    </div>
  );
};
