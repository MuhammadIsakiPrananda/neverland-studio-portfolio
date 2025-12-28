import React from 'react';
import type { Theme } from '../../types';
import { FileText, Download, TrendingUp } from 'lucide-react';

interface DashboardReportsProps {
  theme: Theme;
}

const DashboardReports: React.FC<DashboardReportsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Reports
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Generate and download business reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Monthly Report', description: 'Comprehensive monthly business metrics', icon: FileText },
          { title: 'Analytics Report', description: 'Detailed analytics and insights', icon: TrendingUp },
          { title: 'Revenue Report', description: 'Financial performance overview', icon: FileText },
          { title: 'User Activity Report', description: 'User engagement statistics', icon: TrendingUp }
        ].map((report, idx) => {
          const Icon = report.icon;
          return (
            <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.title}</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{report.description}</p>
              <button className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} transition-colors flex items-center justify-center gap-2`}>
                <Download className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardReports;
