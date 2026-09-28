import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-lg">
      <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="mt-2 text-sm text-red-600 text-center max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-6 flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </button>
      )}
    </div>
  );
};
