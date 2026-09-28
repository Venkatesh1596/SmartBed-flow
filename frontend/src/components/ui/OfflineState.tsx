import React from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg border border-slate-200">
      <WifiOff className="h-12 w-12 text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900">You are offline</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Please check your internet connection. The application will automatically reconnect when the connection is restored.
      </p>
    </div>
  );
};
