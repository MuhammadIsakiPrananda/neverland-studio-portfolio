import React from 'react';
import type { Theme } from '../../types';
import { Server, CheckCircle, XCircle, Clock, Zap, Globe, Database as DatabaseIcon, Shield } from 'lucide-react';

interface DashboardAPIProps {
  theme: Theme;
}

const DashboardAPI: React.FC<DashboardAPIProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const endpoints = [
    { path: '/api/users', method: 'GET', status: 'active', requests: '12.5K', avgTime: '45ms' },
    { path: '/api/projects', method: 'GET', status: 'active', requests: '8.2K', avgTime: '52ms' },
    { path: '/api/analytics', method: 'POST', status: 'active', requests: '5.3K', avgTime: '120ms' },
    { path: '/api/auth/login', method: 'POST', status: 'active', requests: '3.1K', avgTime: '65ms' },
    { path: '/api/webhooks', method: 'POST', status: 'degraded', requests: '892', avgTime: '350ms' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          API Management
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor and manage your API endpoints and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'API Status', value: 'Operational', icon: CheckCircle, color: 'green' },
          { label: 'Total Requests', value: '29.9K', icon: Globe, color: 'blue' },
          { label: 'Avg Response', value: '78ms', icon: Zap, color: 'yellow' },
          { label: 'Uptime', value: '99.9%', icon: Clock, color: 'purple' }
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
            API Endpoints
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <tr>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Endpoint</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Method</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Requests</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Avg Time</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {endpoints.map((endpoint, index) => (
                <tr key={index} className={`${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition-colors`}>
                  <td className={`p-4 font-mono text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{endpoint.path}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{endpoint.requests}</td>
                  <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{endpoint.avgTime}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${endpoint.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                      {endpoint.status === 'active' ? 'Active' : 'Degraded'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAPI;
