import React from 'react';
import type { Theme } from '../../types';
import { Database as DatabaseIcon, HardDrive, Server, Activity, PieChart, BarChart3 } from 'lucide-react';

interface DashboardDatabaseProps {
  theme: Theme;
}

const DashboardDatabase: React.FC<DashboardDatabaseProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const tables = [
    { name: 'users', records: '2,456', size: '48.2 MB', growth: '+12%' },
    { name: 'projects', records: '1,234', size: '156.8 MB', growth: '+8%' },
    { name: 'files', records: '15,678', size: '2.4 GB', growth: '+25%' },
    { name: 'analytics', records: '45,890', size: '892.5 MB', growth: '+15%' },
    { name: 'sessions', records: '8,234', size: '124.6 MB', growth: '+5%' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Database Management
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor database performance and storage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: '73.5K', icon: DatabaseIcon, color: 'blue' },
          { label: 'Database Size', value: '3.6 GB', icon: HardDrive, color: 'green' },
          { label: 'Active Connections', value: '24', icon: Activity, color: 'purple' },
          { label: 'Query Speed', value: '12ms', icon: Server, color: 'cyan' }
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
            Database Tables
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <tr>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Table Name</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Records</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Size</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Growth</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {tables.map((table, index) => (
                <tr key={index} className={`${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition-colors`}>
                  <td className={`p-4 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{table.name}</td>
                  <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{table.records}</td>
                  <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{table.size}</td>
                  <td className="p-4">
                    <span className="text-green-500 font-medium">{table.growth}</span>
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

export default DashboardDatabase;
