import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt
} from 'lucide-react';

interface DashboardBillingProps {
  theme: Theme;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const DashboardBilling: React.FC<DashboardBillingProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-001',
      date: '2025-12-01',
      amount: 15000000,
      status: 'paid',
      description: 'Professional Plan - December 2025',
      dueDate: '2025-12-10'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-002',
      date: '2025-11-01',
      amount: 15000000,
      status: 'paid',
      description: 'Professional Plan - November 2025',
      dueDate: '2025-11-10'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-003',
      date: '2025-10-01',
      amount: 15000000,
      status: 'paid',
      description: 'Professional Plan - October 2025',
      dueDate: '2025-10-10'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      last4: '4242',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal Account',
      isDefault: false
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return isDark ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-300';
      case 'pending': return isDark ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'overdue': return isDark ? 'text-red-400 bg-red-500/20 border-red-500/30' : 'text-red-700 bg-red-100 border-red-300';
      default: return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  const stats = [
    { label: 'Current Balance', value: formatCurrency(0), change: '0%', icon: DollarSign, color: 'blue' },
    { label: 'This Month', value: formatCurrency(15000000), change: '+0%', icon: TrendingUp, color: 'green' },
    { label: 'Total Paid', value: formatCurrency(45000000), change: '+12%', icon: CheckCircle, color: 'purple' },
    { label: 'Pending', value: formatCurrency(0), change: '0%', icon: Clock, color: 'yellow' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Billing & Payments
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your subscription, invoices, and payment methods
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`
                p-6 rounded-xl border transition-all duration-200
                ${isDark 
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 hover:shadow-lg'}
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-slate-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className={`
          lg:col-span-2 rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Current Subscription
            </h2>
          </div>

          <div className="p-6">
            <div className={`
              p-6 rounded-xl border-2 border-blue-500 bg-gradient-to-br
              ${isDark ? 'from-blue-500/10 to-cyan-500/10' : 'from-blue-50 to-cyan-50'}
            `}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Professional Plan
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Perfect for growing businesses
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                  Active
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatCurrency(15000000)}
                </span>
                <span className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  /month
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  'Unlimited projects',
                  'Advanced analytics',
                  'Priority support',
                  'Custom branding',
                  'API access'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`
                flex items-center gap-2 p-4 rounded-lg border
                ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
              `}>
                <Calendar className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Next billing date
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    January 1, 2026
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className={`
                  flex-1 px-4 py-2 rounded-lg transition-colors
                  ${isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
                `}>
                  Change Plan
                </button>
                <button className={`
                  flex-1 px-4 py-2 rounded-lg transition-colors
                  ${isDark 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}
                `}>
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={`
          rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Payment Methods
            </h2>
            <button className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`
                  p-4 rounded-lg border transition-all
                  ${method.isDefault
                    ? isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                    : isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-5 h-5 ${method.isDefault ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {method.name}
                    </span>
                  </div>
                  {method.isDefault && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500 text-white">
                      Default
                    </span>
                  )}
                </div>
                {method.expiryDate && (
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Expires {method.expiryDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className={`
        rounded-xl border overflow-hidden
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Billing History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <tr>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Invoice
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Description
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Date
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Amount
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Status
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {invoices.map((invoice) => (
                <tr 
                  key={invoice.id}
                  className={`transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-blue-500" />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                  </td>
                  <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {invoice.description}
                  </td>
                  <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {invoice.date}
                  </td>
                  <td className={`p-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="p-4">
                    <span className={`
                      px-2 py-1 rounded-md text-xs font-medium border capitalize
                      ${getStatusColor(invoice.status)}
                    `}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardBilling;
