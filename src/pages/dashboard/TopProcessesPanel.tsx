// src/pages/dashboard/components/TopProcessesPanel.tsx
import type { TopProcess } from './types';

interface TopProcessesPanelProps {
  processes: TopProcess[];
}

export const TopProcessesPanel = ({ processes }: TopProcessesPanelProps) => (
  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 flex flex-col">
    <h3 className="text-lg font-semibold text-white mb-4">Top Processes by CPU</h3>
    <div className="overflow-y-auto flex-grow">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase sticky top-0 bg-slate-800/50 backdrop-blur-sm">
          <tr>
            <th scope="col" className="py-2 px-2">PID</th>
            <th scope="col" className="py-2 px-2">User</th>
            <th scope="col" className="py-2 px-2">%CPU</th>
            <th scope="col" className="py-2 px-2">Command</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.pid} className="border-b border-slate-700 hover:bg-slate-700/20"><td className="py-2 px-2 font-mono">{p.pid}</td><td className="py-2 px-2">{p.user}</td><td className="py-2 px-2 font-medium text-sky-400">{p.cpu.toFixed(2)}</td><td className="py-2 px-2 truncate" title={p.command}>{p.command}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);