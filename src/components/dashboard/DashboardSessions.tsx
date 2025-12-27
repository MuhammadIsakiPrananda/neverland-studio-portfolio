import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  LogOut,
  Shield,
  AlertTriangle,
  RefreshCw,
  X as XIcon,
  Search,
  Filter
} from 'lucide-react';

interface DashboardSessionsProps {
  theme: Theme;
}

interface Session {
  id: string;
  user: string;
  email: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  status: 'active' | 'idle' | 'warning';
  isCurrent: boolean;
}

const DashboardSessions: React.FC<DashboardSessionsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sessions: Session[] = [
    {
      id: '1',
      user: 'Admin User',
      email: 'admin@neverlandstudio.com',
      device: 'desktop',
      browser: 'Chrome 120',
      os: 'Windows 11',
      location: 'Jakarta, Indonesia',
      ipAddress: '192.168.1.100',
      loginTime: '2025-12-26 08:00:00',
      lastActivity: '2025-12-26 13:45:00',
      status: 'active',
      isCurrent: true
    },
    {
      id: '2',
      user: 'John Doe',
      email: 'john@example.com',
      device: 'mobile',
      browser: 'Safari 17',
      os: 'iOS 17.2',
      location: 'Bandung, Indonesia',
      ipAddress: '192.168.1.150',
      loginTime: '2025-12-26 09:30:00',
      lastActivity: '2025-12-26 13:40:00',
      status: 'active',
      isCurrent: false
    },
    {
      id: '3',
      user: 'Jane Smith',
      email: 'jane@example.com',
      device: 'desktop',
      browser: 'Firefox 121',
      os: 'macOS Sonoma',
      location: 'Surabaya, Indonesia',
      ipAddress: '192.168.1.120',
      loginTime: '2025-12-26 07:00:00',
      lastActivity: '2025-12-26 12:30:00',
      status: 'idle',
      isCurrent: false
    },
    {
      id: '4',
      user: 'Bob Johnson',
      email: 'bob@example.com',
      device: 'tablet',
      browser: 'Edge 120',
      os: 'Android 14',
      location: 'Yogyakarta, Indonesia',
      ipAddress: '192.168.1.180',
      loginTime: '2025-12-26 10:15:00',
      lastActivity: '2025-12-26 13:30:00',
      status: 'active',
      isCurrent: false
    },
    {
      id: '5',
      user: 'Unknown User',
      email: 'suspicious@example.com',
      device: 'desktop',
      browser: 'Chrome 95',
      os: 'Linux',
      location: 'Unknown, Unknown',
      ipAddress: '185.220.101.50',
      loginTime: '2025-12-26 11:00:00',
      lastActivity: '2025-12-26 11:15:00',
      status: 'warning',
      isCurrent: false
    }
  ];

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return isDark ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-300';
      case 'idle': return isDark ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'warning': return isDark ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-100 border-red-300';
      default: return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const stats = [
    { label: 'Active Sessions', value: sessions.filter(s => s.status === 'active').length.toString(), icon: Clock, color: 'green' },
    { label: 'Idle Sessions', value: sessions.filter(s => s.status === 'idle').length.toString(), icon: Clock, color: 'yellow' },
    { label: 'Warning Sessions', value: sessions.filter(s => s.status === 'warning').length.toString(), icon: AlertTriangle, color: 'red' },
    { label: 'Total Devices', value: sessions.length.toString(), icon: Monitor, color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Active Sessions
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Monitor and manage all active user sessions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={`
            px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
            ${isDark 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}
          `}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
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
                placeholder="Search sessions..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                px-4 py-2.5 rounded-lg outline-none cursor-pointer transition-colors
                ${isDark 
                  ? 'bg-slate-900/50 text-white border border-slate-700' 
                  : 'bg-slate-50 text-slate-900 border border-slate-200'}
              `}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className={`
        rounded-xl border overflow-hidden
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            All Sessions ({filteredSessions.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-700">
          {filteredSessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            return (
              <div
                key={session.id}
                className={`
                  p-4 transition-colors
                  ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg border
                    ${getStatusColor(session.status)}
                  `}>
                    <DeviceIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {session.user}
                          {session.isCurrent && (
                            <span className="ml-2 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500 text-white">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {session.email}
                        </p>
                      </div>
                      <span className={`
                        px-2 py-1 rounded-md text-xs font-medium border capitalize whitespace-nowrap
                        ${getStatusColor(session.status)}
                      `}>
                        {session.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                          {session.browser} on {session.os}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                          {session.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                          {session.ipAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                            Logged in: {session.loginTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                            Last active: {session.lastActivity}
                          </span>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          className={`
                            px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors
                            ${isDark 
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                              : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}
                          `}
                        >
                          <LogOut className="w-4 h-4" />
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardSessions;
