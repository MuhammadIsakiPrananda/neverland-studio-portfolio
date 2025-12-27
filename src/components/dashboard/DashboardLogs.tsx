import React from 'react';
import type { Theme } from '../../types';
import { FileCode, AlertTriangle, CheckCircle, XCircle, Info, Clock } from 'lucide-react';

interface DashboardLogsProps {
  theme: Theme;
}

const DashboardLogs: React.FC<DashboardLogsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const logs = [
    { id: '1', level: 'error', message: 'Database connection timeout', timestamp: '2025-12-26 13:45:23', source: 'api.database' },
    { id: '2', level: 'warning', message: 'High memory usage detected (85%)', timestamp: '2025-12-26 13:42:10', source: 'system.monitor' },
    { id: '3', level: 'info', message: 'User login successful', timestamp: '2025-12-26 13:40:05', source: 'auth.service' },
    { id: '4', level: 'success', message: 'Backup completed successfully', timestamp: '2025-12-26 13:35:00', source: 'backup.service' },
    { id: '5', level: 'error', message: 'Failed to send email notification', timestamp: '2025-12-26 13:30:15', source: 'email.service' },
    { id: '6', level: 'info', message: 'API request processed', timestamp: '2025-12-26 13:28:45', source: 'api.handler' },
    { id: '7', level: 'warning', message: 'Slow query detected (>500ms)', timestamp: '2025-12-26 13:25:30', source: 'database.query' },
    { id: '8', level: 'success', message: 'Cache cleared successfully', timestamp: '2025-12-26 13:20:00', source: 'cache.service' }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': return Info;
      default: return FileCode;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return isDark ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-100 border-red-300';
      case 'warning': return isDark ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'success': return isDark ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-300';
      case 'info': return isDark ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' : 'text-blue-700 bg-blue-100 border-blue-300';
      default: return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          System Logs
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          View and monitor system logs and events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: logs.length.toString(), icon: FileCode, color: 'blue' },
          { label: 'Errors', value: logs.filter(l => l.level === 'error').length.toString(), icon: XCircle, color: 'red' },
          { label: 'Warnings', value: logs.filter(l => l.level === 'warning').length.toString(), icon: AlertTriangle, color: 'yellow' },
          { label: 'Success', value: logs.filter(l => l.level === 'success').length.toString(), icon: CheckCircle, color: 'green' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recent Logs
          </h2>
        </div>
        <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto"> 
          {logs.map((log) => {
            const Icon = getLogIcon(log.level);
            return (
              <div key={log.id} className={`p-4 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition-colors`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg border ${getLogColor(log.level)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${getLogColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {log.source}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {log.timestamp}
                      </span>
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

export default DashboardLogs;
