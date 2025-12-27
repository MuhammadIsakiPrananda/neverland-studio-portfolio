import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../../types';
import { 
  Activity, 
  User, 
  FileText, 
  Settings, 
  LogIn, 
  LogOut,
  Edit,
  Trash2,
  Plus,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Search,
  AlertCircle
} from 'lucide-react';
import { activityLogService, type ActivityLog, type ActivityLogStats } from '../../services/activityLogService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface DashboardActivityProps {
  theme: Theme;
}

const DashboardActivity: React.FC<DashboardActivityProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch activity logs
  const fetchActivityLogs = useCallback(async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);
    setError(null);
    
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        activityLogService.getRecent(50),
        activityLogService.getStats(),
      ]);
      
      setActivityLogs(logsResponse.data);
      setStats(statsResponse);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  // Subscribe to real-time activity log updates
  useEffect(() => {
    if (!autoRefresh) return;

    const unsubscribe = realtimeService.subscribe('activity-logs', (data) => {
      if (data && Array.isArray(data)) {
        setActivityLogs(data.slice(0, 50));
        setLastUpdate(new Date());
      }
    });

    return () => unsubscribe();
  }, [autoRefresh]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return LogIn;
      case 'logout': return LogOut;
      case 'create': return Plus;
      case 'update': return Edit;
      case 'delete': return Trash2;
      case 'settings': return Settings;
      case 'api': return FileText;
      case 'database': return FileText;
      case 'error': return AlertCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return isDark ? 'text-green-400' : 'text-green-600';
      case 'failed': return isDark ? 'text-red-400' : 'text-red-600';
      case 'warning': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default: return isDark ? 'text-slate-400' : 'text-slate-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'success': return isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-300';
      case 'failed': return isDark ? 'bg-red-500/20 border-red-500/30' : 'bg-red-100 border-red-300';
      case 'warning': return isDark ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-100 border-yellow-300';
      default: return isDark ? 'bg-slate-500/20 border-slate-500/30' : 'bg-slate-100 border-slate-300';
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleRefresh = () => {
    fetchActivityLogs(true);
  };

  const handleExport = async () => {
    try {
      const response = await activityLogService.exportLogs({ type: filterType, search: searchQuery });
      
      // Convert to CSV
      const csv = [
        ['ID', 'Type', 'User', 'Action', 'Description', 'IP Address', 'Status', 'Created At'].join(','),
        ...response.data.map((row: any) => 
          Object.values(row).map(v => `"${v}"`).join(',')
        )
      ].join('\n');

      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting logs:', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleString();
  };

  const statsDisplay = [
    { 
      label: 'Total Activities', 
      value: stats?.total.toLocaleString() || '0', 
      icon: Activity, 
      color: 'blue' 
    },
    { 
      label: 'Today', 
      value: stats?.today.toString() || '0', 
      icon: Clock, 
      color: 'green' 
    },
    { 
      label: 'Failed Actions', 
      value: stats?.failed_today.toString() || '0', 
      icon: Trash2, 
      color: 'red' 
    },
    { 
      label: 'Active Users', 
      value: stats?.active_users.toString() || '0', 
      icon: User, 
      color: 'cyan' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Activity Log
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Monitor all system activities and user actions • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
              ${autoRefresh 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : isDark 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}
            `}
          >
            <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
              ${isDark 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}
              disabled:opacity-50
            `}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`
                p-6 rounded-xl border transition-all duration-200
                ${isDark 
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 hover:shadow-lg'}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className={`
        p-4 rounded-xl border
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className={`relative ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-colors
                  ${isDark 
                    ? 'bg-transparent text-white placeholder:text-slate-500' 
                    : 'bg-transparent text-slate-900 placeholder:text-slate-400'}
                `}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`
                px-4 py-2.5 rounded-lg outline-none cursor-pointer transition-colors
                ${isDark 
                  ? 'bg-slate-900/50 text-white border border-slate-700' 
                  : 'bg-slate-50 text-slate-900 border border-slate-200'}
              `}
            >
              <option value="all">All Activities</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="settings">Settings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className={`
        rounded-xl border overflow-hidden
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recent Activities ({filteredLogs.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-700">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className={`w-12 h-12 mx-auto mb-4 animate-spin ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Loading activity logs...
              </p>
            </div>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const Icon = getActivityIcon(log.type);
              return (
                <div
                  key={log.id}
                  className={`
                    p-4 transition-colors
                    ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-3 rounded-lg border
                      ${getStatusBgColor(log.status)}
                    `}>
                      <Icon className={`w-5 h-5 ${getStatusColor(log.status)}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {log.action}
                        </h3>
                        <span className={`
                          px-2 py-1 rounded-md text-xs font-medium border whitespace-nowrap
                          ${getStatusBgColor(log.status)} ${getStatusColor(log.status)}
                        `}>
                          {log.status}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        {log.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                            {log.user}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                            {formatTimestamp(log.created_at)}
                          </span>
                        </div>
                        {log.ip_address && (
                          <div className="flex items-center gap-2">
                            <FileText className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                              {log.ip_address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Activity className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No activities found
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardActivity;
