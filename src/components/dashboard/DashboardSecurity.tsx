import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Smartphone,
  Globe,
  Activity
} from 'lucide-react';

interface DashboardSecurityProps {
  theme: Theme;
}

interface SecurityLog {
  id: string;
  type: 'login' | 'password_change' | 'api_key' | '2fa_enable' | '2fa_disable';
  description: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  status: 'success' | 'failed' | 'warning';
}

const DashboardSecurity: React.FC<DashboardSecurityProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [show2FACode, setShow2FACode] = useState(false);
  const [showAPIKey, setShowAPIKey] = useState(false);

  const securityLogs: SecurityLog[] = [
    {
      id: '1',
      type: 'login',
      description: 'Successful login from new device',
      timestamp: '2025-12-26 13:45:00',
      ipAddress: '192.168.1.100',
      location: 'Jakarta, Indonesia',
      status: 'success'
    },
    {
      id: '2',
      type: '2fa_enable',
      description: 'Two-factor authentication enabled',
      timestamp: '2025-12-25 10:30:00',
      ipAddress: '192.168.1.100',
      location: 'Jakarta, Indonesia',
      status: 'success'
    },
    {
      id: '3',
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2025-12-24 14:20:00',
      ipAddress: '192.168.1.100',
      location: 'Jakarta, Indonesia',
      status: 'success'
    },
    {
      id: '4',
      type: 'login',
      description: 'Failed login attempt - Invalid credentials',
      timestamp: '2025-12-23 08:15:00',
      ipAddress: '185.220.101.50',
      location: 'Unknown',
      status: 'failed'
    },
    {
      id: '5',
      type: 'api_key',
      description: 'API key regenerated',
      timestamp: '2025-12-22 16:00:00',
      ipAddress: '192.168.1.100',
      location: 'Jakarta, Indonesia',
      status: 'success'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return isDark ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-300';
      case 'failed': return isDark ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-100 border-red-300';
      case 'warning': return isDark ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  const stats = [
    { 
      label: 'Security Score', 
      value: '98%', 
      description: 'Excellent',
      icon: Shield, 
      color: 'green',
      status: 'success'
    },
    { 
      label: 'Failed Logins', 
      value: '3', 
      description: 'Last 30 days',
      icon: AlertTriangle, 
      color: 'yellow',
      status: 'warning'
    },
    { 
      label: 'Active Sessions', 
      value: '2', 
      description: 'Currently active',
      icon: Activity, 
      color: 'blue',
      status: 'info'
    },
    { 
      label: 'Last Password Change', 
      value: '2d', 
      description: 'Days ago',
      icon: Clock, 
      color: 'purple',
      status: 'info'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Security Settings
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage your account security and authentication settings
        </p>
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
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Settings */}
        <div className={`
          rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Password Settings
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className={`
              p-4 rounded-lg border
              ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}
            `}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Strong Password
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your password meets all security requirements
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                className={`
                  w-full px-4 py-2.5 rounded-lg outline-none transition-colors
                  ${isDark 
                    ? 'bg-slate-900/50 text-white border border-slate-700 focus:border-blue-500' 
                    : 'bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500'}
                `}
              />
              <input
                type="password"
                placeholder="New password"
                className={`
                  w-full px-4 py-2.5 rounded-lg outline-none transition-colors
                  ${isDark 
                    ? 'bg-slate-900/50 text-white border border-slate-700 focus:border-blue-500' 
                    : 'bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500'}
                `}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className={`
                  w-full px-4 py-2.5 rounded-lg outline-none transition-colors
                  ${isDark 
                    ? 'bg-slate-900/50 text-white border border-slate-700 focus:border-blue-500' 
                    : 'bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500'}
                `}
              />
            </div>

            <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className={`
          rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Two-Factor Authentication
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className={`
              p-4 rounded-lg border
              ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'}
            `}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  2FA Enabled
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your account is protected with two-factor authentication
              </p>
            </div>

            <div>
              <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} block mb-2`}>
                Backup Codes
              </label>
              <div className={`
                p-4 rounded-lg border font-mono text-sm
                ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}
              `}>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {show2FACode ? '1234-5678-9012-3456' : '••••-••••-••••-••••'}
                  </span>
                  <button 
                    onClick={() => setShow2FACode(!show2FACode)}
                    className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
                  >
                    {show2FACode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className={`
                flex-1 px-4 py-2.5 rounded-lg transition-colors
                ${isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
              `}>
                <RefreshCw className="w-4 h-4 mx-auto" />
              </button>
              <button className={`
                flex-1 px-4 py-2.5 rounded-lg transition-colors
                ${isDark 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}
              `}>
                Disable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className={`
          rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-500" />
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                API Keys
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} block mb-2`}>
                Your API Key
              </label>
              <div className={`
                p-4 rounded-lg border font-mono text-sm
                ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}
              `}>
                <div className="flex items-center justify-between">
                  <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'} break-all`}>
                    {showAPIKey ? 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : '••••••••••••••••••••••••••••••••'}
                  </span>
                  <button 
                    onClick={() => setShowAPIKey(!showAPIKey)}
                    className={`p-1 rounded transition-colors ml-2 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
                  >
                    {showAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className={`
              p-4 rounded-lg border
              ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}
            `}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Keep it secret!
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Never share your API key with anyone or commit it to version control
              </p>
            </div>

            <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Regenerate API Key
            </button>
          </div>
        </div>

        {/* Login History */}
        <div className={`
          rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recent Activity
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {securityLogs.map((log) => (
              <div
                key={log.id}
                className={`
                  p-3 rounded-lg border
                  ${isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {log.description}
                  </span>
                  <span className={`
                    px-2 py-0.5 rounded-md text-xs font-medium border
                    ${getStatusColor(log.status)}
                  `}>
                    {log.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                      {log.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                      {log.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSecurity;
