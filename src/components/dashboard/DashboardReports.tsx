import React, { useState } from 'react';
import type { Theme } from '../../types';
import { FileText, Download, TrendingUp, BarChart3, PieChart, Users, Calendar, Filter } from 'lucide-react';

interface DashboardReportsProps {
  theme: Theme;
}

const DashboardReports: React.FC<DashboardReportsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const reports = [
    {
      id: 1,
      title: 'Monthly Business Report',
      description: 'Comprehensive monthly business metrics and performance indicators',
      icon: FileText,
      color: 'blue',
      size: '2.5 MB',
      lastGenerated: '2025-12-28',
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Analytics & Insights',
      description: 'Detailed analytics with user behavior and engagement statistics',
      icon: TrendingUp,
      color: 'green',
      size: '1.8 MB',
      lastGenerated: '2025-12-27',
      type: 'PDF'
    },
    {
      id: 3,
      title: 'Revenue Performance',
      description: 'Financial performance overview with revenue breakdown',
      icon: BarChart3,
      color: 'purple',
      size: '3.2 MB',
      lastGenerated: '2025-12-26',
      type: 'PDF'
    },
    {
      id: 4,
      title: 'User Activity Report',
      description: 'User engagement statistics and activity patterns',
      icon: Users,
      color: 'orange',
      size: '1.5 MB',
      lastGenerated: '2025-12-25',
      type: 'PDF'
    },
    {
      id: 5,
      title: 'Project Summary',
      description: 'Project status, completion rate, and deliverables overview',
      icon: PieChart,
      color: 'cyan',
      size: '2.1 MB',
      lastGenerated: '2025-12-24',
      type: 'PDF'
    },
    {
      id: 6,
      title: 'Client Feedback Report',
      description: 'Customer satisfaction and feedback analysis',
      icon: FileText,
      color: 'pink',
      size: '1.9 MB',
      lastGenerated: '2025-12-23',
      type: 'PDF'
    }
  ];

  const quickStats = [
    { label: 'Total Reports', value: '156', change: '+12%' },
    { label: 'Generated This Month', value: '24', change: '+8%' },
    { label: 'Downloaded', value: '89', change: '+15%' },
    { label: 'Scheduled', value: '12', change: '+3%' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hover: 'hover:bg-blue-500/20' },
      green: { bg: 'bg-green-500/10', text: 'text-green-500', hover: 'hover:bg-green-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', hover: 'hover:bg-purple-500/20' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', hover: 'hover:bg-orange-500/20' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', hover: 'hover:bg-cyan-500/20' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', hover: 'hover:bg-pink-500/20' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Reports & Analytics
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Generate and download comprehensive business reports
          </p>
        </div>
        <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors flex items-center gap-2`}>
          <Calendar className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Period Filter */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <Filter className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          const colors = getColorClasses(report.color);
          
          return (
            <div key={report.id} className={`group p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70' : 'bg-white border-slate-200 hover:shadow-slate-200'}`}>
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.bg} ${colors.hover} transition-colors mb-4`}>
                <Icon className={`w-7 h-7 ${colors.text}`} />
              </div>
              
              {/* Content */}
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {report.title}
              </h3>
              <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {report.description}
              </p>
              
              {/* Meta Info */}
              <div className={`flex items-center justify-between text-xs mb-4 pb-4 border-b ${isDark ? 'text-slate-500 border-slate-700' : 'text-slate-500 border-slate-200'}`}>
                <span>Size: {report.size}</span>
                <span className={`px-2 py-1 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>{report.type}</span>
              </div>
              
              <div className={`flex items-center justify-between text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                <span>Last Generated:</span>
                <span className="font-semibold">{report.lastGenerated}</span>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} transition-colors flex items-center justify-center gap-2 font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <FileText className="w-4 h-4" />
                  Generate
                </button>
                <button className={`px-4 py-2.5 rounded-lg ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardReports;
