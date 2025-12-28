import React from 'react';
import type { Theme } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface DashboardRevenueProps {
  theme: Theme;
}

const DashboardRevenue: React.FC<DashboardRevenueProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const monthlyData = [
    { month: 'Jan', revenue: 45000000, target: 50000000 },
    { month: 'Feb', revenue: 52000000, target: 50000000 },
    { month: 'Mar', revenue: 48000000, target: 50000000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Revenue Tracking
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor financial performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: 'Rp 145M', change: '+12%', up: true },
          { label: 'This Month', value: 'Rp 52M', change: '+5%', up: true },
          { label: 'Last Month', value: 'Rp 48M', change: '-2%', up: false },
          { label: 'Average', value: 'Rp 48M', change: '+8%', up: true }
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <span className={`flex items-center gap-1 text-xs ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Monthly Performance
        </h3>
        <div className="space-y-4">
          {monthlyData.map((data, idx) => {
            const percentage = (data.revenue / data.target) * 100;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{data.month}</span>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp {(data.revenue / 1000000).toFixed(0)}M / Rp {(data.target / 1000000).toFixed(0)}M
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className={`h-full ${percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardRevenue;
