import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const containerClasses = fullScreen 
    ? 'flex flex-col items-center justify-center min-h-screen bg-slate-50'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={containerClasses}>
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      {message && <p className="mt-4 text-slate-600 font-medium">{message}</p>}
    </div>
  );
};
