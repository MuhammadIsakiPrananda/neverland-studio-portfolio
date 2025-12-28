import React from 'react';
import type { Theme } from '../../types';
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { showSuccess } from '../common/ModernNotification';

interface DashboardAPIProps {
  theme: Theme;
}

const DashboardAPI: React.FC<DashboardAPIProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const apiKeys = [
    { id: 1, name: 'Production API', key: 'sk_live_abc123...', created: '2025-12-01', lastUsed: '2 hours ago', requests: 1250 },
    { id: 2, name: 'Development API', key: 'sk_test_xyz789...', created: '2025-11-15', lastUsed: '1 day ago', requests: 450 },
  ];

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    showSuccess('Copied', 'API key copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          API Keys
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage API keys for external integrations
        </p>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {apiKeys.map(api => (
          <div key={api.id} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{api.name}</h3>
                <div className={`mt-2 flex items-center gap-2 font-mono text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{api.key}</span>
                  <button onClick={() => handleCopy(api.key)} className="p-1 hover:bg-slate-700 rounded">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-700 rounded"><Eye className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-red-500/20 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>Created</p>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{api.created}</p>
              </div>
              <div>
                <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>Last Used</p>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{api.lastUsed}</p>
              </div>
              <div>
                <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>Requests</p>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{api.requests.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAPI;
