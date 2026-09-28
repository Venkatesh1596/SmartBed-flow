import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface PermissionDeniedProps {
  resourceName?: string;
  onGoBack?: () => void;
}

export const PermissionDenied: React.FC<PermissionDeniedProps> = ({
  resourceName = 'this section',
  onGoBack
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-lg shadow-sm">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
      <p className="text-slate-600 max-w-md mb-8">
        You don't have the necessary permissions to view {resourceName}. Please contact your system administrator if you believe this is an error.
      </p>
      {onGoBack && (
        <button 
          onClick={onGoBack}
          className="flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      )}
    </div>
  );
};
