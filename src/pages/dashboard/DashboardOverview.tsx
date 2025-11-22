import { Cpu, HardDrive, MemoryStick, Globe, Server, Database, Power, ShieldCheck, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import KpiCard from './KpiCard';
import RecentActivityTable from './RecentActivityTable';

// --- Tipe Data Baru untuk Metrik yang Lebih Detail ---
interface CpuHistoryPoint {
  time: string;
  usage: number;
}

interface NetworkHistoryPoint {
  time: string;
  in: number; // KB/s
  out: number; // KB/s
}

type ServiceStatus = 'Active' | 'Inactive' | 'Error';

interface ServerMetrics {
  websiteUptime: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  cpuHistory: CpuHistoryPoint[];
  systemInfo: {
    os: string;
    ip: string;
    uptime: string;
  };
  services: {
    [key: string]: ServiceStatus;
  };
  networkHistory: NetworkHistoryPoint[];
}

// --- PENTING ---
// Ini adalah fungsi simulasi. Ganti bagian ini dengan logika pengambilan data
// dari API monitoring Anda yang sebenarnya (misalnya: UptimeRobot, Netdata, atau API custom Anda).
// Gunakan API Key Anda di sini untuk otentikasi jika diperlukan.
const fetchServerMetrics = async (): Promise<ServerMetrics> => {
  // Simulasi data real-time
  const randomCpu = (Math.random() * (75 - 5) + 5).toFixed(2);
  const randomRam = (Math.random() * (80 - 20) + 20).toFixed(2);
  const randomDisk = (Math.random() * (90 - 40) + 40).toFixed(2);
  const randomNetIn = (Math.random() * (500 - 50) + 50).toFixed(2); // KB/s
  const randomNetOut = (Math.random() * (200 - 20) + 20).toFixed(2); // KB/s

  // Untuk pengambilan data awal, kita buat riwayat kosong
  // Logika real-time akan mengisi ini di useEffect
  const cpuHistory: CpuHistoryPoint[] = [];
  
  // Simulasi riwayat Jaringan untuk 10 titik data terakhir (mode simulasi sederhana)
  const networkHistory = Array.from({ length: 10 }).map((_, i) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() - (10 - i) * 5);
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      in: parseFloat((Math.random() * (500 - 50) + 50).toFixed(2)),
      out: parseFloat((Math.random() * (200 - 20) + 20).toFixed(2)),
    };
  });


  // Simulasi status layanan (90% kemungkinan 'Active')
  const getServiceStatus = (): ServiceStatus => {
    const rand = Math.random();
    if (rand < 0.9) return 'Active';
    if (rand < 0.95) return 'Inactive';
    return 'Error';
  };

  // Simulasi delay jaringan
  await new Promise(resolve => setTimeout(resolve, 750));

  return {
    websiteUptime: "99.98%",
    cpuUsage: parseFloat(randomCpu),
    ramUsage: parseFloat(randomRam),
    diskUsage: parseFloat(randomDisk),
    networkIn: parseFloat(randomNetIn),
    networkOut: parseFloat(randomNetOut),
    cpuHistory,
    systemInfo: {
      os: "Debian GNU/Linux 12 (bookworm)",
      ip: "192.168.1.101",
      uptime: "28 days, 4 hours",
    },
    services: {
      'Web Server (Nginx)': getServiceStatus(),
      'Database (PostgreSQL)': getServiceStatus(),
      'Firewall (UFW)': 'Active',
    },
    networkHistory,
  };
};

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null);

  useEffect(() => {
    // Fungsi untuk mengambil data dan menjadwalkan pengambilan berikutnya
    const updateMetrics = async () => {
      const newMetrics = await fetchServerMetrics();
      
      setMetrics(prevMetrics => {
        // Titik data waktu saat ini
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Buat titik data riwayat CPU baru
        const newCpuPoint: CpuHistoryPoint = { time, usage: newMetrics.cpuUsage };
        // Ambil 14 data terakhir dan tambahkan yang baru (untuk efek scrolling)
        const updatedCpuHistory = [...(prevMetrics?.cpuHistory || []), newCpuPoint].slice(-15);

        // Jika ini adalah pemanggilan pertama, isi riwayat dengan data awal
        if (!prevMetrics) {
          for (let i = 0; i < 14; i++) {
            updatedCpuHistory.unshift({ time: '...', usage: 0 });
          }
        }

        return {
          ...newMetrics,
          cpuHistory: updatedCpuHistory,
          // networkHistory sekarang datang langsung dari newMetrics
        };
      });
    };

    // Panggil pertama kali saat komponen dimuat
    updateMetrics();

    // Set interval untuk mengambil data setiap 5 detik (5000 ms) untuk efek real-time
    const intervalId = setInterval(updateMetrics, 5000);

    // Membersihkan interval saat komponen di-unmount untuk mencegah memory leak
    return () => clearInterval(intervalId);
  }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali saat mount

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
        title: 'Network In',
        value: `${metrics.networkIn} KB/s`,
        icon: <ArrowDownCircle className="w-5 h-5" />,
        trend: 'Receiving data',
        isPositive: true,
        color: 'text-teal-400',
      },
      {
        title: 'Network Out',
        value: `${metrics.networkOut} KB/s`,
        icon: <ArrowUpCircle className="w-5 h-5" />,
        trend: 'Sending data',
        isPositive: true,
        color: 'text-rose-400',
      },
    ];
  }, [metrics]); // Memoize akan berjalan lagi jika `metrics` berubah

  // Komponen baru untuk grafik CPU
  const CpuUsageChart = ({ data }: { data: CpuHistoryPoint[] }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80">
      <h3 className="text-lg font-semibold text-white mb-4">CPU Usage History (Real-time)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#334155',
              color: '#cbd5e1',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="usage" stroke="#38bdf8" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  // Komponen baru untuk grafik Network
  const NetworkUsageChart = ({ data }: { data: NetworkHistoryPoint[] }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80">
      <h3 className="text-lg font-semibold text-white mb-4">Network Usage (Real-time)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorNetIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNetOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit=" KB/s" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: '#334155',
              color: '#cbd5e1',
            }}
            labelStyle={{ fontWeight: 'bold' }}
            formatter={(value: number, name: string) => [`${value} KB/s`, name === 'in' ? 'In' : 'Out']}
          />
          <Legend wrapperStyle={{ fontSize: '14px', bottom: 0 }} />
          <Area type="monotone" dataKey="in" name="In" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorNetIn)" strokeWidth={2} />
          <Area type="monotone" dataKey="out" name="Out" stroke="#fb7185" fillOpacity={1} fill="url(#colorNetOut)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  // Komponen baru untuk Info Sistem & Status Layanan
  const SystemStatusPanel = ({ systemInfo, services }: { systemInfo: ServerMetrics['systemInfo'], services: ServerMetrics['services'] }) => {
    const statusColors: Record<ServiceStatus, string> = {
      Active: 'bg-emerald-500',
      Inactive: 'bg-slate-500',
      Error: 'bg-red-500',
    };
    const serviceIcons = {
      'Web Server (Nginx)': <Server className="w-5 h-5" />,
      'Database (PostgreSQL)': <Database className="w-5 h-5" />,
      'Firewall (UFW)': <ShieldCheck className="w-5 h-5" />,
    };

    return (
      <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4">System & Services</h3>
        <div className="space-y-3 text-sm mb-6">
          <p className="flex justify-between items-center">
            <span className="text-slate-400">Operating System</span>
            <span className="font-medium text-white">{systemInfo.os}</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="text-slate-400">IP Address</span>
            <span className="font-medium text-white">{systemInfo.ip}</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="text-slate-400">Server Uptime</span>
            <span className="font-medium text-white">{systemInfo.uptime}</span>
          </p>
        </div>
        <h4 className="text-md font-semibold text-white mb-3">Service Status</h4>
        <div className="space-y-3">
          {Object.entries(services).map(([name, status]) => (
            <div key={name} className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-300">
                {serviceIcons[name as keyof typeof serviceIcons] || <Power className="w-5 h-5" />}
                <span>{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`}></div>
                <span className="font-medium text-white">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpiData.length > 0
          ? kpiData.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)
          : Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl animate-pulse">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))
        }
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {metrics ? <CpuUsageChart data={metrics.cpuHistory} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}
        {metrics ? <NetworkUsageChart data={metrics.networkHistory} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}
        {metrics ? <SystemStatusPanel systemInfo={metrics.systemInfo} services={metrics.services} /> : <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 animate-pulse"></div>}
      </div>
      <RecentActivityTable />
    </div>
  );
};

export default DashboardOverview;