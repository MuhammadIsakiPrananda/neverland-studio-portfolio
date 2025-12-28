import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../../types';
import api from '../../services/apiService';
import { showSuccess, showError } from '../common/ModernNotification';
import { 
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DashboardNewsletterProps {
  theme: Theme;
}

interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
  ip_address?: string;
}

const DashboardNewsletter: React.FC<DashboardNewsletterProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [exporting, setExporting] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    try {
      const params: any = {};
      if (filterStatus === 'active') params.is_active = 1;
      if (filterStatus === 'inactive') params.is_active = 0;

      const response = await api.get('/admin/newsletters', { params });
      
      if (response.data.success) {
        setSubscribers(response.data.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      showError('Failed to Load', 'Could not fetch newsletter subscribers');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`Delete subscriber: ${email}?`)) return;

    try {
      const response = await api.delete(`/admin/newsletters/${id}`);
      if (response.data.success) {
        showSuccess('Subscriber Deleted', 'Subscriber removed successfully');
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      showError('Delete Failed', 'Could not delete subscriber');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: any = {};
      if (filterStatus === 'active') params.is_active = 1;
      if (filterStatus === 'inactive') params.is_active = 0;

      const response = await api.get('/admin/newsletters/export', { 
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess('Export Successful', 'Subscribers exported to CSV');
    } catch (error) {
      console.error('Error exporting:', error);
      showError('Export Failed', 'Could not export subscribers');
    } finally {
      setExporting(false);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { 
      label: 'Total Subscribers', 
      value: subscribers.length.toLocaleString(), 
      icon: Users, 
      color: 'blue' 
    },
    { 
      label: 'Active', 
      value: subscribers.filter(s => s.is_active).length.toLocaleString(),
      icon: CheckCircle, 
      color: 'green' 
    },
    { 
      label: 'Unsubscribed', 
      value: subscribers.filter(s => !s.is_active).length.toLocaleString(),
      icon: XCircle, 
      color: 'red' 
    },
    { 
      label: 'This Month', 
      value: subscribers.filter(s => {
        const date = new Date(s.subscribed_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length.toLocaleString(),
      icon: TrendingUp, 
      color: 'purple' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Newsletter Subscribers
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your email subscriber list
          </p>
        </div>
        <button 
          onClick={handleExport}
          disabled={exporting || subscribers.length === 0}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export CSV
            </>
          )}
        </button>
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
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
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

      {/* Filters and Search */}
      <div className={`
        p-4 rounded-xl border
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className={`relative ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-colors
                  ${isDark 
                    ? 'bg-transparent text-white placeholder:text-slate-500' 
                    : 'bg-transparent text-slate-900 placeholder:text-slate-400'}
                `}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`
                px-4 py-2.5 rounded-lg outline-none cursor-pointer transition-colors
                ${isDark 
                  ? 'bg-slate-900/50 text-white border border-slate-700' 
                  : 'bg-slate-50 text-slate-900 border border-slate-200'}
              `}
            >
              <option value="all">All Subscribers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Unsubscribed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className={`
        rounded-xl border overflow-hidden
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            All Subscribers ({filteredSubscribers.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Loading subscribers...
            </p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No subscribers found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Email
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Status
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Subscribed
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    IP Address
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {filteredSubscribers.map((subscriber) => (
                  <tr 
                    key={subscriber.id}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-md text-xs font-medium border
                        ${subscriber.is_active 
                          ? 'text-green-400 bg-green-500/20 border-green-500/30' 
                          : 'text-red-400 bg-red-500/20 border-red-500/30'}
                      `}>
                        {subscriber.is_active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className={`p-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className={`p-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {subscriber.ip_address || '-'}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'}`}
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNewsletter;
