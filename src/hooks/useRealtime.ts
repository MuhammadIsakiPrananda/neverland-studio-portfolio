import { useState, useEffect, useCallback, useRef } from 'react';
import { realtimeService } from '../services/realtimeService';

export interface UseRealtimeOptions {
  resource: string;
  intervalMs?: number;
  autoConnect?: boolean;
  onError?: (error: any) => void;
  onUpdate?: (data: any) => void;
}

export function useRealtime<T = any>({
  resource,
  intervalMs = 5000,
  autoConnect = true,
  onError,
  onUpdate,
}: UseRealtimeOptions) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);

  const handleUpdate = useCallback((newData: T) => {
    setData(newData);
    setIsLoading(false);
    setError(null);
    onUpdate?.(newData);
  }, [onUpdate]);

  const handleError = useCallback((err: any) => {
    setError(err);
    setIsLoading(false);
    onError?.(err);
  }, [onError]);

  const connect = useCallback(() => {
    if (unsubscribeRef.current) {
      return; // Already connected
    }

    setIsLoading(true);
    
    try {
      // Subscribe to data updates
      unsubscribeRef.current = realtimeService.subscribe(
        resource,
        handleUpdate,
        intervalMs
      );

      // Subscribe to connection status
      statusUnsubscribeRef.current = realtimeService.subscribeToStatus(
        setConnectionStatus
      );
    } catch (err) {
      handleError(err);
    }
  }, [resource, intervalMs, handleUpdate, handleError]);

  const disconnect = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (statusUnsubscribeRef.current) {
      statusUnsubscribeRef.current();
      statusUnsubscribeRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await realtimeService.refresh(resource);
    } catch (err) {
      handleError(err);
    }
  }, [resource, handleError]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    data,
    isLoading,
    error,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    connect,
    disconnect,
    refresh,
  };
}

// Specialized hook for dashboard stats
export function useRealtimeStats() {
  return useRealtime({
    resource: 'stats',
    intervalMs: 3000, // Update every 3 seconds for stats
    autoConnect: true,
  });
}

// Specialized hook for contacts
export function useRealtimeContacts() {
  return useRealtime({
    resource: 'contacts',
    intervalMs: 5000,
    autoConnect: true,
  });
}

// Specialized hook for users  
export function useRealtimeUsers() {
  return useRealtime({
    resource: 'users',
    intervalMs: 5000,
    autoConnect: true,
  });
}

// Specialized hook for enrollments
export function useRealtimeEnrollments() {
  return useRealtime({
    resource: 'enrollments',
    intervalMs: 5000,
    autoConnect: true,
  });
}

// Specialized hook for consultations
export function useRealtimeConsultations() {
  return useRealtime({
    resource: 'consultations',
    intervalMs: 5000,
    autoConnect: true,
  });
}

// Specialized hook for activity logs
export function useRealtimeActivityLogs() {
  return useRealtime({
    resource: 'activity-logs',
    intervalMs: 10000, // Update every 10 seconds
    autoConnect: true,
  });
}
