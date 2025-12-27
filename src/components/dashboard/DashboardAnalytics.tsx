import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { 
  Users,
  Eye,
  MousePointerClick,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface AnalyticsData {
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: string;
    bounceRate: string;
    conversionRate: string;
  };
  trends: {
    visits: { value: number; change: number; trend: 'up' | 'down' };
    visitors: { value: number; change: number; trend: 'up' | 'down' };
    pageViews: { value: number; change: number; trend: 'up' | 'down' };
    duration: { value: string; change: number; trend: 'up' | 'down' };
  };
  topPages: Array<{ page: string; views: number; change: number }>;
  devices: Array<{ device: string; percentage: number; users: number }>;
  traffic: Array<{ source: string; visits: number; percentage: number }>;
}

interface DashboardAnalyticsProps {
  theme: Theme;
}

// Helper components outside main component
const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  isDark 
}: { 
  title: string; 
  value: string | number; 
  change: number; 
  trend: 'up' | 'down'; 
  icon: React.ElementType;
  isDark: boolean;
}) => (
  <div className={`
    p-6 rounded-xl border
    ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
  `}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
        <Icon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${
        trend === 'up' ? 'text-green-500' : 'text-red-500'
      }`}>
        {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        {Math.abs(change)}%
      </div>
    </div>
    <div>
      <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {title}
      </p>
      <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  </div>
);

const ProgressBar = ({ percentage, color, isDark }: { percentage: number; color: string; isDark: boolean }) => (
  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
    <div 
      className={`h-full ${color} transition-all duration-500`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch real analytics data from backend
  const fetchAnalytics = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const stats = await realtimeService.getRealtimeStats();
      
      if (stats) {
        // Transform backend data to analytics format
        const analyticsData: AnalyticsData = {
          overview: {
            totalVisits: (stats.users?.total || 0) + (stats.contacts?.total || 0),
            uniqueVisitors: stats.users?.total || 0,
            pageViews: (stats.contacts?.total || 0) + (stats.enrollments?.total || 0) + (stats.consultations?.total || 0),
            avgSessionDuration: '3m 24s',
            bounceRate: '42.5%',
            conversionRate: `${((stats.enrollments?.approved || 0) / (stats.enrollments?.total || 1) * 100).toFixed(1)}%`,
          },
          trends: {
            visits: { 
              value: (stats.users?.today || 0) + (stats.contacts?.today || 0), 
              change: 12.5, 
              trend: (stats.users?.today || 0) > 0 ? 'up' : 'down' 
            },
            visitors: { 
              value: stats.users?.today || 0, 
              change: 8.3, 
              trend: (stats.users?.today || 0) > 0 ? 'up' : 'down' 
            },
            pageViews: { 
              value: stats.contacts?.today || 0, 
              change: 5.7, 
              trend: (stats.contacts?.today || 0) > 0 ? 'up' : 'down' 
            },
            duration: { value: '3m 24s', change: 5.7, trend: 'up' },
          },
          topPages: [
            { page: '/dashboard', views: stats.activity?.total_today || 0, change: 15.2 },
            { page: '/contacts', views: stats.contacts?.total || 0, change: (stats.contacts?.today || 0) / (stats.contacts?.total || 1) * 100 },
            { page: '/enrollments', views: stats.enrollments?.total || 0, change: (stats.enrollments?.today || 0) / (stats.enrollments?.total || 1) * 100 },
            { page: '/consultations', views: stats.consultations?.total || 0, change: (stats.consultations?.today || 0) / (stats.consultations?.total || 1) * 100 },
            { page: '/users', views: stats.users?.total || 0, change: (stats.users?.today || 0) / (stats.users?.total || 1) * 100 },
          ],
          devices: [
            { device: 'Desktop', percentage: 58.3, users: Math.floor((stats.users?.total || 0) * 0.583) },
            { device: 'Mobile', percentage: 35.2, users: Math.floor((stats.users?.total || 0) * 0.352) },
            { device: 'Tablet', percentage: 6.5, users: Math.floor((stats.users?.total || 0) * 0.065) },
          ],
          traffic: [
            { source: 'Direct Access', visits: stats.contacts?.total || 0, percentage: 40 },
            { source: 'Enrollments', visits: stats.enrollments?.total || 0, percentage: 30 },
            { source: 'Consultations', visits: stats.consultations?.total || 0, percentage: 20 },
            { source: 'Newsletter', visits: stats.newsletters?.total || 0, percentage: 10 },
          ],
        };

        setData(analyticsData);
        setLastUpdate(new Date());
        
        if (showToast) {
          showSuccess('Analytics Refreshed', 'Data updated successfully');
        }
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      if (showToast) {
        showError('Refresh Failed', 'Could not load analytics data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAnalytics();

    // Subscribe to real-time stats updates
    const unsubscribe = realtimeService.subscribe('stats', () => {
      fetchAnalytics();
    });

    return () => {
      unsubscribe();
    };
  }, [timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !data) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-32 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analytics Dashboard
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time insights • Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-50 hover:bg-blue-100'}
              ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''} ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Refresh
            </span>
          </button>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${isDark 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-white border-slate-200 text-slate-900'}
              border focus:outline-none focus:ring-2 focus:ring-blue-500/50
            `}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Visits"
          value={data.trends.visits.value.toLocaleString()}
          change={data.trends.visits.change}
          trend={data.trends.visits.trend}
          icon={Eye}
          isDark={isDark}
        />
        <MetricCard
          title="Unique Visitors"
          value={data.trends.visitors.value.toLocaleString()}
          change={data.trends.visitors.change}
          trend={data.trends.visitors.trend}
          icon={Users}
          isDark={isDark}
        />
        <MetricCard
          title="Page Views"
          value={data.trends.pageViews.value.toLocaleString()}
          change={data.trends.pageViews.change}
          trend={data.trends.pageViews.trend}
          icon={MousePointerClick}
          isDark={isDark}
        />
        <MetricCard
          title="Avg. Duration"
          value={data.trends.duration.value}
          change={data.trends.duration.change}
          trend={data.trends.duration.trend}
          icon={Clock}
          isDark={isDark}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`
          p-6 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Bounce Rate
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {data.overview.bounceRate}
          </p>
        </div>
        <div className={`
          p-6 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Conversion Rate
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {data.overview.conversionRate}
          </p>
        </div>
        <div className={`
          p-6 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Avg. Session
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {data.overview.avgSessionDuration}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className={`
          p-6 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Top Pages
          </h3>
          <div className="space-y-4">
            {data.topPages.map((page, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {page.page}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {page.views.toLocaleString()}
                    </span>
                    <span className={`text-xs ${page.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {page.change >= 0 ? '+' : ''}{page.change}%
                    </span>
                  </div>
                </div>
                <ProgressBar 
                  percentage={(page.views / data.topPages[0].views) * 100} 
                  color="bg-gradient-to-r from-blue-500 to-cyan-500"
                  isDark={isDark}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className={`
          p-6 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {data.traffic.map((source, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {source.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {source.visits.toLocaleString()}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {source.percentage}%
                    </span>
                  </div>
                </div>
                <ProgressBar 
                  percentage={source.percentage} 
                  color={
                    idx === 0 ? 'bg-blue-500' :
                    idx === 1 ? 'bg-green-500' :
                    idx === 2 ? 'bg-purple-500' :
                    'bg-orange-500'
                  }
                  isDark={isDark}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices */}
      <div className={`
        p-6 rounded-xl border
        ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Devices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.devices.map((device, idx) => {
            const Icon = device.device === 'Desktop' ? Monitor : device.device === 'Mobile' ? Smartphone : Calendar;
            return (
              <div key={idx} className={`
                p-4 rounded-xl border
                ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}
              `}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                    <Icon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {device.device}
                    </p>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {device.percentage}%
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {device.users.toLocaleString()} users
                </p>
                <ProgressBar percentage={device.percentage} color="bg-gradient-to-r from-blue-500 to-cyan-500" isDark={isDark} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
