// src/pages/dashboard/components/SystemStatusPanel.tsx
import type { ServerMetrics } from './types';
import { InfoRow } from './InfoRow';
import { ServiceRow } from './ServiceRow';

interface SystemStatusPanelProps {
  systemInfo: ServerMetrics['systemInfo'];
  services: ServerMetrics['services'];
  loadAverage: ServerMetrics['loadAverage'];
}

export const SystemStatusPanel = ({ systemInfo, services, loadAverage }: SystemStatusPanelProps) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
      <div className="space-y-3 text-sm mb-4">
        <InfoRow label="Operating System" value={systemInfo.os} />
        <InfoRow label="IP Address" value={systemInfo.ip} />
        <InfoRow label="Server Uptime" value={systemInfo.uptime} />
        <InfoRow label="Load Average" value={`${loadAverage.one}, ${loadAverage.five}, ${loadAverage.fifteen}`} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-auto">
        {Object.entries(services).map(([name, status]) => <ServiceRow key={name} name={name} status={status} />)}
      </div>
    </div>
  );
};