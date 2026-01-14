/**
 * Maintenance Mode Hook
 * 
 * Manages maintenance mode state and checking.
 */

import { useState, useEffect, useCallback } from 'react';
import { get } from '../services/core/apiClient';
import type { MaintenanceStatus } from '../types';

interface UseMaintenanceOptions {
    /**
     * Check interval in milliseconds
     * @default 30000 (30 seconds)
     */
    checkInterval?: number;

    /**
     * Enable automatic checking
     * @default true
     */
    autoCheck?: boolean;

    /**
     * Callback when maintenance mode changes
     */
    onChange?: (isActive: boolean) => void;
}

export interface UseMaintenanceReturn {
    /** Whether maintenance mode is active */
    isMaintenanceMode: boolean;

    /** Maintenance mode message */
    maintenanceMessage?: string;

    /** Estimated end time */
    estimatedEnd?: string;

    /** Whether check is in progress */
    isChecking: boolean;

    /** Manually check maintenance status */
    checkStatus: () => Promise<void>;

    /** Refresh maintenance status */
    refresh: () => Promise<void>;
}

/**
 * Hook to manage maintenance mode
 */
export function useMaintenance(options: UseMaintenanceOptions = {}): UseMaintenanceReturn {
    const {
        checkInterval = 30000,
        autoCheck = true,
        onChange,
    } = options;

    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState<string>();
    const [estimatedEnd, setEstimatedEnd] = useState<string>();
    const [isChecking, setIsChecking] = useState(false);

    /**
     * Check maintenance status
     */
    const checkStatus = useCallback(async (): Promise<void> => {
        if (isChecking) return;

        setIsChecking(true);

        try {
            const response = await get<MaintenanceStatus>('/maintenance/status', {
                timeout: 5000,
            });

            const wasActive = isMaintenanceMode;
            const isActive = response.data?.is_active || false;

            setIsMaintenanceMode(isActive);
            setMaintenanceMessage(response.data?.message);
            setEstimatedEnd(response.data?.estimated_end);

            // Trigger callback if status changed
            if (wasActive !== isActive && onChange) {
                onChange(isActive);
            }
        } catch (error) {
            // Silently fail - don't show errors for maintenance checks
            console.error('Maintenance check error:', error);
        } finally {
            setIsChecking(false);
        }
    }, [isMaintenanceMode, onChange, isChecking]);

    /**
     * Refresh status (alias for checkStatus)
     */
    const refresh = useCallback(async (): Promise<void> => {
        await checkStatus();
    }, [checkStatus]);

    /**
     * Setup automatic checking
     */
    useEffect(() => {
        if (!autoCheck) return;

        // Initial check
        checkStatus();

        // Setup interval
        const interval = setInterval(checkStatus, checkInterval);

        // Cleanup
        return () => {
            clearInterval(interval);
        };
    }, [autoCheck, checkInterval, checkStatus]);

    return {
        isMaintenanceMode,
        maintenanceMessage,
        estimatedEnd,
        isChecking,
        checkStatus,
        refresh,
    };
}

export default useMaintenance;
