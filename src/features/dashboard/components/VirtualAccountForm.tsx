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
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors"
            required
          >
            <option value="" disabled>Select a bank</option>
            {supportedBanks.map(b => <option key={b} value={b}>{b} Virtual Account</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Virtual Account Number</label>
          <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g., 88081234567890" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors" required />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">Cancel</button>
        <button type="submit" disabled={isLoading || !bank || !number} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors disabled:opacity-50">
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isLoading ? 'Saving...' : 'Save Account'}
        </button>
      </div>
    </form>
  );
};