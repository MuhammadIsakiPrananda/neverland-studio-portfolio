import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { 
  Search,
  Filter,
  Mail,
  MailOpen,
  Reply,
  Trash2,
  Star,
  StarOff,
  Clock,
  CheckCircle,
  XCircle,
  User,
  RefreshCw
} from 'lucide-react';
import api from '../../services/apiService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

interface DashboardContactsProps {
  theme: Theme;
}

const DashboardContacts: React.FC<DashboardContactsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchContacts = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      console.log('Fetching contacts from /admin/contacts...');
      const response = await api.get('/admin/contacts');
      console.log('Contacts response:', response.data);
      
      // Handle paginated response: response.data.data contains { current_page, data: [...] }
      let contactsData = [];
      if (response.data.data && Array.isArray(response.data.data.data)) {
        // Paginated response
        contactsData = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        // Direct array in data
        contactsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Direct array
        contactsData = response.data;
      }
      
      console.log('Extracted contacts:', contactsData);
      setContacts(contactsData);
      setLastUpdate(new Date());
      
      if (showToast) {
        showSuccess('Success', `Loaded ${contactsData.length} contacts`);
      }
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      console.error('Error response:', error.response?.data);
      
      if (showToast) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load contacts';
        showError('Error', errorMsg);
      }
      // Keep existing data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchContacts();
    
    // Subscribe to real-time contact updates
    const unsubscribe = realtimeService.subscribe('contacts', (data) => {
      if (data && Array.isArray(data)) {
        setContacts(data);
        setLastUpdate(new Date());
      } else {
        // If data format is different, fetch manually
        fetchContacts();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'read': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'replied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Mail;
      case 'read': return MailOpen;
      case 'replied': return CheckCircle;
      default: return Mail;
    }
  };

  const updateStatus = async (id: number, newStatus: 'new' | 'read' | 'replied') => {
    try {
      await api.patch(`/admin/contacts/${id}/status`, { status: newStatus });
      
      setContacts(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
      
      showSuccess('Status updated!');
    } catch (error) {
      showError('Failed to update status');
    }
  };

  const markAsRead = async (contact: Contact) => {
    setSelectedContact(contact);
    
    if (contact.status === 'new') {
      await updateStatus(contact.id, 'read');
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const response = await api.delete(`/admin/contacts/${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      showSuccess('Success', response.data.message || 'Contact deleted successfully');
    } catch (error: any) {
      console.error('Delete contact error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete contact';
      showError('Error', errorMsg);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Contact Messages
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time inbox • Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        </div>
        <button
          onClick={() => fetchContacts(true)}
          disabled={refreshing}
          className={`
            px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2
            ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-50 hover:bg-blue-100'}
            ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''} ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Refresh
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: contacts.length, icon: Mail, color: 'blue' },
          { label: 'New Messages', value: contacts.filter(c => c.status === 'new').length, icon: Mail, color: 'blue' },
          { label: 'Read', value: contacts.filter(c => c.status === 'read').length, icon: MailOpen, color: 'slate' },
          { label: 'Replied', value: contacts.filter(c => c.status === 'replied').length, icon: CheckCircle, color: 'green' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`
                p-4 rounded-xl border
                ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                  <Icon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </p>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={`
        p-4 rounded-xl border
        ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg text-sm
                  ${isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}
                  border focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`
                w-full px-4 py-2 rounded-lg text-sm
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'}
                border focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className={`
          lg:col-span-1 rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-20 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No messages found
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const StatusIcon = getStatusIcon(contact.status);
                return (
                  <div
                    key={contact.id}
                    onClick={() => markAsRead(contact)}
                    className={`
                      p-4 border-b cursor-pointer transition-colors
                      ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'}
                      ${selectedContact?.id === contact.id ? (isDark ? 'bg-slate-800/50' : 'bg-slate-50') : ''}
                      ${contact.status === 'new' ? 'font-semibold' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <StatusIcon className={`w-4 h-4 flex-shrink-0 ${contact.status === 'new' ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className={`text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {contact.name}
                        </span>
                      </div>
                      {contact.status === 'new' && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className={`text-sm mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {contact.subject}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {contact.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {getTimeAgo(contact.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className={`
          lg:col-span-2 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          {selectedContact ? (
            <div className="p-6">
              {/* Header */}
              <div className={`flex items-start justify-between mb-6 pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold`}>
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedContact.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedContact.email}
                    </p>
                    {selectedContact.phone && (
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {selectedContact.phone}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Subject
                </h4>
                <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedContact.subject}
                </p>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Message
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedContact.message}
                </p>
              </div>

              {/* Date */}
              <div className="mb-6">
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Received: {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {selectedContact.status !== 'replied' && (
                  <button
                    onClick={() => updateStatus(selectedContact.id, 'replied')}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                      text-white font-medium transition-all
                    "
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Replied
                  </button>
                )}
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                    text-white font-medium transition-all
                  "
                >
                  <Reply className="w-4 h-4" />
                  Reply via Email
                </a>
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${isDark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Mail className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a message to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContacts;
