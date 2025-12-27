import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Mail,
  Send,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

interface DashboardNewsletterProps {
  theme: Theme;
}

interface Newsletter {
  id: string;
  subject: string;
  preview: string;
  recipients: number;
  sent: string;
  opens: number;
  clicks: number;
  status: 'draft' | 'sent' | 'scheduled';
}

const DashboardNewsletter: React.FC<DashboardNewsletterProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const newsletters: Newsletter[] = [
    {
      id: '1',
      subject: 'New Year Special Offers - 2026',
      preview: 'Celebrate the new year with our exclusive offers...',
      recipients: 2500,
      sent: '2025-12-25 10:00',
      opens: 1850,
      clicks: 920,
      status: 'sent'
    },
    {
      id: '2',
      subject: 'Monthly Newsletter - December 2025',
      preview: 'Check out what we accomplished this month...',
      recipients: 2500,
      sent: '2025-12-01 09:00',
      opens: 2100,
      clicks: 1050,
      status: 'sent'
    },
    {
      id: '3',
      subject: 'Upcoming Webinar: Modern Web Development',
      preview: 'Join us for an exclusive webinar on January 15th...',
      recipients: 2500,
      sent: '2026-01-10 14:00',
      opens: 0,
      clicks: 0,
      status: 'scheduled'
    },
    {
      id: '4',
      subject: 'Product Update v2.0',
      preview: 'We are excited to announce major updates...',
      recipients: 0,
      sent: '-',
      opens: 0,
      clicks: 0,
      status: 'draft'
    }
  ];

  const stats = [
    { 
      label: 'Total Subscribers', 
      value: '2,500', 
      change: '+12%',
      icon: Users, 
      color: 'blue' 
    },
    { 
      label: 'Avg. Open Rate', 
      value: '78%', 
      change: '+5%',
      icon: Eye, 
      color: 'green' 
    },
    { 
      label: 'Avg. Click Rate', 
      value: '42%', 
      change: '+8%',
      icon: MousePointer, 
      color: 'cyan' 
    },
    { 
      label: 'Total Sent', 
      value: '124', 
      change: '+23',
      icon: Send, 
      color: 'purple' 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return isDark ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-300';
      case 'scheduled': return isDark ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' : 'text-blue-700 bg-blue-100 border-blue-300';
      case 'draft': return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
      default: return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         newsletter.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || newsletter.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Newsletter Management
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Create and manage email newsletters to your subscribers
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Newsletter
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
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
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
                placeholder="Search newsletters..."
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
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                px-4 py-2.5 rounded-lg outline-none cursor-pointer transition-colors
                ${isDark 
                  ? 'bg-slate-900/50 text-white border border-slate-700' 
                  : 'bg-slate-50 text-slate-900 border border-slate-200'}
              `}
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Newsletters List */}
      <div className={`
        rounded-xl border overflow-hidden
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            All Newsletters ({filteredNewsletters.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <tr>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Newsletter
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Recipients
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Opens
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Clicks
                </th>
                <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Sent Date
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
              {filteredNewsletters.map((newsletter) => {
                const openRate = newsletter.recipients > 0 ? Math.round((newsletter.opens / newsletter.recipients) * 100) : 0;
                const clickRate = newsletter.recipients > 0 ? Math.round((newsletter.clicks / newsletter.recipients) * 100) : 0;

                return (
                  <tr 
                    key={newsletter.id}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-4">
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {newsletter.subject}
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {newsletter.preview}
                        </p>
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {newsletter.recipients.toLocaleString()}
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <div>
                        <p>{newsletter.opens.toLocaleString()}</p>
                        {newsletter.status === 'sent' && (
                          <p className="text-xs text-green-500">{openRate}%</p>
                        )}
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <div>
                        <p>{newsletter.clicks.toLocaleString()}</p>
                        {newsletter.status === 'sent' && (
                          <p className="text-xs text-blue-500">{clickRate}%</p>
                        )}
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      <div className="flex items-center gap-2">
                        {newsletter.sent !== '-' && <Calendar className="w-4 h-4" />}
                        {newsletter.sent}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-md text-xs font-medium border capitalize
                        ${getStatusColor(newsletter.status)}
                      `}>
                        {newsletter.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'}`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewsletter;
