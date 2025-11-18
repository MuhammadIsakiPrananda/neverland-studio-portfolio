import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, FolderKanban, ArrowUp, ArrowDown, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const revenueData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5800 },
  { name: 'Jul', revenue: 7200 }, { name: 'Aug', revenue: 6800 },
];

const projectTypeData = [
    { name: 'Web Development', value: 45 },
    { name: 'Mobile Apps', value: 30 },
    { name: 'UI/UX Design', value: 15 },
    { name: 'Branding', value: 10 },
];
const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

const initialActivities = [
    { id: 1, user: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex', action: 'menyelesaikan task "Desain UI Homepage"', time: '5m lalu', icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
    { id: 2, user: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah', action: 'mengomentari "Prototipe V2"', time: '15m lalu', icon: <MessageSquare className="w-5 h-5 text-blue-400" /> },
    { id: 3, user: 'John', avatar: 'https://i.pravatar.cc/150?u=john', action: 'memulai proyek "E-commerce App"', time: '1h lalu', icon: <Clock className="w-5 h-5 text-yellow-400" /> },
];

const projects = [
    { name: 'Website Korporat "QuantumLeap"', progress: 75, status: 'In Progress', team: ['alex', 'sarah'] },
    { name: 'Aplikasi Mobile Banking "FintechX"', progress: 40, status: 'In Progress', team: ['john', 'mike'] },
    { name: 'Sistem Manajemen Inventaris "StockWise"', progress: 90, status: 'Testing', team: ['alex', 'jane'] },
    { name: 'Desain Logo Brand "Kopi Senja"', progress: 100, status: 'Completed', team: ['sarah'] },
];

const teamAvatars: { [key: string]: string } = {
    alex: 'https://i.pravatar.cc/150?u=alex',
    sarah: 'https://i.pravatar.cc/150?u=sarah',
    john: 'https://i.pravatar.cc/150?u=john',
    mike: 'https://i.pravatar.cc/150?u=mike',
    jane: 'https://i.pravatar.cc/150?u=jane',
};

// --- Sub-Komponen Dashboard ---
const KpiCard = ({ title, value, icon, change, changeType }: { title: string, value: string, icon: React.ReactNode, change: string, changeType: 'increase' | 'decrease' }) => (
    <motion.div 
        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg hover:border-cyan-400/50 transition-all duration-300"
        whileHover={{ y: -5 }}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-full">
                {icon}
            </div>
        </div>
        <div className={`flex items-center mt-4 text-xs ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'increase' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            <span>{change} vs bulan lalu</span>
        </div>
    </motion.div>
);

const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
    'In Progress': { color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    'Testing': { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    'Completed': { color: 'text-green-400', bgColor: 'bg-green-500/20' },
};

const DashboardOverview = () => {
  const [activities, setActivities] = useState(initialActivities);
  const [totalRevenue, setTotalRevenue] = useState(36300);

  // Simulasi update data real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalRevenue(prev => prev + Math.floor(Math.random() * 50) + 10);
      const newActivity = {
        id: Date.now(),
        user: 'System',
        avatar: 'https://i.pravatar.cc/150?u=system',
        action: 'melakukan sinkronisasi data',
        time: 'Baru saja',
        icon: <CheckCircle className="w-4 h-4 text-purple-400" />
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 3)]);
    }, 5000); // Update setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <>
        {/* --- Grid KPI --- */}
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <KpiCard title="Total Pendapatan" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6 text-cyan-400" />} change="12.5%" changeType="increase" />
          <KpiCard title="Klien Baru" value="32" icon={<Users className="w-6 h-6 text-cyan-400" />} change="5.2%" changeType="increase" />
          <KpiCard title="Proyek Berjalan" value="8" icon={<FolderKanban className="w-6 h-6 text-cyan-400" />} change="2.1%" changeType="decrease" />
        </motion.div>

        {/* --- Grid Utama (Grafik) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* --- Grafik Pendapatan --- */}
          <motion.div 
            className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Tren Pendapatan</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* --- Distribusi Proyek --- */}
          <motion.div 
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Distribusi Tipe Proyek</h2>
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={projectTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {projectTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* --- Grid Bawah (Tabel & Aktivitas) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- Tabel Proyek --- */}
            <motion.div 
                className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h2 className="text-xl font-semibold text-white mb-4">Proyek Aktif</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase border-b border-gray-700">
                            <tr>
                                <th scope="col" className="py-3 pr-6">Nama Proyek</th>
                                <th scope="col" className="py-3 px-6">Tim</th>
                                <th scope="col" className="py-3 px-6">Status</th>
                                <th scope="col" className="py-3 pl-6">Progres</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.name} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                    <td className="py-4 pr-6 font-medium text-white whitespace-nowrap">{project.name}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex -space-x-2">
                                            {project.team.map(member => (
                                                <img key={member} className="w-8 h-8 border-2 border-gray-800 rounded-full" src={teamAvatars[member]} alt={member} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[project.status].bgColor} ${statusConfig[project.status].color}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pl-6">
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* --- Feed Aktivitas --- */}
            <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h2 className="text-xl font-semibold text-white mb-4">Feed Aktivitas Tim</h2>
                <ul className="space-y-5">
                    {activities.map(activity => (
                        <li key={activity.id} className="flex items-start space-x-4">
                            <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="text-sm text-white">
                                    <span className="font-bold">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                            </div>
                            {activity.icon}
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    </>
  );
};

export default DashboardOverview;