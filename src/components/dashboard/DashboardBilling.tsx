import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Theme } from '../../types';
import { DollarSign, FileText, Download, Eye, CreditCard, Calendar, Filter, Search, RefreshCw } from 'lucide-react';
import transactionService, { Transaction, TransactionStats } from '../../services/transactionService';
import toast from 'react-hot-toast';

interface DashboardBillingProps {
  theme: Theme;
}

const DashboardBilling: React.FC<DashboardBillingProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const previousTransactionCountRef = useRef<number>(0);
  const pollingIntervalRef = useRef<number | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch transactions and stats with enhanced error handling
  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      }

      const response = await transactionService.fetchTransactions({
        per_page: 50,
      });

      // Check for new transactions and show notification
      if (previousTransactionCountRef.current > 0 && response.data.data.length > previousTransactionCountRef.current) {
        const newCount = response.data.data.length - previousTransactionCountRef.current;
        toast.success(`${newCount} transaksi baru ditambahkan!`, {
          icon: '💰',
          duration: 4000,
        });
      }

      previousTransactionCountRef.current = response.data.data.length;
      setTransactions(response.data.data);
      setStats(response.stats);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      const errorMessage = err.message || 'Gagal memuat data transaksi';
      setError(errorMessage);

      if (showRefreshing) {
        toast.error('Gagal memuat data terbaru. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Manual refresh
  const handleManualRefresh = useCallback(() => {
    fetchData(true);
  }, []);

  // Handle real-time transaction created event with optimistic update
  const handleTransactionCreated = useCallback((event: CustomEvent) => {
    const newTransaction = event.detail;

    // Optimistic UI update - add transaction immediately
    setTransactions(prev => [newTransaction, ...prev]);
    previousTransactionCountRef.current += 1;

    // Update stats optimistically
    setStats(prev => prev ? {
      ...prev,
      pending_amount: prev.pending_amount + Number(newTransaction.amount),
      pending_count: prev.pending_count + 1,
    } : null);

    // Show success notification
    toast.success(
      `Transaksi baru: ${newTransaction.invoice_number}`,
      {
        duration: 5000,
        icon: '💰',
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155',
        },
      }
    );

    // Fetch updated data in background for accuracy
    setTimeout(() => {
      fetchData();
    }, 500);
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Setup real-time event listener for transaction creation
  useEffect(() => {
    // Listen for custom event dispatched by forms when transaction is created
    window.addEventListener('transactionCreated', handleTransactionCreated as EventListener);

    // Expose refresh function globally for external triggers
    (window as any).refreshBillingDashboard = handleManualRefresh;

    return () => {
      window.removeEventListener('transactionCreated', handleTransactionCreated as EventListener);
      delete (window as any).refreshBillingDashboard;
    };
  }, [handleTransactionCreated, handleManualRefresh]);


  // Filter transactions locally
  const filteredTransactions = transactions.filter(txn => {
    const matchStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchSearch = txn.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-500/10 text-green-500 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
      cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    const labels = {
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      cancelled: 'Cancelled'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string | null) => {
    const labels: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      credit_card: 'Credit Card',
      e_wallet: 'E-Wallet',
      cash: 'Cash',
    };
    return method ? labels[method] || method : '-';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Billing & Invoices
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manual refresh billing dashboard
            </p>
            {lastUpdate && (
              <>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>•</span>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Updated: {lastUpdate.toLocaleTimeString('id-ID')}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`p-2.5 rounded-lg transition-all ${isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors flex items-center gap-2`}>
            <FileText className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading && !stats ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className={`p-6 rounded-xl border backdrop-blur-sm animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-slate-700/50" />
                <div className="w-16 h-4 rounded bg-slate-700/50" />
              </div>
              <div className="w-20 h-4 rounded bg-slate-700/50 mb-2" />
              <div className="w-24 h-8 rounded bg-slate-700/50" />
            </div>
          ))
        ) : (
          [
            {
              label: 'Total Revenue',
              value: formatCurrency(stats?.total_revenue || 0),
              icon: DollarSign,
              change: '+12.5%',
              color: 'green'
            },
            {
              label: 'Pending',
              value: formatCurrency(stats?.pending_amount || 0),
              icon: FileText,
              change: `${stats?.pending_count || 0} invoices`,
              color: 'yellow'
            },
            {
              label: 'Paid This Month',
              value: formatCurrency(stats?.paid_this_month || 0),
              icon: CreditCard,
              change: '+8.2%',
              color: 'blue'
            },
            {
              label: 'Overdue',
              value: formatCurrency(stats?.overdue_amount || 0),
              icon: Calendar,
              change: `${stats?.overdue_count || 0} invoice${stats?.overdue_count !== 1 ? 's' : ''}`,
              color: 'red'
            }
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
          })
        )}
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
              onChange={(e) => setFilterStatus(e.target.value as any)}
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
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Product</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Date</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Amount</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Method</th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                <th className={`text-right p-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} animate-pulse`}>
                    <td className="p-4"><div className="w-24 h-4 rounded bg-slate-700/50" /></td>
                    <td className="p-4"><div className="w-32 h-4 rounded bg-slate-700/50" /></td>
                    <td className="p-4"><div className="w-28 h-4 rounded bg-slate-700/50" /></td>
                    <td className="p-4"><div className="w-20 h-4 rounded bg-slate-700/50" /></td>
                    <td className="p-4"><div className="w-24 h-4 rounded bg-slate-700/50" /></td>
                    <td className="p-4"><div className="w-20 h-4 rounded bg-slate-700/50" /></td>
                    <td className="p-4"><div className="w-16 h-6 rounded-full bg-slate-700/50" /></td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={`border-b transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-700/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className={`p-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
                      {transaction.invoice_number}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} font-medium`}>{transaction.client_name}</p>
                        <p className={`${isDark ? 'text-slate-500' : 'text-slate-500'} text-xs`}>{transaction.client_email}</p>
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      {transaction.product_name}
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
                      {formatCurrency(Number(transaction.amount))}
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      {getPaymentMethodLabel(transaction.payment_method)}
                    </td>
                    <td className="p-4">{getStatusBadge(transaction.status)}</td>
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
                  <td colSpan={8} className={`p-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {searchQuery || filterStatus !== 'all'
                      ? 'No transactions found matching your filters'
                      : 'No transactions yet'}
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
