import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { 
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  RefreshCw,
  Plus,
  Edit,
  X,
  Save
} from 'lucide-react';
import api from '../../services/apiService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  preferred_date?: string;
  message?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

interface DashboardConsultationsProps {
  theme: Theme;
}

const DashboardConsultations: React.FC<DashboardConsultationsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    preferred_date: '',
    message: '',
    status: 'pending' as 'pending' | 'scheduled' | 'completed' | 'cancelled'
  });
  const [saving, setSaving] = useState(false);

  const fetchConsultations = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const response = await api.get('/admin/consultations?per_page=1000');
      
      // Handle paginated response from Laravel
      let consultationsData = [];
      
      if (response.data?.success) {
        const data = response.data.data;
        
        // Check if paginated (Laravel pagination has 'data' property)
        if (data && typeof data === 'object' && 'data' in data) {
          consultationsData = Array.isArray(data.data) ? data.data : [];
        } else if (Array.isArray(data)) {
          consultationsData = data;
        }
      }
      
      console.log('✅ Fetched consultations:', consultationsData.length, consultationsData);
      setConsultations(consultationsData);
      setLastUpdate(new Date());
      
      if (showToast) {
        showSuccess(`Consultations refreshed! (${consultationsData.length} total)`);
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch consultations:', error);
      if (showToast) {
        showError('Failed to load consultations');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('🔄 [Consultations] Component mounted, starting realtime updates...');
    fetchConsultations();
    setIsRealTimeActive(true);
    
    // Subscribe to real-time consultation updates with faster interval (3 seconds)
    const unsubscribe = realtimeService.subscribe('consultations', (data) => {
      console.log('📡 [Consultations] Realtime update received:', data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ [Consultations] Updating with', data.length, 'consultations');
        setConsultations(data);
        setLastUpdate(new Date());
      } else {
        console.log('⚠️ [Consultations] No data in realtime update, fetching manually...');
        fetchConsultations();
      }
    }, 3000); // Update every 3 seconds for faster response
    
    return () => {
      console.log('🛑 [Consultations] Component unmounting, stopping realtime updates');
      setIsRealTimeActive(false);
      unsubscribe();
    };
  }, []);  

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.service_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || consultation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const updateStatus = async (id: number, newStatus: 'pending' | 'scheduled' | 'completed' | 'cancelled') => {
    try {
      await api.patch(`/admin/consultations/${id}/status`, { status: newStatus });
      
      setConsultations(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      
      if (selectedConsultation?.id === id) {
        setSelectedConsultation({ ...selectedConsultation, status: newStatus });
      }
      
      showSuccess(`Consultation ${newStatus}!`);
    } catch (error) {
      showError('Failed to update status');
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

  // Open modal for creating new consultation
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service_type: '',
      preferred_date: '',
      message: '',
      status: 'pending'
    });
    setShowModal(true);
  };

  // Open modal for editing consultation
  const openEditModal = (consultation: Consultation) => {
    setModalMode('edit');
    setFormData({
      name: consultation.name,
      email: consultation.email,
      phone: consultation.phone,
      service_type: consultation.service_type,
      preferred_date: consultation.preferred_date || '',
      message: consultation.message || '',
      status: consultation.status
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (modalMode === 'create') {
        const response = await api.post('/admin/consultations', formData);
        setConsultations(prev => [response.data.data, ...prev]);
        showSuccess('Consultation created successfully!');
      } else {
        const response = await api.put(`/admin/consultations/${selectedConsultation?.id}`, formData);
        setConsultations(prev => prev.map(c => 
          c.id === selectedConsultation?.id ? response.data.data : c
        ));
        if (selectedConsultation) {
          setSelectedConsultation(response.data.data);
        }
        showSuccess('Consultation updated successfully!');
      }
      
      setShowModal(false);
      fetchConsultations();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to save consultation');
    } finally {
      setSaving(false);
    }
  };

  const deleteConsultation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this consultation? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/consultations/${id}`);
      
      setConsultations(prev => prev.filter(c => c.id !== id));
      
      if (selectedConsultation?.id === id) {
        setSelectedConsultation(null);
      }
      
      showSuccess('Consultation deleted successfully!');
    } catch (error) {
      showError('Failed to delete consultation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Consultation Bookings
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time booking management
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Booking</span>
          </button>
          <button
            onClick={() => fetchConsultations(true)}
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: consultations.length, icon: Calendar, color: 'blue' },
          { label: 'Pending', value: consultations.filter(c => c.status === 'pending').length, icon: Clock, color: 'yellow' },
          { label: 'Scheduled', value: consultations.filter(c => c.status === 'scheduled').length, icon: Calendar, color: 'blue' },
          { label: 'Completed', value: consultations.filter(c => c.status === 'completed').length, icon: CheckCircle, color: 'green' },
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
          <div className="md:col-span-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search consultations..."
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
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultations List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
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
            ) : filteredConsultations.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No consultations found
                </p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  onClick={() => setSelectedConsultation(consultation)}
                  className={`
                    p-4 border-b cursor-pointer transition-colors
                    ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'}
                    ${selectedConsultation?.id === consultation.id ? (isDark ? 'bg-slate-800/50' : 'bg-slate-50') : ''}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-blue-400" />
                      <span className={`text-sm truncate font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {consultation.name}
                      </span>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full border ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {consultation.service_type}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {consultation.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {getTimeAgo(consultation.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className={`
          lg:col-span-2 rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          {selectedConsultation ? (
            <div className="p-6">
              <div className={`flex items-start justify-between mb-6 pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    {selectedConsultation.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedConsultation.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedConsultation.email}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedConsultation.phone}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedConsultation.status)}`}>
                  {selectedConsultation.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Service Type
                  </h4>
                  <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedConsultation.service_type}
                  </p>
                </div>

                {selectedConsultation.preferred_date && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Preferred Date
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {new Date(selectedConsultation.preferred_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedConsultation.message && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Message
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedConsultation.message}
                    </p>
                  </div>
                )}

                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Requested: {new Date(selectedConsultation.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => openEditModal(selectedConsultation)}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700
                    text-white font-medium transition-all
                  "
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {selectedConsultation.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(selectedConsultation.id, 'scheduled')}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                      text-white font-medium transition-all
                    "
                  >
                    <CheckCircle className="w-4 h-4" />
                    Schedule
                  </button>
                )}
                {selectedConsultation.status === 'scheduled' && (
                  <button
                    onClick={() => updateStatus(selectedConsultation.id, 'completed')}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                      text-white font-medium transition-all
                    "
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                {(selectedConsultation.status === 'pending' || selectedConsultation.status === 'scheduled') && (
                  <button
                    onClick={() => updateStatus(selectedConsultation.id, 'cancelled')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${isDark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}
                    `}
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => deleteConsultation(selectedConsultation.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ml-auto
                    ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}
                  `}
                >
                  <XCircle className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a consultation to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className={`
                relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl
                ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {modalMode === 'create' ? 'Add New Consultation' : 'Edit Consultation'}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {modalMode === 'create' ? 'Create a new consultation booking' : 'Update consultation information'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        required
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                        placeholder="Web Development Consultation"
                      />
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className={`w-full px-4 py-2 rounded-xl transition-colors ${
                        isDark
                          ? 'bg-slate-800 border border-slate-700 text-white focus:border-blue-400'
                          : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-slate-400'
                      } focus:outline-none`}
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors resize-none ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                        placeholder="Client's message or inquiry..."
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      saving
                        ? 'bg-slate-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/20'
                    } text-white`}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {modalMode === 'create' ? 'Create Booking' : 'Update Booking'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardConsultations;
