import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Theme } from '../../types';
import {
  TrendingUp,
  Users,
  Mail,
  BookOpen,
  Calendar,
  Activity,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Radio,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  analyticsService,
  type OverviewStats,
  type Activity as ActivityType,
  type ChartDataPoint,
} from '../../services/analyticsService';
import { showError, showSuccess, showInfo } from '../common/ModernNotification';
import realtimeService, { type RealtimeStats } from '../../services/realtimeService';

interface AnalyticsProps {
  theme: Theme;
}

const Analytics: React.FC<AnalyticsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  // Convert RealtimeStats to OverviewStats
  const convertRealtimeToOverview = useCallback((realtimeStats: RealtimeStats): OverviewStats => {
    return {
      users: {
        total: realtimeStats.users.total,
        today: realtimeStats.users.today,
        this_week: 0, // Not available in realtime stats
        this_month: 0, // Not available in realtime stats
      },
      contacts: {
        total: realtimeStats.contacts.total,
        new: realtimeStats.contacts.new,
        today: realtimeStats.contacts.today || 0,
      },
      enrollments: {
        total: realtimeStats.enrollments.total,
        pending: realtimeStats.enrollments.pending,
        confirmed: realtimeStats.enrollments.confirmed || 0,
        completed: realtimeStats.enrollments.completed || 0,
        today: realtimeStats.enrollments.today || 0,
      },
      consultations: {
        total: realtimeStats.consultations.total,
        pending: realtimeStats.consultations.pending,
        scheduled: realtimeStats.consultations.scheduled || 0,
        today: realtimeStats.consultations.today || 0,
      },
      newsletters: {
        total: realtimeStats.newsletters.total,
        today: realtimeStats.newsletters.today || 0,
      },
      logins: {
        total: realtimeStats.logins?.total || 0,
        today: realtimeStats.logins?.today || 0,
        failed_today: realtimeStats.logins?.failed_today || 0,
      },
    };
  }, []);

  // Fetch all data
  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setRefreshing(true);
    try {
      const [statsRes, activitiesRes, chartRes] = await Promise.all([
        analyticsService.getOverviewStats(),
        analyticsService.getRecentActivities(10),
        analyticsService.getChartData(timeRange),
      ]);

      setStats(statsRes.data);
      setActivities(activitiesRes.data);
      setChartData(chartRes.data);
      setLastUpdated(new Date());
      setCountdown(30);
    } catch (error: unknown) {
      const err = error as Error;
      showError('Error', err.message || 'Failed to fetch analytics data');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!autoRefresh) {
      // Clean up real-time when auto-refresh is disabled
      realtimeService.disconnect();
      setIsRealtimeActive(false);
      return;
    }

    setIsRealtimeActive(true);

    // Subscribe to connection status
    const unsubscribeStatus = realtimeService.subscribeToStatus((status) => {
      setConnectionStatus(status);
    });

    // Subscribe to real-time stats updates
    const unsubscribeStats = realtimeService.subscribe(
      'stats',
      (realtimeStats: RealtimeStats) => {
        const convertedStats = convertRealtimeToOverview(realtimeStats);
        setStats(convertedStats);
        setLastUpdated(new Date());
        setCountdown(30);
      },
      5000 // Update every 5 seconds
    );

    // Subscribe to activity logs
    const unsubscribeActivities = realtimeService.subscribe(
      'activity-logs',
      (data: any) => {
        if (data && Array.isArray(data)) {
          // Map activity logs to Activity format
          const mappedActivities: ActivityType[] = data.slice(0, 10).map((log: any) => ({
            id: log.id,
            type: log.type || 'contact',
            title: log.description || 'Activity',
            description: log.details || '',
            timestamp: log.created_at || new Date().toISOString(),
            status: log.status || 'new',
          }));
          setActivities(mappedActivities);
        }
      },
      5000
    );

    return () => {
      unsubscribeStatus();
      unsubscribeStats();
      unsubscribeActivities();
      realtimeService.disconnect();
      setIsRealtimeActive(false);
    };
  }, [autoRefresh, convertRealtimeToOverview]);

  // Fetch chart data separately (not real-time)
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const chartRes = await analyticsService.getChartData(timeRange);
        setChartData(chartRes.data);
      } catch (error) {
        console.error('Chart data error:', error);
      }
    };

    fetchChartData();
    // Refresh chart data every 30 seconds
    const interval = setInterval(fetchChartData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  // Countdown for next refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force refresh real-time data
      await realtimeService.refresh('stats');
      await realtimeService.refresh('activity-logs');
      
      // Also refresh chart data
      const chartRes = await analyticsService.getChartData(timeRange);
      setChartData(chartRes.data);
      
      setLastUpdated(new Date());
      setCountdown(30);
      showSuccess('Success', 'Analytics data refreshed');
    } catch (error) {
      showError('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle auto-refresh
  const handleToggleAutoRefresh = () => {
    const newState = !autoRefresh;
    setAutoRefresh(newState);
    
    if (newState) {
      showInfo('Real-time Active', 'Analytics data will update automatically');
    } else {
      showInfo('Real-time Disabled', 'Switch to manual refresh mode');
    }
  };

  // Get connection status indicator
  const getConnectionIndicator = () => {
    if (connectionStatus === 'connected') {
      return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
          isDark
            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
            : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          <Radio className="w-3 h-3 animate-pulse" />
          Connected
        </div>
      );
    } else if (connectionStatus === 'connecting') {
      return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
          isDark
            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          <Loader2 className="w-3 h-3 animate-spin" />
          Connecting
        </div>
      );
    } else {
      return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
          isDark
            ? 'bg-red-500/20 text-red-300 border border-red-400/30'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <XCircle className="w-3 h-3" />
          Disconnected
        </div>
      );
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Mail className="w-5 h-5" />;
      case 'enrollment':
        return <BookOpen className="w-5 h-5" />;
      case 'consultation':
        return <Calendar className="w-5 h-5" />;
      case 'newsletter':
        return <Activity className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
            isDark ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : 'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
      case 'pending':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
            isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}>
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'confirmed':
      case 'completed':
      case 'subscribed':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
            isDark ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-green-100 text-green-800 border-green-200'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      case 'scheduled':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
            isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' : 'bg-cyan-100 text-cyan-800 border-cyan-200'
          }`}>
            <Calendar className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
            isDark ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : 'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  // Chart colors
  const COLORS = {
    contacts: '#3b82f6',
    enrollments: '#10b981',
    consultations: '#f59e0b',
    logins: '#8b5cf6',
  };

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Contacts', value: stats.contacts.total, color: COLORS.contacts },
      { name: 'Enrollments', value: stats.enrollments.total, color: COLORS.enrollments },
      { name: 'Consultations', value: stats.consultations.total, color: COLORS.consultations },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-amber-400' : 'text-stone-900'}`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Analytics Dashboard
            </h2>
            {isRealtimeActive && getConnectionIndicator()}
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
            {isRealtimeActive ? 'Real-time insights and statistics' : 'Manual refresh mode'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={handleToggleAutoRefresh}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              autoRefresh
                ? isDark
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-green-100 text-green-800 border border-green-200'
                : isDark
                ? 'bg-gray-800 text-gray-400 border border-gray-700'
                : 'bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {autoRefresh ? (
              <>
                <Radio className="w-4 h-4 animate-pulse" />
                Real-time ({countdown}s)
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Manual
              </>
            )}
          </button>

          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            title="Select time range for chart data"
            aria-label="Time range selector"
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-gray-800 border border-gray-700 text-white'
                : 'bg-stone-50 border border-stone-200 text-stone-900'
            } focus:outline-none`}
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>

          {/* Manual refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              isDark
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Users Card */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Users className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <TrendingUp className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {stats?.users.total || 0}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Total Users</p>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Today: {stats?.users.today || 0}</span>
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>This Week: {stats?.users.this_week || 0}</span>
            </div>
          </div>
        </div>

        {/* Contacts Card */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <Mail className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'}`}>
              {stats?.contacts.new || 0} new
            </span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {stats?.contacts.total || 0}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Contact Messages</p>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Today: {stats?.contacts.today || 0}</span>
            </div>
          </div>
        </div>

        {/* Enrollments Card */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <BookOpen className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
              {stats?.enrollments.pending || 0} pending
            </span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {stats?.enrollments.total || 0}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Course Enrollments</p>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Confirmed: {stats?.enrollments.confirmed || 0}</span>
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Completed: {stats?.enrollments.completed || 0}</span>
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Today: {stats?.enrollments.today || 0}</span>
            </div>
          </div>
        </div>

        {/* Consultations Card */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <Calendar className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-800'}`}>
              {stats?.consultations.scheduled || 0} scheduled
            </span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {stats?.consultations.total || 0}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Consultations</p>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Pending: {stats?.consultations.pending || 0}</span>
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Today: {stats?.consultations.today || 0}</span>
            </div>
          </div>
        </div>

        {/* Newsletter Card */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
              <Activity className={`w-6 h-6 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {stats?.newsletters.total || 0}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Newsletter Subscribers</p>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Today: {stats?.newsletters.today || 0}</span>
            </div>
          </div>
        </div>

        {/* Logins Card */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
              <CheckCircle2 className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            {(stats?.logins.failed_today || 0) > 0 && (
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'}`}>
                <XCircle className="w-3 h-3 inline mr-1" />
                {stats?.logins.failed_today} failed
              </span>
            )}
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {stats?.logins.total || 0}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Successful Logins</p>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>Today: {stats?.logins.today || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Daily Trends */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Daily Activity Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: isDark ? '#fff' : '#000' }}
              />
              <Legend />
              <Line type="monotone" dataKey="contacts" stroke={COLORS.contacts} strokeWidth={2} name="Contacts" />
              <Line type="monotone" dataKey="enrollments" stroke={COLORS.enrollments} strokeWidth={2} name="Enrollments" />
              <Line type="monotone" dataKey="consultations" stroke={COLORS.consultations} strokeWidth={2} name="Consultations" />
              <Line type="monotone" dataKey="logins" stroke={COLORS.logins} strokeWidth={2} name="Logins" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Activity Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: isDark ? '#fff' : '#000' }}
              />
              <Legend />
              <Bar dataKey="contacts" fill={COLORS.contacts} name="Contacts" />
              <Bar dataKey="enrollments" fill={COLORS.enrollments} name="Enrollments" />
              <Bar dataKey="consultations" fill={COLORS.consultations} name="Consultations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribution */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Activity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Recent Activities
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                No recent activities
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    isDark ? 'hover:bg-gray-800/50' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {activity.title}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                        {formatTimestamp(activity.timestamp)}
                      </span>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
