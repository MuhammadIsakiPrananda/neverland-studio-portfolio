import React from 'react';
import type { Theme } from '../../types';
import { Database, HardDrive, Table, RefreshCw } from 'lucide-react';

interface DashboardDatabaseProps {
  theme: Theme;
}

const DashboardDatabase: React.FC<DashboardDatabaseProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const tables = [
    { name: 'users', rows: 1250, size: '2.5 MB' },
    { name: 'projects', rows: 89, size: '1.2 MB' },
    { name: 'contacts', rows: 3400, size: '5.8 MB' },
    { name: 'newsletters', rows: 2500, size: '1.1 MB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Database Statistics
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor database health and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Tables', value: '24', icon: Table },
          { label: 'Total Records', value: '12.5K', icon: Database },
          { label: 'Database Size', value: ' 45.2 MB', icon: HardDrive }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Icon className="w-8 h-8 text-blue-500 mb-3" />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Database Tables</h3>
          <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <table className="w-full">
          <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <tr>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Table Name</th>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Rows</th>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Size</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, idx) => (
              <tr key={idx} className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <td className={`p-4 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{table.name}</td>
                <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{table.rows.toLocaleString()}</td>
                <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{table.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardDatabase;
