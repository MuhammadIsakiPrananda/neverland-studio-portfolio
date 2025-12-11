// src/pages/dashboard/components/NetworkUsageChart.tsx
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { NetworkHistoryPoint } from "./types";
import { CustomTooltip } from "./CustomTooltip";

interface NetworkUsageChartProps {
  data: NetworkHistoryPoint[];
}

export const NetworkUsageChart = ({ data }: NetworkUsageChartProps) => (
  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-white">Network Usage</h3>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-fresh-mint-400"></div>
          <span className="text-slate-300">In</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
          <span className="text-slate-300">Out</span>
        </div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="netInGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10F0C8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10F0C8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="netOutGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.1)"
        />
        <XAxis
          dataKey="time"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          unit=" KB/s"
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="in"
          name="In"
          unit="KB/s"
          stroke="#10F0C8"
          fill="url(#netInGradient)"
          strokeWidth={2}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="out"
          name="Out"
          unit="KB/s"
          stroke="#fb7185"
          fill="url(#netOutGradient)"
          strokeWidth={2}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
