import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { Loader, KeyRound, Copy, Trash2, PlusCircle } from 'lucide-react';

// Dummy data for API keys
const initialApiKeys = [
  {
    id: 'key_1',
    name: 'My Main App',
    token: 'sk_live_************************abcd',
    created: 'May 15, 2024',
    lastUsed: 'June 1, 2024',
  },
  {
    id: 'key_2',
    name: 'Staging Environment',
    token: 'sk_test_************************wxyz',
    created: 'April 20, 2024',
    lastUsed: 'May 28, 2024',
  },
];

export const ApiKeysTabContent: React.FC = () => {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newKey = {
        id: `key_${Date.now()}`,
        name: 'New Key (Untitled)',
        token: `sk_live_************************${Math.random().toString(36).substring(2, 6)}`,
        created: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        lastUsed: 'Never',
      };
      setApiKeys(prev => [newKey, ...prev]);
      setIsGenerating(false);
      // Di sini Anda bisa menambahkan notifikasi sukses
    }, 1500);
  };

  const handleRevokeKey = (keyId: string) => {
    // Idealnya, tampilkan modal konfirmasi sebelum menghapus
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  return (
    <div className="space-y-8">
      <SettingsCard
        title="API Keys"
        description="Manage your API keys for integrations. Keep them secret, keep them safe!"
        headerActions={
          <button onClick={handleGenerateKey} disabled={isGenerating} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50">
            {isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            <span>{isGenerating ? 'Generating...' : 'Generate New Key'}</span>
          </button>
        }
      >
        <ul className="divide-y divide-slate-800 -mx-6">
          {apiKeys.map(key => (
            <li key={key.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-700/50 rounded-full"><KeyRound className="w-5 h-5 text-slate-400" /></div>
                <div>
                  <p className="font-semibold text-white">{key.name}</p>
                  <p className="text-sm text-slate-400 font-mono">{key.token}</p>
                  <p className="text-xs text-slate-500 mt-1">Created: {key.created} &middot; Last used: {key.lastUsed}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors" title="Copy Key"><Copy className="w-4 h-4" /></button>
                <button onClick={() => handleRevokeKey(key.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Revoke Key"><Trash2 className="w-4 h-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </SettingsCard>
    </div>
  );
};