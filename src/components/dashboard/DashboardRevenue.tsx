import React, { useState } from 'react';
import type { Theme } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, Target, Percent } from 'lucide-react';

interface DashboardRevenueProps {
  theme: Theme;
}

const DashboardRevenue: React.FC<DashboardRevenueProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [selectedView, setSelectedView] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', revenue: 45000000, target: 50000000, projects: 12 },
    { month: 'Feb', revenue: 52000000, target: 50000000, projects: 15 },
    { month: 'Mar', revenue: 48000000, target: 50000000, projects: 13 },
    { month: 'Apr', revenue: 55000000, target: 50000000, projects: 16 },
    { month: 'May', revenue: 51000000, target: 50000000, projects: 14 },
    { month: 'Jun', revenue: 58000000, target: 55000000, projects: 18 },
  ];

  const revenueByCategory = [
    { category: 'Web Development', amount: 85000000, percentage: 42, change: '+15%' },
    { category: 'Mobile Apps', amount: 60000000, percentage: 30, change: '+8%' },
    { category: 'IT Consulting', amount: 35000000, percentage: 18, change: '+22%' },
    { category: 'UI/UX Design', amount: 20000000, percentage: 10, change: '+5%' },
  ];

  const topClients = [
    { name: 'PT Global Tech', revenue: 25000000, projects: 5, trend: 'up' },
    { name: 'Startup Indonesia', revenue: 18000000, projects: 3, trend: 'up' },
    { name: 'CV Sukses Mandiri', revenue: 15000000, projects: 4, trend: 'down' },
    { name: 'Digital Agency', revenue: 12000000, projects: 2, trend: 'up' },
  ];

  const stats = [
    { label: 'Total Revenue', value: 'Rp 145M', change: '+12.5%', up: true, icon: DollarSign, color: 'green' },
    { label: 'This Month', value: 'Rp 58M', change: '+5.4%', up: true, icon: TrendingUp, color: 'blue' },
    { label: 'Last Month', value: 'Rp 51M', change: '+2.1%', up: true, icon: Calendar, color: 'purple' },
    { label: 'Target Achievement', value: '105%', change: '+5%', up: true, icon: Target, color: 'orange' }
  ];

  const formatCurrency = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Revenue Tracking
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Monitor financial performance and revenue metrics
          </p>
        </div>
        <div className="flex gap-2">
          {['monthly', 'quarterly', 'yearly'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedView === view
                  ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'bg-green-500/10 text-green-500',
            blue: 'bg-blue-500/10 text-blue-500',
            purple: 'bg-purple-500/10 text-purple-500',
            orange: 'bg-orange-500/10 text-orange-500'
          };
          
          return (
            <div key={idx} className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70' : 'bg-white border-slate-200 hover:shadow-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Performance */}
      <div className={`p-6 rounded-xl border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Monthly Performance Overview
        </h3>
        <div className="space-y-5">
          {monthlyData.map((data, idx) => {
            const percentage = (data.revenue / data.target) * 100;
            const achieved = percentage >= 100;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold w-12 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {data.month}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      {data.projects} projects
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {formatCurrency(data.revenue)} / {formatCurrency(data.target)}
                    </span>
                    <span className={`text-sm font-bold ${achieved ? 'text-green-500' : 'text-yellow-500'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div 
                    className={`h-full transition-all duration-500 ${achieved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Revenue by Category
            </h3>
            <Percent className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </div>
          <div className="space-y-4">
            {revenueByCategory.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-green-500">
                    {item.change}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {formatCurrency(item.amount)}
                  </span>
                  <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Top Clients
          </h3>
          <div className="space-y-4">
            {topClients.map((client, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-slate-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {client.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {client.projects} projects
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {formatCurrency(client.revenue)}
                    </p>
                    {client.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 ml-auto" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 ml-auto" />
                    )}
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

export default DashboardRevenue;
