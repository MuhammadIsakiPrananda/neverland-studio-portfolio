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
  Zap,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import dashboardService, { type DashboardStats, type Activity as ActivityType } from '../../services/dashboardService';
import activityLogService, { type ActivityLog } from '../../services/activityLogService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface DashboardHomeProps {
  theme: Theme;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  theme: Theme;
  trend?: {
    value: number;
    label: string;
  };
  gradient?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, theme, trend, gradient = 'from-primary/5 to-cyan-500/5' }) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    const numValue = typeof value === 'string' ? 0 : value;
    if (numValue !== displayValue) {
      const duration = 800;
      const startTime = Date.now();
      const start = displayValue;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (numValue - start) * easeOut);

        setDisplayValue(current);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  const isDark = theme === 'dark';

  return (
    <Card className={`group relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${isDark
        ? 'border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-800/40 hover:border-slate-700/60'
        : 'border-slate-200 bg-gradient-to-br from-white to-slate-50/80 hover:border-slate-300'
      } backdrop-blur-sm`}>
      {/* Subtle Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>

      {/* Subtle Border Shimmer */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-[1px]"></div>
      </div>

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-5">
          {/* Cleaner Icon Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className={`relative p-3 rounded-xl border transition-all duration-300 ${isDark
                ? 'bg-slate-800/60 border-slate-700/50 group-hover:border-primary/40 group-hover:bg-slate-800/80'
                : 'bg-slate-100/80 border-slate-200 group-hover:border-primary/40 group-hover:bg-slate-100'
              }`}>
              <Icon className={`w-6 h-6 transition-colors duration-300 ${isDark ? 'text-slate-300 group-hover:text-primary' : 'text-slate-600 group-hover:text-primary'
                }`} />
            </div>
          </div>

          {/* Subtle Trend Indicator */}
          {trend && trend.value !== 0 && (
            <Badge
              variant="outline"
              className={`font-semibold px-2.5 py-0.5 text-xs backdrop-blur-sm ${isDark
                  ? 'border-slate-700/50 bg-slate-800/40 text-slate-400'
                  : 'border-slate-300 bg-slate-100/80 text-slate-600'
                }`}
            >
              <TrendingUp className={`w-3 h-3 mr-1 ${trend.value < 0 ? 'rotate-180 text-red-400' : 'text-green-400'}`} />
              {trend.value > 0 ? '+' : ''}{trend.value}
            </Badge>
          )}
        </div>

        <div className="space-y-2.5">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
            {title}
          </p>
          <p className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
            }`}>
            {typeof value === 'string' ? value : displayValue.toLocaleString('id-ID')}
          </p>
          <p className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
            <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-60"></div>
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

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

    // Subscribe to connection status
    const unsubscribeStatus = realtimeService.subscribeToStatus((status) => {
      setConnectionStatus(status as 'connected' | 'disconnected' | 'connecting');
    });

    // Subscribe to real-time stats updates (5 second polling)
    const unsubscribeStats = realtimeService.subscribe('stats', (data) => {
      setRealtimeStats(data);
      setLastUpdate(new Date());
      setIsRealtime(true);

      // Mark all cards as updating when realtime data arrives
      setUpdatingCards(new Set(['users', 'contacts', 'enrollments', 'consultations', 'newsletters', 'activity']));
      setTimeout(() => setUpdatingCards(new Set()), 2000);
    }, 5000); // 5 second interval for stats

    // Subscribe to activity logs updates (10 second polling)
    const unsubscribeActivities = realtimeService.subscribe('activity-logs', (data) => {
      if (data && Array.isArray(data)) {
        setActivities(data.slice(0, 10));
      }
    }, 10000); // 10 second interval for activities

    // Subscribe to contacts updates
    const unsubscribeContacts = realtimeService.subscribe('contacts', () => {
      // Refresh overview stats when contacts change
      fetchDashboardData();
    }, 15000);

    // Subscribe to users updates
    const unsubscribeUsers = realtimeService.subscribe('users', () => {
      fetchDashboardData();
    }, 15000);

    // Subscribe to enrollments updates
    const unsubscribeEnrollments = realtimeService.subscribe('enrollments', () => {
      fetchDashboardData();
    }, 15000);

    // Subscribe to consultations updates
    const unsubscribeConsultations = realtimeService.subscribe('consultations', () => {
      fetchDashboardData();
    }, 15000);

    return () => {
      unsubscribeStatus();
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

  // Format last update time
  const getFormattedLastUpdate = () => {
    if (!lastUpdate) return 'Just now';

    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;

    return lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Merge realtime stats with regular stats (realtime takes priority but fallback to stats)
  const displayStats = realtimeStats ? {
    users: realtimeStats.users || stats?.users || { total: 0, today: 0, this_week: 0, this_month: 0 },
    contacts: realtimeStats.contacts || stats?.contacts || { total: 0, new: 0, today: 0 },
    enrollments: realtimeStats.enrollments || stats?.enrollments || { total: 0, pending: 0, confirmed: 0, completed: 0, today: 0 },
    consultations: realtimeStats.consultations || stats?.consultations || { total: 0, pending: 0, scheduled: 0, today: 0 },
    newsletters: realtimeStats.newsletters || stats?.newsletters || { total: 0, today: 0 },
    logins: realtimeStats.logins || stats?.logins || { total: 0, today: 0, failed_today: 0 }
  } : stats;

  return (
    <div className="space-y-6">
      {/* Clean Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Subtle Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark
            ? 'from-slate-900/80 via-slate-800/60 to-slate-900/80'
            : 'from-slate-100/80 via-slate-50/60 to-slate-100/80'
          }`}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60"></div>

        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50"></div>

        <Card className={`border backdrop-blur-sm ${isDark
            ? 'border-slate-800/50 bg-slate-900/40'
            : 'border-slate-200 bg-white/40'
          }`}>
          <CardContent className="p-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center">
                    {connectionStatus === 'connected' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50"></div>
                      </>
                    ) : connectionStatus === 'connecting' ? (
                      <Loader2 className="w-3 h-3 animate-spin text-yellow-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </div>
                  <Badge variant="outline" className={`font-semibold text-[10px] px-2.5 py-0.5 ${connectionStatus === 'connected'
                      ? isDark ? 'border-emerald-700/50 bg-emerald-900/40 text-emerald-300' : 'border-emerald-300 bg-emerald-100/80 text-emerald-700'
                      : connectionStatus === 'connecting'
                        ? isDark ? 'border-yellow-700/50 bg-yellow-900/40 text-yellow-300' : 'border-yellow-300 bg-yellow-100/80 text-yellow-700'
                        : isDark ? 'border-red-700/50 bg-red-900/40 text-red-300' : 'border-red-300 bg-red-100/80 text-red-700'
                    }`}>
                    {connectionStatus === 'connected' ? (
                      <><Wifi className="w-3 h-3 mr-1.5" />Live Dashboard</>
                    ) : connectionStatus === 'connecting' ? (
                      <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Connecting...</>
                    ) : (
                      <><WifiOff className="w-3 h-3 mr-1.5" />Disconnected</>
                    )}
                  </Badge>
                </div>
                <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                  {getGreeting()}, Admin 👋
                </h1>
                <p className={`font-normal text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                  Monitor your platform's performance in real-time
                </p>
              </div>

              <div className="flex items-center gap-3">
                {lastUpdate && (
                  <div className={`hidden sm:block text-right px-4 py-2.5 rounded-xl border ${isDark
                      ? 'bg-slate-800/50 border-slate-700/50'
                      : 'bg-slate-100/80 border-slate-200'
                    }`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>Last Updated</p>
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'
                      }`}>{getFormattedLastUpdate()}</p>
                  </div>
                )}
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => fetchDashboardData(true)}
                  disabled={refreshing}
                  title="Refresh Dashboard"
                  className={`rounded-xl h-12 w-12 border shadow-lg hover:shadow-xl transition-all duration-200 ${isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700/50 hover:border-slate-600'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''} ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={displayStats?.users?.total || 0}
          subtitle={`+${displayStats?.users?.today || 0} registered today`}
          icon={Users}
          theme={theme}
          trend={{ value: displayStats?.users?.today || 0, label: 'today' }}
          gradient="from-blue-500/5 to-cyan-500/5"
        />
        <StatCard
          title="Contact Messages"
          value={displayStats?.contacts?.total || 0}
          subtitle={`${displayStats?.contacts?.unread || displayStats?.contacts?.new || 0} unread • ${displayStats?.contacts?.today || 0} today`}
          icon={Mail}
          theme={theme}
          trend={{ value: displayStats?.contacts?.today || 0, label: 'today' }}
          gradient="from-purple-500/5 to-pink-500/5"
        />
        <StatCard
          title="Enrollments"
          value={displayStats?.enrollments?.total || 0}
          subtitle={`${displayStats?.enrollments?.pending || 0} pending • ${displayStats?.enrollments?.confirmed || 0} confirmed • ${displayStats?.enrollments?.completed || 0} completed`}
          icon={BookOpen}
          theme={theme}
          trend={{ value: displayStats?.enrollments?.today || 0, label: 'today' }}
          gradient="from-green-500/5 to-emerald-500/5"
        />
        <StatCard
          title="Consultations"
          value={displayStats?.consultations?.total || 0}
          subtitle={`${displayStats?.consultations?.pending || 0} pending • ${displayStats?.consultations?.scheduled || displayStats?.consultations?.upcoming || 0} scheduled`}
          icon={Calendar}
          theme={theme}
          trend={{ value: displayStats?.consultations?.today || 0, label: 'today' }}
          gradient="from-orange-500/5 to-amber-500/5"
        />
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Newsletter Subscribers"
          value={displayStats?.newsletters?.total || 0}
          subtitle={`+${displayStats?.newsletters?.today || 0} new today • ${displayStats?.newsletters?.this_month || 0} this month`}
          icon={MessageSquare}
          theme={theme}
          trend={{ value: displayStats?.newsletters?.today || 0, label: 'today' }}
          gradient="from-indigo-500/5 to-violet-500/5"
        />
        <StatCard
          title="Recent Activity"
          value={displayStats?.activity?.total_today || displayStats?.logins?.total || 0}
          subtitle={`${displayStats?.activity?.last_hour || 0} last hour • ${displayStats?.activity?.last_15_minutes || 0} last 15 min`}
          icon={Activity}
          theme={theme}
          gradient="from-rose-500/5 to-red-500/5"
        />
        <StatCard
          title="System Status"
          value="Operational"
          subtitle={`DB: ${displayStats?.system?.database_size || 'N/A'}`}
          icon={TrendingUp}
          theme={theme}
          gradient="from-emerald-500/5 to-teal-500/5"
        />
      </div>

      {/* Recent Activity */}
      <Card className={`border backdrop-blur-sm ${isDark
          ? 'border-slate-800/50 bg-slate-900/40'
          : 'border-slate-200 bg-white'
        }`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'
                }`}>Recent Activity</CardTitle>
              <CardDescription className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>Live activity feed</CardDescription>
            </div>
            <div className={`p-2 rounded-lg border ${isDark
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'bg-slate-100/80 border-slate-200'
              }`}>
              <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'
                  }`} />
                <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                  No recent activities
                </p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${isDark
                      ? 'bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700/60'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}>
                    <div className={`p-2 rounded-lg border ${isDark
                        ? 'bg-slate-800/80 border-slate-700/50'
                        : 'bg-slate-100/80 border-slate-200'
                      }`}>
                      <Icon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                        {activity.action}
                      </p>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        {activity.description}
                      </p>
                      <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                        {activity.user || 'System'} • {getTimeAgo(activity.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === 'success' ? 'default' :
                          activity.status === 'pending' ? 'secondary' :
                            activity.status === 'failed' || activity.status === 'error' || activity.status === 'delete' || activity.status === 'deleted' ? 'destructive' :
                              'outline'
                      }
                      className="text-[10px] px-2 py-0.5 shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
