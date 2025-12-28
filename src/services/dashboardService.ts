import api from './apiService';

export interface DashboardStats {
  users: {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
  };
  contacts: {
    total: number;
    new: number;
    today: number;
  };
  enrollments: {
    total: number;
    pending: number;
    approved: number;
    today: number;
  };
  consultations: {
    total: number;
    pending: number;
    scheduled: number;
    today: number;
  };
  newsletters: {
    total: number;
    today: number;
  };
  logins: {
    total: number;
    today: number;
    failed_today: number;
  };
}

export interface Activity {
  id: number;
  type: 'contact' | 'enrollment' | 'consultation' | 'newsletter';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface ChartDataPoint {
  date: string;
  contacts: number;
  enrollments: number;
  consultations: number;
  logins: number;
}

const dashboardService = {
  /**
   * Get dashboard overview statistics - REAL-TIME from backend
   */
  async getOverviewStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/dashboard/overview-stats', {
        timeout: 8000 // 8 second timeout
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching overview stats:', error);
      throw error;
    }
  },

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const response = await api.get('/dashboard/recent-activities', {
        params: { limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  /**
   * Get chart data for analytics
   */
  async getChartData(days: number = 7): Promise<ChartDataPoint[]> {
    try {
      const response = await api.get('/dashboard/chart-data', {
        params: { days }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  /**
   * Subscribe to real-time updates
   */
  subscribeToUpdates(callback: () => void): () => void {
    return simulator.subscribe(callback);
  }
};

export default dashboardService;
