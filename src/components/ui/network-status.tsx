
import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';

export const NetworkStatus: React.FC = () => {
  const { isOnline, isReconnecting } = useNetworkStatus();

  if (isOnline && !isReconnecting) {
    return null;
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2",
      isOnline 
        ? "bg-green-100 text-green-800 border border-green-200" 
        : "bg-red-100 text-red-800 border border-red-200"
    )}>
      {isReconnecting ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Reconnecting...</span>
        </>
      ) : isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>No connection</span>
        </>
      )}
    </div>
  );
};
