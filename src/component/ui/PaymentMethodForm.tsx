import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethodFormProps {
  onCancel: () => void;
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onCancel }) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Logika Stripe dihapus. Untuk saat ini, form tidak akan melakukan apa-apa.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <div className="p-3 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 text-center">
        <p className="text-slate-400 text-sm">
          Credit card form is temporarily disabled.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">Cancel</button>
        <button type="submit" disabled={true} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors disabled:opacity-50">
          <CreditCard className="w-4 h-4" />
          Save Card
        </button>
      </div>
    </form>
  );
};