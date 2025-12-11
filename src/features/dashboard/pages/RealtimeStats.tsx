import { useState, useEffect } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiShoppingCart,
  FiWifi,
  FiWifiOff,
  FiBarChart2,
  FiAlertTriangle,
} from "react-icons/fi";
import { format } from "date-fns";
// Ganti dengan URL backend Anda
const SOCKET_SERVER_URL = "http://localhost:4000";

interface DashboardData {
  activeUsers: number;
  newOrders: number;
  avgResponseTime: number; // ms
  errorRate: number; // percentage
  timestamp: string;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  return (
    <motion.span
      key={value}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0"
    >
      {value.toLocaleString("id-ID")}
    </motion.span>
  );
};

const MiniAreaChart = ({
  data,
  colorClass,
}: {
  data: number[];
  colorClass: string;
}) => {
  if (data.length < 2) return null;

  const width = 120;
  const height = 40;
  const maxVal = Math.max(...data, 0);
  const minVal = Math.min(...data, 0);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - minVal) / valRange) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `M0,${height} ${points} L${width},${height} Z`;
  const linePath = `M${points}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute bottom-0 right-0 opacity-40"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`gradient-${colorClass}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" className={`${colorClass} stop-opacity-30`} />
          <stop offset="100%" className={`${colorClass} stop-opacity-0`} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#gradient-${colorClass})`} />
      <path d={linePath} fill="none" className={colorClass} strokeWidth="1.5" />
    </svg>
  );
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  unit,
  color,
  history,
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  unit?: string;
  color: string;
  history: number[];
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-800/50 border border-gray-700/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:shadow-${
        color.split("-")[1]
      }-500/10`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-300">{title}</h2>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <div className="relative mt-4 h-12 text-5xl font-bold text-slate-50">
        <AnimatePresence>
          <AnimatedNumber value={value} />
        </AnimatePresence>
        {unit && (
          <span className="absolute bottom-0 left-14 text-lg font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
      <MiniAreaChart data={history} colorClass={color} />
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-gray-800/50 border border-gray-700/80 p-6 rounded-2xl shadow-lg">
    <div className="flex justify-between items-center">
      <div className="w-2/5 h-6 bg-gray-700 rounded-md animate-pulse"></div>
      <div className="w-7 h-7 bg-gray-700 rounded-full animate-pulse"></div>
    </div>
    <div className="mt-4 w-3/5 h-12 bg-gray-700 rounded-md animate-pulse"></div>
  </div>
);

const RealtimeStats = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [history, setHistory] = useState<DashboardData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const MAX_HISTORY_LENGTH = 30;

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Terhubung ke server WebSocket!");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Terputus dari server WebSocket.");
      setIsConnected(false);
    });

    socket.on("dashboardUpdate", (update: DashboardData) => {
      console.log("Menerima update:", update);
      setData(update);
      setHistory((prevHistory) =>
        [...prevHistory, update].slice(-MAX_HISTORY_LENGTH)
      );
      setLastUpdated(new Date(update.timestamp));
    });

    // Cleanup saat komponen di-unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Live Overview</h1>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {lastUpdated && (
            <span>Last update: {format(lastUpdated, "HH:mm:ss")}</span>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              isConnected
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {isConnected ? <FiWifi className="animate-pulse" /> : <FiWifiOff />}
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data ? (
          <>
            <StatCard
              icon={FiUsers}
              title="Pengguna Aktif"
              value={data.activeUsers}
              color="text-cyan-400"
              history={history.map((h) => h.activeUsers)}
            />
            <StatCard
              icon={FiShoppingCart}
              title="Pesanan Baru"
              value={data.newOrders}
              color="text-lime-400"
              history={history.map((h) => h.newOrders)}
            />
            <StatCard
              icon={FiBarChart2}
              title="Waktu Respons"
              value={data.avgResponseTime}
              unit="ms"
              color="text-amber-400"
              history={history.map((h) => h.avgResponseTime)}
            />
            <StatCard
              icon={FiAlertTriangle}
              title="Tingkat Error"
              value={data.errorRate}
              unit="%"
              color="text-rose-400"
              history={history.map((h) => h.errorRate)}
            />
          </>
        ) : (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RealtimeStats;
