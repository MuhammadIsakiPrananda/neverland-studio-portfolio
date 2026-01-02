import React, { useState } from 'react';
import type { Theme } from '../../types';
import { DollarSign, FileText, Download, Eye, CreditCard, Calendar, Filter, Search } from 'lucide-react';

interface DashboardBillingProps {
  theme: Theme;
}

const DashboardBilling: React.FC<DashboardBillingProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const invoices = [
    { id: '#INV-001', date: '2025-12-28', client: 'PT Maju Jaya', amount: 'Rp 5,000,000', status: 'paid', method: 'Bank Transfer' },
    { id: '#INV-002', date: '2025-12-15', client: 'CV Sukses Mandiri', amount: 'Rp 3,500,000', status: 'pending', method: 'Credit Card' },
    { id: '#INV-003', date: '2025-12-10', client: 'PT Global Tech', amount: 'Rp 7,200,000', status: 'paid', method: 'Bank Transfer' },
    { id: '#INV-004', date: '2025-12-05', client: 'Startup Indonesia', amount: 'Rp 4,800,000', status: 'overdue', method: 'Credit Card' },
    { id: '#INV-005', date: '2025-11-28', client: 'Digital Agency', amount: 'Rp 6,500,000', status: 'paid', method: 'Bank Transfer' },
  ];

  const filteredInvoices = invoices.filter(inv => {
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-500/10 text-green-500 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      overdue: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    const labels = {
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Billing & Invoices
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage billing and view invoices
          </p>
        </div>
        <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors flex items-center gap-2`}>
          <FileText className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: 'Rp 45M', icon: DollarSign, change: '+12.5%', color: 'green' },
          { label: 'Pending', value: 'Rp 8.5M', icon: FileText, change: '3 invoices', color: 'yellow' },
          { label: 'Paid This Month', value: 'Rp 12M', icon: CreditCard, change: '+8.2%', color: 'blue' },
          { label: 'Overdue', value: 'Rp 4.8M', icon: Calendar, change: '1 invoice', color: 'red' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'text-green-500 bg-green-500/10',
            yellow: 'text-yellow-500 bg-yellow-500/10',
            blue: 'text-blue-500 bg-blue-500/10',
            red: 'text-red-500 bg-red-500/10'
          };
          return (
            <div key={idx} className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70' : 'bg-white border-slate-200 hover:shadow-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
              <tr>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Invoice ID</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Client</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Date</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Amount</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Method</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                <th className={`text-right p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice, idx) => (
                  <tr key={idx} className={`border-b transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-700/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className={`p-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{invoice.id}</td>
                    <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{invoice.client}</td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>{invoice.date}</td>
                    <td className={`p-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{invoice.amount}</td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>{invoice.method}</td>
                    <td className="p-4">{getStatusBadge(invoice.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'}`} title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'}`} title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={`p-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardBilling;
