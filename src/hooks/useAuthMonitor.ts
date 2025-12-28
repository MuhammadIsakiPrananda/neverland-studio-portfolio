import { useEffect, useRef } from 'react';
import { authService } from '../services/authService';

/**
 * Hook to monitor user auth status and auto-logout if user is deleted
 * Checks every 60 seconds if current user still exists
 */
export function useAuthMonitor(onLogout: () => void) {
  const intervalRef = useRef<number | null>(null);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Only check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return;
      }

      // Prevent multiple simultaneous checks
      if (isCheckingRef.current) {
        return;
      }

      isCheckingRef.current = true;

      try {
        // Try to get current user from backend
        const user = await authService.getCurrentUser();
        
        // If user is null but we have a token, might be a network issue
        // Don't auto-logout on network errors
        if (user === null) {
          // Token might be invalid, check one more time
          const retryUser = await authService.getCurrentUser();
          if (retryUser === null) {
            console.log('🚨 User session invalid - auto logout');
            
            // Clear auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            
            // Call logout callback
            onLogout();
          }
        }
        // User still exists and token is valid
      } catch (error: any) {
        // Only logout on 401 Unauthorized, not on timeout or network errors
        if (error.response?.status === 401) {
          console.log('🚨 User deleted or token invalid - auto logout');
          
          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('currentUser');
          
          // Call logout callback
          onLogout();
        }
        // Ignore timeout and network errors - don't logout
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Check immediately on mount
    checkAuthStatus();

    // Then check every 60 seconds (reduced from 10s to reduce load)
    intervalRef.current = window.setInterval(checkAuthStatus, 60000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onLogout]);
}
