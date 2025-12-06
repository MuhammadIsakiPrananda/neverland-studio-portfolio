// src/pages/dashboard/ServiceRow.tsx
import React from 'react';
import { Server, Database, ShieldCheck, Power } from 'lucide-react';
import type { ServiceStatus } from './types';

interface ServiceRowProps {
  name: string;
  status: ServiceStatus;
}

// Konstanta dipindahkan ke sini karena hanya relevan untuk ServiceRow
const statusColors: Record<ServiceStatus, string> = {
  Active: 'bg-emerald-500',
  Inactive: 'bg-slate-500',
  Error: 'bg-red-500',
};
const serviceIcons: Record<string, React.ReactElement> = {
  'Web Server (Nginx)': <Server className="w-5 h-5" />,
  'Database (PostgreSQL)': <Database className="w-5 h-5" />,
  'Firewall (UFW)': <ShieldCheck className="w-5 h-5" />,
};

export const ServiceRow = ({ name, status }: ServiceRowProps) => (
  <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/80 transition-colors">
    <div className="relative">
      {serviceIcons[name] || <Power className="w-5 h-5" />}
      <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-800 ${statusColors[status]}`}></div>
    </div>
    <span className="text-xs text-slate-300 mt-2 truncate w-full" title={name}>{name}</span>
  </div>
);