/**
 * Consolidated Authentication Hook
 * 
 * Comprehensive authentication management including:
 * - Auth status monitoring
 * - Auto-logout on token expiration
 * - Session validation
 * - User state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '../services/api';
import type { User } from '../types';

interface UseAuthOptions {
    /**
     * Enable automatic session validation
     * @default true
     */
    enableMonitoring?: boolean;

    /**
     * Monitoring interval in milliseconds
     * @default 60000 (60 seconds)
     */
    monitoringInterval?: number;

    /**
     * Callback when user is logged out
     */
    onLogout?: () => void;

    /**
     * Callback when authentication error occurs
     */
    onError?: (error: any) => void;
}

export interface UseAuthReturn {
    /** Current authenticated user */
    user: User | null;

    /** Whether user is authenticated */
    isAuthenticated: boolean;

    /** Whether authentication is being checked */
    isLoading: boolean;

    /** Login function */
    login: (email: string, password: string, remember?: boolean) => Promise<void>;

    /** Logout function */
    logout: () => Promise<void>;

    /** Refresh user data */
    refreshUser: () => Promise<void>;

    /** Check if session is valid */
    validateSession: () => Promise<boolean>;
}

/**
 * Consolidated Authentication Hook
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
    const {
        enableMonitoring = true,
        monitoringInterval = 60000,
        onLogout,
        onError,
    } = options;

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isCheckingRef = useRef(false);
    const isMountedRef = useRef(true);

    /**
     * Validate current session
     */
    const validateSession = useCallback(async (): Promise<boolean> => {
        // Prevent multiple simultaneous checks
        if (isCheckingRef.current || !isMountedRef.current) {
            return false;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            return false;
        }

        isCheckingRef.current = true;

        try {
            const currentUser = await authApi.getCurrentUser();

            if (currentUser && isMountedRef.current) {
                setUser(currentUser);
                setIsAuthenticated(true);
                return true;
            } else {
                // User not found - invalid session
                if (isMountedRef.current) {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                return false;
            }
        } catch (error: any) {
            // Only mark as unauthenticated on 401
            if (error.status === 401) {
                if (isMountedRef.current) {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                return false;
            }

            // Network errors - don't change auth state
            if (onError) {
                onError(error);
            }
            return isAuthenticated; // Return current state
        } finally {
            isCheckingRef.current = false;
        }
    }, [isAuthenticated, onError]);

    /**
     * Refresh user data
     */
    const refreshUser = useCallback(async (): Promise<void> => {
        await validateSession();
    }, [validateSession]);

    /**
     * Login function
     */
    const login = useCallback(async (
        email: string,
        password: string,
        remember: boolean = false
    ): Promise<void> => {
        try {
            const response = await authApi.login({ email, password, remember });

            if (isMountedRef.current) {
                setUser(response.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            if (onError) {
                onError(error);
            }
            throw error;
        }
    }, [onError]);

    /**
     * Logout function
     */
    const logout = useCallback(async (): Promise<void> => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            if (isMountedRef.current) {
                setUser(null);
                setIsAuthenticated(false);
            }

            if (onLogout) {
                onLogout();
            }
        }
    }, [onLogout]);

    /**
     * Initialize and monitor authentication
     */
    useEffect(() => {
        // Initial check
        const initialize = async () => {
            const storedUser = authApi.getStoredUser();

            if (storedUser) {
                setUser(storedUser);
                setIsAuthenticated(true);

                // Validate with backend if monitoring is enabled
                if (enableMonitoring) {
                    await validateSession();
                }
            }

            setIsLoading(false);
        };

        initialize();

        // Setup monitoring interval
        if (enableMonitoring && isAuthenticated) {
            intervalRef.current = setInterval(() => {
                validateSession();
            }, monitoringInterval);
        }

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enableMonitoring, monitoringInterval, validateSession, isAuthenticated]);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
        validateSession,
    };
}

export default useAuth;
