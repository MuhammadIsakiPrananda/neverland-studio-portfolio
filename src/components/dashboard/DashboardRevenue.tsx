import React from 'react';
import type { Theme } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, LineChart } from 'lucide-react';

interface DashboardRevenueProps {
  theme: Theme;
}

const DashboardRevenue: React.FC<DashboardRevenueProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const monthlyData = [
    { month: 'Jan', revenue: 45000000 },
    { month: 'Feb', revenue: 52000000 },
    { month: 'Mar', revenue: 48000000 },
    { month: 'Apr', revenue: 61000000 },
    { month: 'May', revenue: 55000000 },
    { month: 'Jun', revenue: 67000000 },
    { month: 'Jul', revenue: 72000000 },
    { month: 'Aug', revenue: 68000000 },
    { month: 'Sep', revenue: 75000000 },
    { month: 'Oct', revenue: 82000000 },
    { month: 'Nov', revenue: 88000000 },
    { month: 'Dec', revenue: 95000000 }
  ];

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = totalRevenue / monthlyData.length;
  const growth = ((monthlyData[11].revenue - monthlyData[10].revenue) / monthlyData[10].revenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Revenue Analytics
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Track your business revenue and financial performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: `+${growth}%`, icon: DollarSign, color: 'green' },
          { label: 'This Month', value: formatCurrency(monthlyData[11].revenue), change: '+8%', icon: TrendingUp, color: 'blue' },
          { label: 'Average Monthly', value: formatCurrency(avgRevenue), change: '+12%', icon: BarChart3, color: 'purple' },
          { label: 'Growth Rate', value: `${growth}%`, change: '+2%', icon: LineChart, color: 'cyan' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Monthly Revenue Trend
        </h2>
        <div className="h-80 flex items-end justify-between gap-2">
          {monthlyData.map((data, index) => {
            const height = (data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className={`w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-500 transition-all hover:opacity-80 cursor-pointer`} style={{ height: `${height}%` }} title={formatCurrency(data.revenue)} />
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardRevenue;
