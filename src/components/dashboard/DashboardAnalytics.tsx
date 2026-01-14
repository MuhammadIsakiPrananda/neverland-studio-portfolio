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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="space-y-2">
        <h1 className={`text-3xl font-bold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Analytics Dashboard
        </h1>
        <p className={`text-sm font-normal flex items-center gap-2 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`} />
          Monitor your website performance and user engagement
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className={`group relative overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${
              isDark
                ? 'border-slate-800/50 bg-slate-900/40 hover:border-slate-700/60'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <div className={`relative p-3 rounded-xl border group-hover:border-primary/30 transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/50'
                        : 'bg-slate-100/80 border-slate-200'
                    }`}>
                      <Icon className={`w-5 h-5 group-hover:text-primary transition-colors duration-300 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`} />
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={`font-semibold px-2.5 py-0.5 text-xs ${
                    isDark
                      ? 'border-slate-700/50 bg-slate-800/40 text-slate-400'
                      : 'border-slate-300 bg-slate-100/80 text-slate-600'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                    +{stat.change.match(/\d+/)?.[0] || 0}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-black ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {stat.value.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Visitor Trends */}
        <Card className={`border backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 ${
          isDark
            ? 'border-slate-800/50 bg-slate-900/40'
            : 'border-slate-200 bg-white'
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className={`flex items-center gap-2 text-lg font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <div className={`p-1.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50'
                  : 'bg-slate-100/80 border-slate-200'
              }`}>
                <Eye className={`w-4 h-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
              </div>
              Visitor Trends
            </CardTitle>
            <CardDescription className={`text-xs ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>Performance metrics over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 p-2">
              <Line data={visitorChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className={`border backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 ${
          isDark
            ? 'border-slate-800/50 bg-slate-900/40'
            : 'border-slate-200 bg-white'
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className={`flex items-center gap-2 text-lg font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <div className={`p-1.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50'
                  : 'bg-slate-100/80 border-slate-200'
              }`}>
                <MousePointer className={`w-4 h-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
              </div>
              Traffic Sources
            </CardTitle>
            <CardDescription className={`text-xs ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 p-2 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Pie data={trafficChartData} options={{ ...chartOptions, scales: undefined }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Pages */}
      <Card className={`border backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 ${
        isDark
          ? 'border-slate-800/50 bg-slate-900/40'
          : 'border-slate-200 bg-white'
      }`}>
        <CardHeader className="pb-4">
          <CardTitle className={`flex items-center gap-2 text-lg font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <div className={`p-1.5 rounded-lg border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'bg-slate-100/80 border-slate-200'
            }`}>
              <FileText className={`w-4 h-4 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`} />
            </div>
            Popular Pages
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">Most visited pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 p-2">
            <Bar data={pagesChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
