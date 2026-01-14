/**
 * Custom Hooks Index
 * 
 * Centralized exports for all custom React hooks.
 */

// Authentication hooks
export { useAuth, type UseAuthReturn } from './useAuth';
export { useAuthMonitor } from './useAuthMonitor';
export { useDashboardAuth } from './useDashboardAuth';

// Maintenance hook
export { useMaintenance, type UseMaintenanceReturn } from './useMaintenance';

// Real-time hooks
export { useRealtime } from './useRealtime';

// Performance hooks
export { usePerformance } from './usePerformance';

// UI hooks
export { useScrollReveal } from './useScrollReveal';
