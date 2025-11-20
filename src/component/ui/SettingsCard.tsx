import React from 'react';

interface SettingsCardProps { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  footer?: React.ReactNode;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, children, footer }) => (
  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl shadow-lg shadow-black/20">
    <div className="p-6 border-b border-zinc-800">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
    <div className="p-6">{children}</div>
    {footer && <div className="bg-zinc-900/70 px-6 py-4 border-t border-zinc-800 rounded-b-xl">{footer}</div>}
  </div>
);