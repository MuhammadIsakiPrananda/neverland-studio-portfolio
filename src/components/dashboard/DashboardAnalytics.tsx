import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import api from '../../services/apiService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, Users, Eye, MousePointer, FileText } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardAnalyticsProps {
  theme: Theme;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, visitorsRes, trafficRes, pagesRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/visitors'),
        api.get('/admin/analytics/traffic'),
        api.get('/admin/analytics/pages')
      ]);

      if (overviewRes.data.success) setOverview(overviewRes.data.data);
      if (visitorsRes.data.success) setVisitors(visitorsRes.data.data);
      if (trafficRes.data.success) setTraffic(trafficRes.data.data);
      if (pagesRes.data.success) setPages(pagesRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Visitor Trends Chart Data
  const visitorChartData = {
    labels: visitors.map(v => new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Visitors',
        data: visitors.map(v => v.visitors),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Page Views',
        data: visitors.map(v => v.page_views),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Traffic Sources Chart Data
  const trafficChartData = {
    labels: traffic.map(t => t.source),
    datasets: [{
      data: traffic.map(t => t.visitors),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  // Popular Pages Chart Data
  const pagesChartData = {
    labels: pages.map(p => p.page),
    datasets: [{
      label: 'Page Views',
      data: pages.map(p => p.views),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#cbd5e1' : '#475569'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
        grid: { color: isDark ? '#334155' : '#e2e8f0' }
      },
      y: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
        grid: { color: isDark ? '#334155' : '#e2e8f0' }
      }
    }
  };

  const stats = overview ? [
    { label: 'Total Contacts', value: overview.total_contacts, icon: Users, change: `+${overview.contacts_this_month} this month` },
    { label: 'Total Users', value: overview.total_users, icon: Users, change: `+${overview.users_this_month} this month` },
    { label: 'Enrollments', value: overview.total_enrollments, icon: FileText, change: `+${overview.enrollments_this_month} this month` },
    { label: 'Consultations', value: overview.total_consultations, icon: MousePointer, change: `+${overview.consultations_this_month} this month` }
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Analytics Dashboard
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor your website performance and user engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trends */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Visitor Trends (Last 30 Days)
          </h3>
          <div className="h-64">
            <Line data={visitorChartData} options={chartOptions} />
          </div>
        </div>

        {/* Traffic Sources */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Traffic Sources
          </h3>
          <div className="h-64">
            <Pie data={trafficChartData} options={{ ...chartOptions, scales: undefined }} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Popular Pages
        </h3>
        <div className="h-64">
          <Bar data={pagesChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
