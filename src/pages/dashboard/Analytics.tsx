import { useEffect, useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, TrendingDown, Link as LinkIcon, BarChart2, Smartphone, Tablet, Monitor } from 'lucide-react';
import KpiCard from './KpiCard';
import ChartCard from './ChartCard';

// --- Tipe Data Baru untuk Analitik Real-time ---
interface AnalyticsDataPoint {
  time: string;
  views: number;
}

interface DeviceData {
  name: 'Desktop' | 'Mobile' | 'Tablet';
  value: number; // This property is used by recharts dataKey
  icon: React.ReactNode;
  [key: string]: any; // Index signature to satisfy recharts
}

interface ReferrerData {
  name: string;
  users: number;
}

interface TopPageData {
  path: string;
  views: number;
}

interface RealtimeAnalytics {
  liveUsers: number;
  avgSessionDuration: number; // in seconds
  bounceRate: number; // percentage
  pageViewsHistory: AnalyticsDataPoint[];
  deviceBreakdown: DeviceData[];
  referrers: ReferrerData[];
  topPages: TopPageData[];
}

// --- Fungsi Simulasi untuk Mengambil Data Analitik Real-time ---
const fetchAnalyticsData = async (): Promise<RealtimeAnalytics> => {
  // Simulasi delay jaringan
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulasi data yang berubah
  const liveUsers = Math.floor(Math.random() * (150 - 20) + 20);
  const bounceRate = parseFloat((Math.random() * (60 - 30) + 30).toFixed(1));
  const avgSessionDuration = Math.floor(Math.random() * (300 - 60) + 60);

  const pageViewsHistory = Array.from({ length: 12 }).map((_, i) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - (12 - i));
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      views: Math.floor(Math.random() * 100) + 10,
    };
  });

  const deviceBreakdown: DeviceData[] = [
    { name: 'Desktop', value: Math.floor(Math.random() * 500), icon: <Monitor className="w-4 h-4" /> },
    { name: 'Mobile', value: Math.floor(Math.random() * 800), icon: <Smartphone className="w-4 h-4" /> },
    { name: 'Tablet', value: Math.floor(Math.random() * 200), icon: <Tablet className="w-4 h-4" /> },
  ];

  const referrers: ReferrerData[] = [
    { name: 'Google', users: Math.floor(Math.random() * 200) },
    { name: 'Direct', users: Math.floor(Math.random() * 150) },
    { name: 'Facebook', users: Math.floor(Math.random() * 100) },
    { name: 'GitHub', users: Math.floor(Math.random() * 80) },
    { name: 'Other', users: Math.floor(Math.random() * 50) },
  ].sort((a, b) => b.users - a.users);

  const topPages: TopPageData[] = [
    { path: '/', views: Math.floor(Math.random() * 1000) },
    { path: '/projects', views: Math.floor(Math.random() * 700) },
    { path: '/about', views: Math.floor(Math.random() * 500) },
    { path: '/contact', views: Math.floor(Math.random() * 300) },
    { path: '/blog/post-1', views: Math.floor(Math.random() * 250) },
  ].sort((a, b) => b.views - a.views);

  return { liveUsers, bounceRate, avgSessionDuration, pageViewsHistory, deviceBreakdown, referrers, topPages };
};

const DEVICE_COLORS = { Desktop: '#8884d8', Mobile: '#82ca9d', Tablet: '#ffc658' };

const Analytics = () => {
  const [analytics, setAnalytics] = useState<RealtimeAnalytics | null>(null);

  useEffect(() => {
    const updateAnalytics = () => {
      fetchAnalyticsData().then(setAnalytics);
    };
    updateAnalytics();
    const intervalId = setInterval(updateAnalytics, 5000); // Update setiap 5 detik
    return () => clearInterval(intervalId);
  }, []);

  const kpiData = useMemo(() => {
    if (!analytics) return [];
    const sessionMinutes = Math.floor(analytics.avgSessionDuration / 60);
    const sessionSeconds = analytics.avgSessionDuration % 60;

    return [
      { title: 'Users Online', value: analytics.liveUsers.toString(), icon: <Users className="w-6 h-6" />, trend: 'Right now', isPositive: true, color: 'text-emerald-400' },
      { title: 'Avg. Session', value: `${sessionMinutes}m ${sessionSeconds}s`, icon: <Clock className="w-6 h-6" />, trend: 'Last 30 mins', isPositive: true, color: 'text-sky-400' },
      { title: 'Bounce Rate', value: `${analytics.bounceRate}%`, icon: <TrendingDown className="w-6 h-6" />, trend: 'Lower is better', isPositive: analytics.bounceRate < 40, color: 'text-amber-400' },
      { title: 'Page Views', value: analytics.pageViewsHistory.reduce((acc, curr) => acc + curr.views, 0).toLocaleString(), icon: <BarChart2 className="w-6 h-6" />, trend: 'Last hour', isPositive: true, color: 'text-violet-400' },
    ];
  }, [analytics]);

  return (
    <div className="p-2 sm:p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Website Analytics</h1>

      {/* KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpiData.length > 0
          ? kpiData.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)
          : Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl animate-pulse">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Views History Chart */}
        <ChartCard title="Page Views (Last Hour)" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.pageViewsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' }} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
              <Bar dataKey="views" name="Page Views" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Breakdown Chart */}
        <ChartCard title="Device Breakdown" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics?.deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {analytics?.deviceBreakdown.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={DEVICE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' }} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Pages Table */}
        <ChartCard title="Top Pages" className="lg:col-span-2">
          <div className="w-full h-full overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase sticky top-0 bg-slate-800/50 backdrop-blur-sm">
                <tr>
                  <th className="py-3 px-4">Page Path</th>
                  <th className="py-3 px-4 text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topPages.map((page) => (
                  <tr key={page.path} className="border-t border-slate-700">
                    <td className="py-3 px-4 font-medium text-slate-300 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-slate-500" />
                      {page.path}
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-right">{page.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;