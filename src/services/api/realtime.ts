/**
 * Real-time API Service
 * 
 * Handles real-time updates, polling, and live data synchronization.
 */

import { get, handleApiError } from '../core/apiClient';
import type { DashboardStats, ActivityData, RealtimeData } from '../../types';

/**
 * Real-time Service
 */
export const realtimeApi = {
    /**
     * Get real-time dashboard data
     */
    async getRealtimeData(): Promise<RealtimeData> {
        try {
            const response = await get<RealtimeData>('/dashboard/realtime');
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Poll for updates (lightweight endpoint)
     */
    async pollUpdates(lastUpdated?: string): Promise<{
        has_updates: boolean;
        last_updated: string;
        stats?: Partial<DashboardStats>;
    }> {
        try {
            const params = lastUpdated ? { last_updated: lastUpdated } : {};
            const response = await get<{
                has_updates: boolean;
                last_updated: string;
                stats?: Partial<DashboardStats>;
            }>('/dashboard/poll', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get online users count
     */
    async getOnlineUsers(): Promise<number> {
        try {
            const response = await get<{ count: number }>('/dashboard/online-users');
            return response.data?.count || 0;
        } catch (error) {
            return 0; // Silently fail for online users
        }
    },
};

/**
 * Real-time Poller Class
 * Manages automatic polling with configurable intervals
 */
export class RealtimePoller {
    private interval: number;
    private callback: (data: RealtimeData) => void;
    private errorCallback?: (error: any) => void;
    private timer: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;
    private lastUpdated: string | null = null;

    constructor(
        callback: (data: RealtimeData) => void,
        interval: number = 5000,
        errorCallback?: (error: any) => void
    ) {
        this.callback = callback;
        this.interval = interval;
        this.errorCallback = errorCallback;
    }

    /**
     * Start polling
     */
    start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.poll(); // Initial poll

        this.timer = setInterval(() => {
            this.poll();
        }, this.interval);
    }

    /**
     * Stop polling
     */
    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isRunning = false;
    }

    /**
     * Update polling interval
     */
    setInterval(interval: number): void {
        this.interval = interval;
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }

    /**
     * Manual poll
     */
    private async poll(): Promise<void> {
        try {
            const data = await realtimeApi.getRealtimeData();
            this.lastUpdated = data.last_updated;
            this.callback(data);
        } catch (error) {
            if (this.errorCallback) {
                this.errorCallback(error);
            } else {
                console.error('Realtime poll error:', error);
            }
        }
    }

    /**
     * Check if poller is running
     */
    isPolling(): boolean {
        return this.isRunning;
    }
}

export default realtimeApi;
