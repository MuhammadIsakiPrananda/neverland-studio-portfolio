// src/pages/dashboard/SuspiciousActivityLog.tsx
import type { SuspiciousActivity } from './types';

interface SuspiciousActivityLogProps {
  activities: SuspiciousActivity[];
}

const levelColors: Record<SuspiciousActivity['level'], string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  Warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Info: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

export const SuspiciousActivityLog = ({ activities }: SuspiciousActivityLogProps) => (
  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
    <h3 className="text-lg font-semibold text-white mb-4">Suspicious Activity Log</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase">
          <tr>
            <th scope="col" className="py-3 px-4">Timestamp</th>
            <th scope="col" className="py-3 px-4">Level</th>
            <th scope="col" className="py-3 px-4">Source IP</th>
            <th scope="col" className="py-3 px-4">Event</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-b border-slate-700 hover:bg-slate-700/20">
              <td className="py-3 px-4 whitespace-nowrap">{activity.timestamp}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${levelColors[activity.level]}`}>{activity.level}</span>
              </td>
              <td className="py-3 px-4 font-mono">{activity.sourceIp}</td>
              <td className="py-3 px-4">{activity.event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);