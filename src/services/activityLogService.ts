import api from './apiService';

export interface ActivityLog {
  id: number;
  type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'settings' | 'api' | 'database' | 'error';
  user: string;
  user_id?: number;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failed' | 'warning';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogStats {
  total: number;
  today: number;
  yesterday: number;
  failed: number;
  failed_today: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  active_users: number;
}

export interface ActivityLogFilters {
  type?: string;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  per_page?: number;
  page?: number;
}

class ActivityLogService {
  private baseUrl = '/admin/activity-logs';

  /**
   * Get paginated activity logs with filters
   */
  async getLogs(filters: ActivityLogFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await api.get<{
      data: ActivityLog[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>(url);
    return response.data;
  }

  /**
   * Get activity log statistics
   */
  async getStats() {
    const response = await api.get<ActivityLogStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Get recent activity logs
   */
  async getRecent(limit: number = 20) {
    const response = await api.get<{
      data: ActivityLog[];
      count: number;
    }>(`${this.baseUrl}/recent?limit=${limit}`);
    return response.data;
  }

  /**
   * Get activity logs for a specific user
   */
  async getUserLogs(userId: number, page: number = 1, perPage: number = 20) {
    const response = await api.get<{
      data: ActivityLog[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>(`${this.baseUrl}/user/${userId}?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  /**
   * Create a new activity log
   */
  async createLog(data: {
    type: string;
    user: string;
    user_id?: number;
    action: string;
    description: string;
    status?: 'success' | 'failed' | 'warning';
    metadata?: Record<string, any>;
  }) {
    const response = await api.post<{
      message: string;
      data: ActivityLog;
    }>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Export activity logs
   */
  async exportLogs(filters: ActivityLogFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/export?${queryString}` : `${this.baseUrl}/export`;
    
    const response = await api.get<{
      data: any[];
      count: number;
    }>(url);
    return response.data;
  }

  /**
   * Clean up old activity logs
   */
  async cleanupOldLogs(days: number = 90) {
    const response = await api.delete<{
      message: string;
      deleted_count: number;
    }>(`${this.baseUrl}/cleanup?days=${days}`);
    return response.data;
  }

  /**
   * Subscribe to real-time activity log updates
   */
  subscribeToUpdates(callback: (log: ActivityLog) => void, intervalMs: number = 5000) {
    let lastCheckTime = new Date().toISOString();
    
    const checkForUpdates = async () => {
      try {
        const response = await this.getRecent(10);
        const newLogs = response.data.filter(log => log.created_at > lastCheckTime);
        
        if (newLogs.length > 0) {
          newLogs.reverse().forEach(callback); // Oldest first
          lastCheckTime = newLogs[newLogs.length - 1].created_at;
        }
      } catch (error) {
        console.error('Error checking for activity log updates:', error);
      }
    };

    const intervalId = setInterval(checkForUpdates, intervalMs);

    // Return unsubscribe function
    return () => clearInterval(intervalId);
  }
}

export const activityLogService = new ActivityLogService();
export default activityLogService;
