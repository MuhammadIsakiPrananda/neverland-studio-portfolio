import { useEffect } from 'react';
import { authService } from '../services/authService';
import { dashboardAuth } from '../services/dashboardAuth';

/**
 * Hook to ensure dashboard has valid API token
 * DISABLED - Users should logout and login via dashboard login page
 * Dashboard login page will handle backend authentication
 */
export function useDashboardAuth() {
  useEffect(() => {
    // Auto-login disabled - rely on manual dashboard login instead
    // This prevents issues with credentials mismatch
    
    // User should:
    // 1. Logout from dashboard 
    // 2. Login again with admin / admin123
    // 3. Dashboard login will handle both hardcoded auth and backend API token
  }, []);
}
