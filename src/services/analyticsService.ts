const API_BASE_URL = 'http://127.0.0.1:8000/api';

// TypeScript Interfaces
export interface OverviewStats {
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

export interface OverviewStatsResponse {
  success: boolean;
  data: OverviewStats;
}

export interface ActivitiesResponse {
  success: boolean;
  data: Activity[];
}

export interface ChartDataResponse {
  success: boolean;
  data: ChartDataPoint[];
}

class AnalyticsService {
  /**
   * Get dashboard overview statistics
   */
  async getOverviewStats(): Promise<OverviewStatsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/overview-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: unknown) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<ActivitiesResponse> {
    try {
      const url = `${API_BASE_URL}/dashboard/recent-activities?limit=${limit}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: unknown) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Get chart data for analytics
   */
  async getChartData(days: number = 7): Promise<ChartDataResponse> {
    try {
      const url = `${API_BASE_URL}/dashboard/chart-data?days=${days}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: unknown) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
      }
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
