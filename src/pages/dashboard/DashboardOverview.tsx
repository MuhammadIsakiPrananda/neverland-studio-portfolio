import { Cpu, HardDrive, MemoryStick, Globe, ArrowDownCircle, ArrowUpCircle, Activity } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import KpiCard from './KpiCard';
import type { ServerMetrics, TopProcess, SuspiciousActivity } from './types';
import { CpuUsageChart } from './CpuUsageChart';
import { NetworkUsageChart } from './NetworkUsageChart';
import { SystemStatusPanel } from './SystemStatusPanel';
import { TopProcessesPanel } from './TopProcessesPanel';
import { SuspiciousActivityLog } from './SuspiciousActivityLog';

// --- PENTING ---
// Fungsi simulasi untuk menghasilkan data metrik lengkap, termasuk riwayat grafik.
const fetchFullSimulatedMetrics = async (): Promise<ServerMetrics> => {
  // Simulasi delay jaringan
  await new Promise(resolve => setTimeout(resolve, 150));

  const now = new Date();
  const cpuHistory = Array.from({ length: 60 }).map((_, i) => ({
    time: new Date(now.getTime() - (60 - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    usage: parseFloat((Math.random() * (75 - 5) + 5).toFixed(2)),
  }));
  const networkHistory = Array.from({ length: 60 }).map((_, i) => ({
    time: new Date(now.getTime() - (60 - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    in: parseFloat((Math.random() * (500 - 50) + 50).toFixed(2)),
    out: parseFloat((Math.random() * (200 - 20) + 20).toFixed(2)),
  }));
  const topProcesses: TopProcess[] = [
    { pid: 1101, user: 'www-data', cpu: parseFloat((Math.random() * 15).toFixed(2)), mem: 2.5, command: 'nginx: worker process' },
    { pid: 987, user: 'postgres', cpu: parseFloat((Math.random() * 10).toFixed(2)), mem: 4.1, command: 'postgres: 13/main' },
    { pid: 2345, user: 'root', cpu: parseFloat((Math.random() * 5).toFixed(2)), mem: 1.2, command: 'node /app/server.js' },
    { pid: 1, user: 'root', cpu: 0.1, mem: 0.8, command: '/sbin/init' },
    { pid: 1567, user: 'isaki', cpu: parseFloat((Math.random() * 2).toFixed(2)), mem: 0.9, command: 'sshd: isaki@pts/0' },
  ].sort((a, b) => b.cpu - a.cpu);
  const suspiciousActivities: SuspiciousActivity[] = [
    { id: 1, timestamp: '2024-05-23 10:15:02', level: 'Critical', sourceIp: '185.191.171.12', event: 'Failed SSH login (user: root)' },
    { id: 2, timestamp: '2024-05-23 10:14:58', level: 'Warning', sourceIp: '45.9.20.78', event: 'Port scan detected on port 22, 80, 443' },
    { id: 3, timestamp: '2024-05-23 09:55:10', level: 'Critical', sourceIp: '185.191.171.12', event: 'Failed SSH login (user: root)' },
    { id: 4, timestamp: '2024-05-23 09:40:21', level: 'Info', sourceIp: '103.224.182.242', event: 'Anomalous traffic pattern from known botnet' },
    { id: 5, timestamp: '2024-05-23 09:30:05', level: 'Warning', sourceIp: '192.168.1.105', event: 'Multiple 404 errors from internal IP' },
  ];

  return {
    websiteUptime: "99.99%",
    cpuUsage: cpuHistory[cpuHistory.length - 1].usage, // Ambil nilai terakhir dari riwayat
    ramUsage: parseFloat((Math.random() * (80 - 20) + 20).toFixed(2)),
    diskUsage: parseFloat((Math.random() * (90 - 40) + 40).toFixed(2)),
    networkIn: networkHistory[networkHistory.length - 1].in,
    networkOut: networkHistory[networkHistory.length - 1].out,
    loadAverage: {
      one: parseFloat((Math.random() * 1.5).toFixed(2)),
      five: parseFloat((Math.random() * 1.0).toFixed(2)),
      fifteen: parseFloat((Math.random() * 0.8).toFixed(2)),
    },
    cpuHistory,
    networkHistory,
    systemInfo: { os: "Simulated OS", ip: "127.0.0.1", uptime: "Simulated Uptime" },
    topProcesses,
    suspiciousActivities,
    services: { 'Web Server (Nginx)': 'Active', 'Database (PostgreSQL)': 'Active', 'Firewall (UFW)': 'Active' },
  };
};

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null);

  useEffect(() => {
    // Fungsi untuk mengambil data dan memperbarui state
    const updateMetrics = async () => {
      try {
        const newMetrics = await fetchFullSimulatedMetrics();
        setMetrics(newMetrics); // Langsung ganti state dengan data baru yang lengkap
      } catch (error) {
        console.error("Failed to fetch simulated metrics:", error);
      }
    };

    updateMetrics(); // Panggil sekali saat komponen dimuat
  }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali saat komponen dimuat

  const kpiData = useMemo(() => {
    if (!metrics) return []; // Kembalikan array kosong jika data belum ada
    return [
      {
        title: 'CPU Usage',
        value: `${metrics.cpuUsage}%`,
        icon: <Cpu className="w-6 h-6" />,
        trend: metrics.cpuUsage > 80 ? 'High usage' : 'Normal',
        isPositive: metrics.cpuUsage <= 80,
        color: 'text-sky-400',
      },
      {
        title: 'RAM Usage',
        value: `${metrics.ramUsage}%`,
        icon: <MemoryStick className="w-5 h-5" />,
        trend: metrics.ramUsage > 85 ? 'Nearing limit' : 'Stable',
        isPositive: metrics.ramUsage <= 85,
        color: 'text-emerald-400',
      },
      {
        title: 'Disk Usage',
        value: `${metrics.diskUsage}%`,
        icon: <HardDrive className="w-5 h-5" />,
        trend: metrics.diskUsage > 90 ? 'Almost full' : 'Sufficient space',
        isPositive: metrics.diskUsage <= 90,
        color: 'text-amber-400',
      },
      {
        title: 'Website Uptime (24h)',
        value: metrics.websiteUptime,
        icon: <Globe className="w-5 h-5" />,
        trend: 'All systems operational',
        isPositive: true,
        color: 'text-violet-400',
      },
      {
        title: 'Network I/O',
        value: (
          <div className="flex items-center gap-2 text-base font-semibold">
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-teal-900/50 text-teal-400">
              <ArrowDownCircle className="w-4 h-4" />
              <span>{metrics.networkIn.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-rose-900/50 text-rose-400">
              <ArrowUpCircle className="w-4 h-4" />
              <span>{metrics.networkOut.toFixed(1)}</span>
            </div>
          </div>
        ),
        icon: <Globe className="w-5 h-5" />, // Menggunakan ikon Globe yang lebih umum
        trend: 'I/O Activity',
        isPositive: true, // Bisa dibuat lebih dinamis jika perlu
        color: 'text-teal-400', // Warna dominan
      },
      {
        title: 'Load Avg (1m)',
        value: `${metrics.loadAverage.one}`,
        icon: <Activity className="w-5 h-5" />,
        trend: metrics.loadAverage.one > 1 ? 'High load' : 'Normal load',
        isPositive: metrics.loadAverage.one <= 1,
        color: 'text-fuchsia-400',
      },
    ];
  }, [metrics]); // Memoize akan berjalan lagi jika `metrics` berubah

  return (
    <div className="p-2 sm:p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        {kpiData.length > 0
          ? kpiData.map((kpi) => <KpiCard key={kpi.title} {...kpi} value={kpi.value as any} />)
          : Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl animate-pulse">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))
        }
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">{metrics ? <CpuUsageChart data={metrics.cpuHistory} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}</div>
        <div>{metrics ? <SystemStatusPanel systemInfo={metrics.systemInfo} services={metrics.services} loadAverage={metrics.loadAverage} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}</div>
        <div className="xl:col-span-2">{metrics ? <NetworkUsageChart data={metrics.networkHistory} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}</div>
        <div>{metrics ? <TopProcessesPanel processes={metrics.topProcesses} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}</div>
      </div>
      {metrics ? <SuspiciousActivityLog activities={metrics.suspiciousActivities} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-96 animate-pulse"></div>}
    </div>
  );
};

export default DashboardOverview;