import React from 'react';
import { Download } from 'lucide-react';
import { SettingsCard } from './SettingsCard';

export const AccountTabContent: React.FC = () => {
  const invoices = [
    { id: 'INV-2024-003', date: 'May 1, 2024', amount: '$25.00', status: 'Paid' },
    { id: 'INV-2024-002', date: 'April 1, 2024', amount: '$25.00', status: 'Paid' },
    { id: 'INV-2024-001', date: 'March 1, 2024', amount: '$25.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-8">
      <SettingsCard title="Current Plan" description="You are currently on the Pro Plan.">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-2xl font-bold text-white">$25 <span className="text-base font-normal text-slate-400">/ month</span></h4>
            <p className="text-sm text-slate-400 mt-1">Your next billing date is June 1, 2024.</p>
          </div>
          <button className="bg-gray-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors border border-gray-700">Manage Subscription</button>
        </div>
      </SettingsCard>
      <SettingsCard title="Billing History" description="Download your past invoices.">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-sm text-slate-400">
              <th className="py-2 font-medium">Invoice</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-b border-gray-800 text-sm hover:bg-gray-800/40">
                <td className="py-3 px-2 text-slate-200 font-medium">{invoice.id}</td>
                <td className="py-3 px-2">{invoice.date}</td>
                <td className="py-3 px-2">{invoice.amount}</td>
                <td className="py-3 px-2 text-right"><button className="p-2 text-slate-400 hover:text-blue-400 transition-colors"><Download className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsCard>
    </div>
  );
};