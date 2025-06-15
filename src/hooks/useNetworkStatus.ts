
import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
    };

    const handleReconnecting = () => {
      setIsReconnecting(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for Supabase connection events
    const reconnectTimer = setInterval(() => {
      if (!navigator.onLine && isOnline) {
        setIsOnline(false);
      } else if (navigator.onLine && !isOnline) {
        handleReconnecting();
        setTimeout(() => setIsOnline(true), 1000);
      }
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(reconnectTimer);
    };
  }, [isOnline]);

  return { isOnline, isReconnecting };
};
