import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { 
  Users, 
  TrendingUp, 
  Mail, 
  BookOpen,
  MessageSquare,
  Activity,
  Clock,
  LogIn,
  Calendar,
  RefreshCw,
  Zap
} from 'lucide-react';
import dashboardService, { type DashboardStats, type Activity as ActivityType } from '../../services/dashboardService';
import activityLogService, { type ActivityLog } from '../../services/activityLogService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface DashboardHomeProps {
  theme: Theme;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  theme: Theme;
  loading?: boolean;
  trend?: {
    value: number;
    label: string;
  };
  isUpdating?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, theme, loading, trend, isUpdating }) => {
  const isDark = theme === 'dark';
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [prevValue, setPrevValue] = useState<number>(0);
  
  useEffect(() => {
    const numValue = typeof value === 'string' ? 0 : value;
    
    if (numValue !== prevValue && numValue !== displayValue) {
      // Animate from current display value to new value
      const start = displayValue;
      const end = numValue;
      const duration = 1000; // 1 second animation
      const startTime = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuad = progress * (2 - progress); // Easing function
        const current = Math.round(start + (end - start) * easeOutQuad);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setPrevValue(end);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, displayValue, prevValue]);
  
  return (
    <div className={`
      relative p-6 rounded-2xl transition-all duration-300 hover:scale-105
      ${isDark 
        ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-blue-500/30' 
        : 'bg-white border border-slate-200 hover:border-blue-300 shadow-lg'}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl transition-all duration-300 ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          <Icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded transition-all duration-300 ${
            trend.value > 0 ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
          }`}>
            {trend.value > 0 ? '+' : ''}{trend.value}
          </div>
        )}
      </div>
      <div>
        <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {title}
        </p>
        {loading ? (
          <div className="h-9 bg-slate-700 rounded animate-pulse" />
        ) : (
          <p className={`text-3xl font-bold transition-all duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {typeof value === 'string' ? value : displayValue.toLocaleString('id-ID')}
          </p>
        )}
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRealtime, setIsRealtime] = useState(false);
  const [updatingCards, setUpdatingCards] = useState<Set<string>>(new Set());

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const [statsData, activitiesResponse] = await Promise.all([
        dashboardService.getOverviewStats(),
        activityLogService.getRecent(10)
      ]);
      
      // Mark which cards are updating
      if (stats) {
        const updating = new Set<string>();
        if (statsData?.users?.total !== stats?.users?.total) updating.add('users');
        if (statsData?.contacts?.total !== stats?.contacts?.total) updating.add('contacts');
        if (statsData?.enrollments?.total !== stats?.enrollments?.total) updating.add('enrollments');
        if (statsData?.consultations?.total !== stats?.consultations?.total) updating.add('consultations');
        if (statsData?.newsletters?.total !== stats?.newsletters?.total) updating.add('newsletters');
        
        setUpdatingCards(updating);
        
        // Clear updating state after animation
        setTimeout(() => setUpdatingCards(new Set()), 2000);
      }
      
      setStats(statsData);
      setActivities(activitiesResponse.data || []);
      setLastUpdate(new Date());
      
      if (showToast) {
        showSuccess('Dashboard Refreshed', 'Data updated successfully');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (showToast) {
        showError('Refresh Failed', 'Could not load latest data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch only - no auto-refresh
    fetchDashboardData();
    
    // Subscribe to real-time stats updates
    const unsubscribeStats = realtimeService.subscribe('stats', (data) => {
      setRealtimeStats(data);
      setLastUpdate(new Date());
      setIsRealtime(true);
      
      // Mark all cards as updating when realtime data arrives
      setUpdatingCards(new Set(['users', 'contacts', 'enrollments', 'consultations', 'newsletters', 'activity']));
      setTimeout(() => setUpdatingCards(new Set()), 2000);
    });

    // Subscribe to activity logs updates  
    const unsubscribeActivities = realtimeService.subscribe('activity-logs', (data) => {
      if (data && Array.isArray(data)) {
        setActivities(data.slice(0, 10));
      }
    });

    // Subscribe to contacts updates
    const unsubscribeContacts = realtimeService.subscribe('contacts', () => {
      // Refresh overview stats when contacts change
      fetchDashboardData();
    });

    // Subscribe to users updates
    const unsubscribeUsers = realtimeService.subscribe('users', () => {
      fetchDashboardData();
    });

    // Subscribe to enrollments updates
    const unsubscribeEnrollments = realtimeService.subscribe('enrollments', () => {
      fetchDashboardData();
    });

    // Subscribe to consultations updates
    const unsubscribeConsultations = realtimeService.subscribe('consultations', () => {
      fetchDashboardData();
    });
    
    return () => {
      unsubscribeStats();
      unsubscribeActivities();
      unsubscribeContacts();
      unsubscribeUsers();
      unsubscribeEnrollments();
      unsubscribeConsultations();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return Mail;
      case 'enrollment': return BookOpen;
      case 'consultation': return Calendar;
      case 'newsletter': return MessageSquare;
      case 'user': return Users;
      case 'login':
      case 'logout': return LogIn;
      default: return Activity;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getLastUpdateText = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    let relativeTime = '';
    if (diff < 10) {
      relativeTime = 'just now';
    } else if (diff < 60) {
      relativeTime = `${diff} seconds ago`;
    } else if (diff < 3600) {
      relativeTime = `${Math.floor(diff / 60)} minutes ago`;
    } else {
      relativeTime = `${Math.floor(diff / 3600)} hours ago`;
    }
    
    const timeStr = lastUpdate.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    const dateStr = lastUpdate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return `${dateStr} at ${timeStr} • ${relativeTime}`;
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Merge realtime stats with regular stats (realtime takes priority but fallback to stats)
  const displayStats = realtimeStats ? {
    users: realtimeStats.users || stats?.users || { total: 0, today: 0, this_week: 0, this_month: 0 },
    contacts: realtimeStats.contacts || stats?.contacts || { total: 0, new: 0, today: 0 },
    enrollments: realtimeStats.enrollments || stats?.enrollments || { total: 0, pending: 0, approved: 0, today: 0 },
    consultations: realtimeStats.consultations || stats?.consultations || { total: 0, pending: 0, scheduled: 0, today: 0 },
    newsletters: realtimeStats.newsletters || stats?.newsletters || { total: 0, today: 0 },
    logins: realtimeStats.logins || stats?.logins || { total: 0, today: 0, failed_today: 0 }
  } : stats;

  return (
    <div className="space-y-6">
      {/* Welcome Section with Real-Time Info */}
      <div className={`
        p-6 rounded-2xl flex items-center justify-between
        ${isDark 
          ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20' 
          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'}
      `}>
        <div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {getGreeting()}, Admin! 👋
          </h1>
          <div className="flex items-center gap-3">
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Real-time Dashboard Overview
            </p>
            {isRealtime && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Last updated: {getLastUpdateText()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className={`
              p-3 rounded-xl transition-all duration-300 hover:scale-110
              ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-white hover:bg-blue-50'}
              ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title="Refresh now"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''} ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </button>
        </div>
      </div>

      {/* Statistics Grid - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={displayStats?.users?.total || 0}
          subtitle={`+${displayStats?.users?.today || 0} today ${displayStats?.users?.new_this_hour ? `• ${displayStats.users.new_this_hour} this hour` : ''}`}
          icon={Users}
          theme={theme}
          loading={loading}
          trend={{ value: displayStats?.users?.today || 0, label: 'today' }}
          isUpdating={updatingCards.has('users')}
        />
        <StatCard 
          title="Contact Messages" 
          value={displayStats?.contacts?.total || 0}
          subtitle={`${displayStats?.contacts?.unread || displayStats?.contacts?.new || 0} unread • ${displayStats?.contacts?.today || 0} today`}
          icon={Mail}
          theme={theme}
          loading={loading}
          trend={{ value: displayStats?.contacts?.today || 0, label: 'today' }}
          isUpdating={updatingCards.has('contacts')}
        />
        <StatCard 
          title="Enrollments" 
          value={displayStats?.enrollments?.total || 0}
          subtitle={`${displayStats?.enrollments?.pending || 0} pending • ${displayStats?.enrollments?.approved || 0} approved`}
          icon={BookOpen}
          theme={theme}
          loading={loading}
          trend={{ value: displayStats?.enrollments?.today || 0, label: 'today' }}
          isUpdating={updatingCards.has('enrollments')}
        />
        <StatCard 
          title="Consultations" 
          value={displayStats?.consultations?.total || 0}
          subtitle={`${displayStats?.consultations?.pending || 0} pending • ${displayStats?.consultations?.scheduled || displayStats?.consultations?.upcoming || 0} scheduled`}
          icon={Calendar}
          theme={theme}
          loading={loading}
          trend={{ value: displayStats?.consultations?.today || 0, label: 'today' }}
          isUpdating={updatingCards.has('consultations')}
        />
      </div>

      {/* Additional Stats with Real-Time Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Newsletter Subscribers" 
          value={displayStats?.newsletters?.total || 0}
          subtitle={`+${displayStats?.newsletters?.today || 0} new today • ${displayStats?.newsletters?.this_month || 0} this month`}
          icon={MessageSquare}
          theme={theme}
          loading={loading}
          trend={{ value: displayStats?.newsletters?.today || 0, label: 'today' }}
          isUpdating={updatingCards.has('newsletters')}
        />
        <StatCard 
          title="Recent Activity" 
          value={displayStats?.activity?.total_today || displayStats?.logins?.total || 0}
          subtitle={`${displayStats?.activity?.last_hour || 0} last hour • ${displayStats?.activity?.last_15_minutes || 0} last 15 min`}
          icon={Activity}
          theme={theme}
          loading={loading}
          isUpdating={updatingCards.has('activity')}
        />
        <StatCard 
          title="System Status" 
          value="Operational"
          subtitle={`DB: ${displayStats?.system?.database_size || 'N/A'}`}
          icon={TrendingUp}
          theme={theme}
          loading={loading}
          isUpdating={updatingCards.has('system')}
        />
      </div>

      {/* Recent Activity */}
      <div className={`
        p-6 rounded-2xl
        ${isDark 
          ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800' 
          : 'bg-white border border-slate-200 shadow-lg'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recent Activity
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Real-time activity feed • Auto-updates every 30s
            </p>
          </div>
          <Clock className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
        </div>
        
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg animate-pulse ${
                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                }`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-4 rounded animate-pulse ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`} />
                  <div className={`h-3 w-24 rounded animate-pulse ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`} />
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No recent activities
            </p>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      {activity.action}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {activity.description}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {activity.user || 'System'} • {getTimeAgo(activity.created_at)}
                    </p>
                  </div>
                  <span className={`
                    text-xs px-2 py-1 rounded font-medium
                    ${activity.status === 'success' ? 'bg-green-500/20 text-green-400' : ''}
                    ${activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${activity.status === 'failed' || activity.status === 'error' ? 'bg-red-500/20 text-red-400' : ''}
                    ${activity.status === 'info' ? 'bg-blue-500/20 text-blue-400' : ''}
                  `}>
                    {activity.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
