import React from 'react';
import type { Theme } from '../../types';
import { DollarSign, FileText, Download, Eye } from 'lucide-react';

interface DashboardBillingProps {
  theme: Theme;
}

const DashboardBilling: React.FC<DashboardBillingProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const invoices = [
    { id: '#INV-001', date: '2025-12-28', amount: 'Rp 5,000,000', status: 'paid' },
    { id: '#INV-002', date: '2025-12-15', amount: 'Rp 3,500,000', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Billing & Invoices
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage billing and view invoices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: 'Rp 45M', icon: DollarSign },
          { label: 'Pending', value: 'Rp 8.5M', icon: FileText },
          { label: 'Paid This Month', value: 'Rp 12M', icon: DollarSign }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Icon className="w-8 h-8 text-green-500 mb-3" />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <table className="w-full">
          <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <tr>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Invoice</th>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Date</th>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Amount</th>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</th>
              <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <td className={`p-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.id}</td>
                <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{inv.date}</td>
                <td className={`p-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${inv.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-slate-700 rounded"><Download className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardBilling;
