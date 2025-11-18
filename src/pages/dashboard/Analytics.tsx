import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import ChartCard from './ChartCard';

// --- Mock Data ---
const pageViewsData = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Apr', uv: 2780, pv: 3908 },
  { name: 'May', uv: 1890, pv: 4800 },
  { name: 'Jun', uv: 2390, pv: 3800 },
  { name: 'Jul', uv: 3490, pv: 4300 },
];

const deviceData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 150 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800 border border-slate-700 rounded-md shadow-lg">
        <p className="label text-white">{`${label}`}</p>
        <p className="intro text-violet-400">{`Page Views : ${payload[0].value}`}</p>
        <p className="desc text-sky-400">{`Unique Visitors : ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="p-2 sm:p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Website Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <ChartCard title="Page Views vs Unique Visitors" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pageViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="pv" name="Page Views" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="uv" name="Unique Visitors" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Breakdown Chart */}
        <ChartCard title="Device Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {deviceData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  borderColor: '#475569',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Another chart example */}
        <ChartCard title="Referral Sources">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pageViewsData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  borderColor: '#475569',
                }}
                cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              />
              <Bar dataKey="uv" name="Referrals" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;