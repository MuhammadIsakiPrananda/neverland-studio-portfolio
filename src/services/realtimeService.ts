import api from './apiService';
import { showInfo } from '../components/common/ModernNotification';

export interface RealtimeStats {
  users: {
    total: number;
    online: number;
    new_today: number;
  };
  contacts: {
    total: number;
    new: number;
    unread: number;
  };
  enrollments: {
    total: number;
    pending: number;
    new_today: number;
  };
  consultations: {
    total: number;
    pending: number;
    new_today: number;
  };
  newsletters: {
    total: number;
    new_today: number;
  };
  activity_logs: {
    total: number;
    today: number;
    last_activity: string;
  };
}

export interface RealtimeUpdate {
  type: 'contact' | 'enrollment' | 'consultation' | 'newsletter' | 'user' | 'activity';
  action: 'created' | 'updated' | 'deleted';
  data: any;
  timestamp: string;
}

class RealtimeService {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private statusSubscribers: Set<(status: string) => void> = new Set();
  private lastUpdate: Map<string, Date> = new Map();
  
  /**
   * Subscribe to real-time updates for a specific resource
   */
  subscribe(resource: string, callback: (data: any) => void, intervalMs: number = 5000) {
    // Add subscriber
    if (!this.subscribers.has(resource)) {
      this.subscribers.set(resource, new Set());
    }
    this.subscribers.get(resource)!.add(callback);

    // Start polling if not already polling
    if (!this.intervals.has(resource)) {
      this.startPolling(resource, intervalMs);
    }

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(resource);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.stopPolling(resource);
        }
      }
    };
  }

  /**
   * Subscribe to connection status changes
   */
  subscribeToStatus(callback: (status: string) => void) {
    this.statusSubscribers.add(callback);
    callback(this.connectionStatus);
    
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  /**
   * Get all real-time statistics
   */
  async getRealtimeStats(): Promise<RealtimeStats> {
    try {
      const response = await api.get<RealtimeStats>('/admin/realtime/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch realtime stats:', error);
      throw error;
    }
  }

  /**
   * Start polling for a resource
   */
  private startPolling(resource: string, intervalMs: number) {
    this.setConnectionStatus('connecting');
    
    const poll = async () => {
      try {
        let data;
        
        switch (resource) {
          case 'stats':
            data = await this.getRealtimeStats();
            break;
          case 'contacts':
            const contactsRes = await api.get('/admin/contacts');
            data = contactsRes.data;
            break;
          case 'enrollments':
            const enrollmentsRes = await api.get('/admin/enrollments');
            data = enrollmentsRes.data;
            break;
          case 'consultations':
            const consultationsRes = await api.get('/admin/consultations');
            data = consultationsRes.data;
            break;
          case 'users':
            const usersRes = await api.get('/admin/users');
            data = usersRes.data;
            break;
          case 'newsletters':
            const newslettersRes = await api.get('/admin/newsletters');
            data = newslettersRes.data;
            break;
          case 'projects':
            const projectsRes = await api.get('/admin/projects');
            data = projectsRes.data;
            break;
          case 'activity-logs':
            const logsRes = await api.get('/admin/activity-logs/recent?limit=10');
            data = logsRes.data;
            break;
          default:
            return;
        }

        // Update last update time
        this.lastUpdate.set(resource, new Date());
        
        // Set connected status
        this.setConnectionStatus('connected');
        
        // Notify subscribers
        const subscribers = this.subscribers.get(resource);
        if (subscribers) {
          subscribers.forEach(callback => callback(data));
        }
      } catch (error) {
        console.error(`Polling error for ${resource}:`, error);
        this.setConnectionStatus('disconnected');
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const interval = setInterval(poll, intervalMs);
    this.intervals.set(resource, interval);
  }

  /**
   * Stop polling for a resource
   */
  private stopPolling(resource: string) {
    const interval = this.intervals.get(resource);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(resource);
    }
    this.subscribers.delete(resource);
    this.lastUpdate.delete(resource);
  }

  /**
   * Set connection status
   */
  private setConnectionStatus(status: 'connected' | 'disconnected' | 'connecting') {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.statusSubscribers.forEach(callback => callback(status));
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  /**
   * Get last update time for a resource
   */
  getLastUpdateTime(resource: string): Date | null {
    return this.lastUpdate.get(resource) || null;
  }

  /**
   * Force refresh a resource
   */
  async refresh(resource: string) {
    this.stopPolling(resource);
    const subscribers = this.subscribers.get(resource);
    if (subscribers && subscribers.size > 0) {
      this.startPolling(resource, 5000);
    }
  }

  /**
   * Stop all polling
   */
  disconnect() {
    this.intervals.forEach((interval, resource) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    this.subscribers.clear();
    this.lastUpdate.clear();
    this.setConnectionStatus('disconnected');
  }

  /**
   * Check if resource is being monitored
   */
  isMonitoring(resource: string): boolean {
    return this.intervals.has(resource);
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
