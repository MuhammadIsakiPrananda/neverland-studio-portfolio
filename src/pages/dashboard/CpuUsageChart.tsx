// src/pages/dashboard/components/CpuUsageChart.tsx
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { CpuHistoryPoint } from './types';
import { CustomTooltip } from './CustomTooltip';

interface CpuUsageChartProps {
  data: CpuHistoryPoint[];
}

export const CpuUsageChart = ({ data }: CpuUsageChartProps) => (
  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80">
    <h3 className="text-lg font-semibold text-white mb-4">CPU Usage History</h3>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
        <defs>
          <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }} />
        <Area 
          type="monotone" dataKey="usage" name="Usage" unit="%"
          stroke="#38bdf8" fill="url(#cpuGradient)" strokeWidth={2} 
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);