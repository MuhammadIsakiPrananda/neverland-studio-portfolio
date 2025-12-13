import React, { useState } from 'react';
import { Loader, Save } from 'lucide-react';

interface VirtualAccountFormProps {
  onSuccess: (account: { bank: string; number: string }) => void;
  onCancel: () => void;
}

const supportedBanks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata'];

export const VirtualAccountForm: React.FC<VirtualAccountFormProps> = ({ onSuccess, onCancel }) => {
  const [bank, setBank] = useState('');
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!bank || !number) return;

    setIsLoading(true);
    // Simulasi proses penyimpanan
    setTimeout(() => {
      onSuccess({ bank, number });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-950/30 p-6 rounded-lg border border-slate-800">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-colors"
            required
          >
            <option value="" disabled>Select a bank</option>
            {supportedBanks.map(b => <option key={b} value={b}>{b} Virtual Account</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Virtual Account Number</label>
          <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g., 88081234567890" className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-colors" required />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">Cancel</button>
        <button type="submit" disabled={isLoading || !bank || !number} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isLoading ? 'Saving...' : 'Save Account'}
        </button>
      </div>
    </form>
  );
};