import { useEffect, useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts'; // NOSONAR
import { Users, Clock, TrendingDown, Link as LinkIcon, Smartphone, Tablet, Monitor, UserPlus } from 'lucide-react';
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

interface CountryData {
  name: string;
  code: string; // 2-letter country code for flag
  users: number;
}

interface LiveEvent {
  id: number;
  countryCode: string;
  city: string;
  action: string;
  target: string;
}

interface RealtimeAnalytics {
  liveUsers: number;
  avgSessionDuration: number; // in seconds
  bounceRate: number; // percentage
  pageViewsHistory: AnalyticsDataPoint[];
  deviceBreakdown: DeviceData[];
  referrers: ReferrerData[];
  topPages: TopPageData[];
  topCountries: CountryData[];
  userSegments: { new: number; returning: number };
  liveEvents: LiveEvent[];
}

// --- Fungsi Simulasi untuk Mengambil Data Analitik Real-time ---
const fetchAnalyticsData = async (): Promise<RealtimeAnalytics> => {
  // Simulasi delay jaringan
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulasi data yang berubah
  const liveUsers = Math.floor(Math.random() * (150 - 20) + 20);
  const bounceRate = parseFloat((Math.random() * (60 - 30) + 30).toFixed(1));
  const avgSessionDuration = Math.floor(Math.random() * (300 - 60) + 60);
  const newUserPercent = Math.random() * (80 - 50) + 50;

  const pageViewsHistory = Array.from({ length: 30 }).map((_, i) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - (30 - i));
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''),
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

  const topCountries: CountryData[] = [
    { name: 'Indonesia', code: 'id', users: Math.floor(Math.random() * 300) },
    { name: 'United States', code: 'us', users: Math.floor(Math.random() * 200) },
    { name: 'India', code: 'in', users: Math.floor(Math.random() * 150) },
    { name: 'Germany', code: 'de', users: Math.floor(Math.random() * 100) },
    { name: 'United Kingdom', code: 'gb', users: Math.floor(Math.random() * 90) },
  ].sort((a, b) => b.users - a.users);

  const userSegments = {
    new: Math.round((liveUsers * newUserPercent) / 100),
    returning: Math.round((liveUsers * (100 - newUserPercent)) / 100),
  };

  const liveEvents: LiveEvent[] = Array.from({ length: 5 }).map((_, i) => ({
    id: Date.now() + i,
    countryCode: ['id', 'us', 'in', 'de', 'gb'][Math.floor(Math.random() * 5)],
    city: ['Jakarta', 'New York', 'Bangalore', 'Berlin', 'London'][Math.floor(Math.random() * 5)],
    action: 'is viewing',
    target: ['/', '/projects', '/about', '/contact'][Math.floor(Math.random() * 4)],
  }));

  return { 
    liveUsers, bounceRate, avgSessionDuration, pageViewsHistory, deviceBreakdown, 
    referrers, topPages, topCountries, userSegments, liveEvents 
  };
};

const DEVICE_COLORS = { 
  Desktop: '#f59e0b', // amber-500
  Mobile: '#fb923c', // orange-400
  Tablet: '#facc15'  // yellow-400
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState<RealtimeAnalytics | null>(null);

  useEffect(() => {
    const updateAnalytics = () => {
      fetchAnalyticsData().then(setAnalytics);
    };
    updateAnalytics();
    const intervalId = setInterval(updateAnalytics, 3000); // Update lebih cepat untuk nuansa real-time
    return () => clearInterval(intervalId);
  }, []);

  const kpiData = useMemo(() => {
    if (!analytics) return [];
    const sessionMinutes = Math.floor(analytics.avgSessionDuration / 60);
    const sessionSeconds = analytics.avgSessionDuration % 60;

    return [
      { title: 'Users Online', value: analytics.liveUsers.toString(), icon: <Users className="w-6 h-6" />, trend: 'Right now', isPositive: true, color: 'text-amber-400' },
      { title: 'Avg. Session', value: `${sessionMinutes}m ${sessionSeconds}s`, icon: <Clock className="w-6 h-6" />, trend: 'Last 30 mins', isPositive: true, color: 'text-amber-400' },
      { title: 'Bounce Rate', value: `${analytics.bounceRate}%`, icon: <TrendingDown className="w-6 h-6" />, trend: 'Lower is better', isPositive: analytics.bounceRate < 50, color: 'text-amber-400' },
      { title: 'New / Returning', value: `${analytics.userSegments.new} / ${analytics.userSegments.returning}`, icon: <UserPlus className="w-6 h-6" />, trend: 'Live users', isPositive: true, color: 'text-amber-400' },
    ];
  }, [analytics]);

  return (
    <div className="p-2 sm:p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Website Analytics</h1>

      {/* KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Views History Chart */}
        <ChartCard title="Page Views (Last 30 Mins)" className="lg:col-span-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.pageViewsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' }} cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }} />
              <Line type="monotone" dataKey="views" name="Page Views" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
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
        <ChartCard title="Top Pages" className="lg:col-span-2 h-96">
          <div className="w-full h-full overflow-y-auto pr-2">
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

        {/* Top Referrers Chart */}
        <ChartCard title="Top Referrers" className="lg:col-span-2 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.referrers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={80} tick={{ fill: '#cbd5e1' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' }} cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }} />
              <Bar dataKey="users" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Countries & Live Events */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Top Countries" className="h-96">
            <div className="w-full h-full overflow-y-auto pr-2">
              <ul className="space-y-3">
                {analytics?.topCountries.map((country) => (
                  <li key={country.code} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <img src={`https://flagcdn.com/w20/${country.code}.png`} alt={country.name} className="w-5 h-auto" />
                      <span className="text-slate-300">{country.name}</span>
                    </div>
                    <span className="font-semibold text-white">{country.users.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>

          <ChartCard title="Live Events" className="h-96">
            <div className="w-full h-full overflow-y-auto pr-2">
              <ul className="space-y-4 text-sm">
                {analytics?.liveEvents.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <img src={`https://flagcdn.com/w20/${event.countryCode}.png`} alt={event.city} className="w-5 h-auto mt-0.5" />
                    <div className="text-slate-400">
                      A visitor from <span className="font-semibold text-slate-200">{event.city}</span> {event.action} <a href="#" className="font-semibold text-amber-400 hover:underline">{event.target}</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Analytics;