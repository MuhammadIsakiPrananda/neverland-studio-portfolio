import React from 'react';

interface SettingsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  icon?: React.ReactNode;
  border?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, children, footer, headerActions, icon, border }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm border ${border || 'border-slate-800'} rounded-xl shadow-2xl shadow-black/30`}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-start">
        <div className="flex items-start gap-4">
          {icon && <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-800/70 rounded-lg border border-slate-700">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          </div>
        </div>
        {headerActions && <div className="flex-shrink-0">{headerActions}</div>}
      </div>
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 rounded-b-xl">{footer}</div>}
    </div>
  );
};