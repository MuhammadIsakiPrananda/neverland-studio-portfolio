import { useEffect, useRef } from 'react';
import { authService } from '../services/authService';

/**
 * Hook to monitor user auth status and auto-logout if user is deleted
 * Checks every 10 seconds if current user still exists
 */
export function useAuthMonitor(onLogout: () => void) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Only check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return;
      }

      try {
        // Try to get current user from backend
        await authService.getCurrentUser();
        // User still exists and token is valid
      } catch (error: any) {
        // If 401 Unauthorized, user was deleted or token invalid
        if (error.response?.status === 401) {
          console.log('🚨 User deleted or token invalid - auto logout');
          
          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('currentUser');
          
          // Call logout callback
          onLogout();
        }
      }
    };

    // Check immediately on mount
    checkAuthStatus();

    // Then check every 10 seconds
    intervalRef.current = window.setInterval(checkAuthStatus, 10000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onLogout]);
}
