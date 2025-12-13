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
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
      <div className="p-3 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/30 text-center">
        <p className="text-zinc-400 text-sm">
          Credit card form is temporarily disabled.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
        <button type="submit" disabled={true} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 transition-all disabled:opacity-50">
          <CreditCard className="w-4 h-4" />
          Save Card
        </button>
      </div>
    </form>
  );
};