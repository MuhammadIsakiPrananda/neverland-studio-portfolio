import api from './apiService';
import { showInfo } from '../components/common/ModernNotification';

export interface RealtimeStats {
  users: {
    total: number;
    today: number;
    online?: number;
    new_this_hour?: number;
  };
  contacts: {
    total: number;
    new: number;
    unread: number;
    today?: number;
    in_progress?: number;
    resolved?: number;
  };
  enrollments: {
    total: number;
    pending: number;
    confirmed?: number;
    completed?: number;
    cancelled?: number;
    today?: number;
    this_week?: number;
  };
  consultations: {
    total: number;
    pending: number;
    scheduled?: number;
    contacted?: number;
    in_progress?: number;
    completed?: number;
    cancelled?: number;
    today?: number;
  };
  newsletters: {
    total: number;
    active?: number;
    today?: number;
    this_month?: number;
  };
  logins?: {
    total: number;
    today: number;
    failed_today?: number;
  };
  activity?: any;
  system?: any;
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
      const response = await api.get<RealtimeStats>('/admin/realtime/stats', {
        timeout: 10000 // Shorter timeout for realtime stats
      });
      return response.data;
    } catch (error: any) {
      // Only log non-timeout errors
      if (error.code !== 'ECONNABORTED') {
        console.error('Failed to fetch realtime stats:', error);
      }
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
            console.log('📡 [RealtimeService] Fetching enrollments...');
            const enrollmentsRes = await api.get('/admin/enrollments?per_page=1000');
            console.log('📥 [RealtimeService] Raw enrollments response:', enrollmentsRes.data);
            
            // Handle Laravel paginated response
            if (enrollmentsRes.data?.success && enrollmentsRes.data.data) {
              const enrollData = enrollmentsRes.data.data;
              // Check if paginated (has 'data' property)
              data = (enrollData && typeof enrollData === 'object' && 'data' in enrollData) 
                ? (Array.isArray(enrollData.data) ? enrollData.data : []) 
                : (Array.isArray(enrollData) ? enrollData : []);
              
              console.log('✅ [RealtimeService] Extracted', data.length, 'enrollments');
            } else {
              data = [];
              console.log('⚠️ [RealtimeService] No enrollments data found');
            }
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
