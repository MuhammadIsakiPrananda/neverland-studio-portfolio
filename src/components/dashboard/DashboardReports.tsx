import React from 'react';
import type { Theme } from '../../types';
import { FileText, TrendingUp, Download, Calendar, BarChart3, Users, DollarSign, Activity } from 'lucide-react';

interface DashboardReportsProps {
  theme: Theme;
}

const DashboardReports: React.FC<DashboardReportsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const reports = [
    { id: '1', title: 'Monthly Performance Report', type: 'Analytics', date: '2025-12-26', size: '2.4 MB', icon: BarChart3 },
    { id: '2', title: 'User Activity Report', type: 'Users', date: '2025-12-25', size: '1.8 MB', icon: Users },
    { id: '3', title: 'Revenue Summary Q4 2025', type: 'Finance', date: '2025-12-24', size: '3.2 MB', icon: DollarSign },
    { id: '4', title: 'System Health Report', type: 'Technical', date: '2025-12-23', size: '890 KB', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Reports
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          View and download business reports and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: '124', icon: FileText, color: 'blue' },
          { label: 'This Month', value: '12', icon: Calendar, color: 'green' },
          { label: 'Downloads', value: '456', icon: Download, color: 'purple' },
          { label: 'Generated', value: '98', icon: TrendingUp, color: 'cyan' }
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
            Recent Reports
          </h2>
        </div>
        <div className="divide-y divide-slate-700">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className={`p-4 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{report.type}</span>
                      <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>{report.date}</span>
                      <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>{report.size}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardReports;
