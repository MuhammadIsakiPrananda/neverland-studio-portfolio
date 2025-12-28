import React from 'react';
import type { Theme } from '../../types';
import { FileText, AlertCircle, Info, CheckCircle, Filter } from 'lucide-react';

interface DashboardLogsProps {
  theme: Theme;
}

const DashboardLogs: React.FC<DashboardLogsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const logs = [
    { id: 1, type: 'info', message: 'User logged in successfully', time: '2 minutes ago', user: 'admin@company.com' },
    { id: 2, type: 'success', message: 'Project created: Website Redesign', time: '15 minutes ago', user: 'john@company.com' },
    { id: 3, type: 'warning', message: 'API rate limit approaching threshold', time: '1 hour ago', user: 'system' },
    { id: 4, type: 'error', message: 'Failed login attempt', time: '2 hours ago', user: 'unknown' },
    { id: 5, type: 'info', message: 'Database backup completed', time: '3 hours ago', user: 'system' },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          System Logs
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor system activity and events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: '15.2K', type: 'all' },
          { label: 'Info', value: '12.1K', type: 'info' },
          { label: 'Warnings', value: '2.8K', type: 'warning' },
          { label: 'Errors', value: '325', type: 'error' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <FileText className="w-8 h-8 text-blue-500 mb-3" />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <Filter className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          <select className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border focus:ring-2 focus:ring-blue-500 outline-none`}>
            <option>All Logs</option>
            <option>Info</option>
            <option>Success</option>
            <option>Warning</option>
            <option>Error</option>
          </select>
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}">
          {logs.map(log => (
            <div key={log.id} className={`p-4 hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} transition-colors`}>
              <div className="flex items-start gap-4">
                {getLogIcon(log.type)}
                <div className="flex-1">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.message}</p>
                  <div className={`flex items-center gap-4 mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>{log.time}</span>
                    <span>•</span>
                    <span>{log.user}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLogs;
