import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { 
  Search,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Book,
  Award,
  RefreshCw,
  Filter,
  Plus,
  Edit,
  X,
  Save
} from 'lucide-react';
import api from '../../services/apiService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface Enrollment {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  course_id: number;
  course_title: string;
  preferred_day?: string;
  preferred_time?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

interface DashboardEnrollmentsProps {
  theme: Theme;
}

const DashboardEnrollments: React.FC<DashboardEnrollmentsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    course_id: 1,
    course_title: '',
    preferred_day: '',
    preferred_time: '',
    message: '',
    admin_notes: '',
    status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled'
  });
  const [saving, setSaving] = useState(false);

  const fetchEnrollments = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const response = await api.get('/admin/enrollments?per_page=1000');
      
      // Handle paginated response from Laravel
      let enrollmentsData = [];
      
      if (response.data?.success) {
        const data = response.data.data;
        
        // Check if paginated (Laravel pagination has 'data' property)
        if (data && typeof data === 'object' && 'data' in data) {
          enrollmentsData = Array.isArray(data.data) ? data.data : [];
        } else if (Array.isArray(data)) {
          enrollmentsData = data;
        }
      }
      
      console.log('✅ Fetched enrollments:', enrollmentsData.length, enrollmentsData);
      setEnrollments(enrollmentsData);
      setLastUpdate(new Date());
      
      if (showToast) {
        showSuccess(`Enrollments refreshed! (${enrollmentsData.length} total)`);
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch enrollments:', error);
      if (showToast) {
        showError('Failed to load enrollments');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('🔄 [Enrollments] Component mounted, starting realtime updates...');
    fetchEnrollments();
    setIsRealTimeActive(true);
    
    // Subscribe to real-time enrollment updates with faster interval (3 seconds)
    const unsubscribe = realtimeService.subscribe('enrollments', (data) => {
      console.log('📡 [Enrollments] Realtime update received:', data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ [Enrollments] Updating with', data.length, 'enrollments');
        setEnrollments(data);
        setLastUpdate(new Date());
      } else {
        console.log('⚠️ [Enrollments] No data in realtime update, fetching manually...');
        fetchEnrollments();
      }
    }, 3000); // Update every 3 seconds for faster response
    
    return () => {
      console.log('🛑 [Enrollments] Component unmounting, stopping realtime updates');
      setIsRealTimeActive(false);
      unsubscribe();
    };
  }, []);  

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course_title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const updateStatus = async (id: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await api.patch(`/admin/enrollments/${id}/status`, { status: newStatus });
      
      setEnrollments(prev => prev.map(e => 
        e.id === id ? { ...e, status: newStatus } : e
      ));
      
      if (selectedEnrollment?.id === id) {
        setSelectedEnrollment({ ...selectedEnrollment, status: newStatus });
      }
      
      showSuccess(`Enrollment ${newStatus}!`);
    } catch (error) {
      showError('Failed to update status');
    }
  };

  const deleteEnrollment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/enrollments/${id}`);
      
      setEnrollments(prev => prev.filter(e => e.id !== id));
      
      if (selectedEnrollment?.id === id) {
        setSelectedEnrollment(null);
      }
      
      showSuccess('Enrollment deleted successfully!');
    } catch (error) {
      showError('Failed to delete enrollment');
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

  // Open modal for creating new enrollment
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      course_id: 1,
      course_title: '',
      preferred_day: '',
      preferred_time: '',
      message: '',
      admin_notes: '',
      status: 'pending'
    });
    setShowModal(true);
  };

  // Open modal for editing enrollment
  const openEditModal = (enrollment: Enrollment) => {
    setModalMode('edit');
    setFormData({
      full_name: enrollment.full_name,
      email: enrollment.email,
      phone: enrollment.phone,
      course_id: enrollment.course_id,
      course_title: enrollment.course_title,
      preferred_day: enrollment.preferred_day || '',
      preferred_time: enrollment.preferred_time || '',
      message: enrollment.message || '',
      admin_notes: enrollment.admin_notes || '',
      status: enrollment.status
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (modalMode === 'create') {
        const response = await api.post('/admin/enrollments', formData);
        setEnrollments(prev => [response.data.data, ...prev]);
        showSuccess('Enrollment created successfully!');
      } else {
        const response = await api.put(`/admin/enrollments/${selectedEnrollment?.id}`, formData);
        setEnrollments(prev => prev.map(e => 
          e.id === selectedEnrollment?.id ? response.data.data : e
        ));
        if (selectedEnrollment) {
          setSelectedEnrollment(response.data.data);
        }
        showSuccess('Enrollment updated successfully!');
      }
      
      setShowModal(false);
      fetchEnrollments();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to save enrollment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Course Enrollments
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time enrollment management
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Enrollment</span>
          </button>
          <button
            onClick={() => fetchEnrollments(true)}
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
          { label: 'Total Enrollments', value: enrollments.length, icon: GraduationCap, color: 'blue' },
          { label: 'Pending', value: enrollments.filter(e => e.status === 'pending').length, icon: Clock, color: 'yellow' },
          { label: 'Confirmed', value: enrollments.filter(e => e.status === 'confirmed').length, icon: Award, color: 'blue' },
          { label: 'Completed', value: enrollments.filter(e => e.status === 'completed').length, icon: CheckCircle, color: 'green' },
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
                placeholder="Search enrollments..."
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
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments List & Detail */}
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
            ) : filteredEnrollments.length === 0 ? (
              <div className="p-8 text-center">
                <GraduationCap className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No enrollments found
                </p>
              </div>
            ) : (
              filteredEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  onClick={() => setSelectedEnrollment(enrollment)}
                  className={`
                    p-4 border-b cursor-pointer transition-colors
                    ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'}
                    ${selectedEnrollment?.id === enrollment.id ? (isDark ? 'bg-slate-800/50' : 'bg-slate-50') : ''}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GraduationCap className="w-4 h-4 flex-shrink-0 text-blue-400" />
                      <span className={`text-sm truncate font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {enrollment.full_name}
                      </span>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full border ${getStatusColor(enrollment.status)}`}>
                      {enrollment.status}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {enrollment.course_title}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {enrollment.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {getTimeAgo(enrollment.created_at)}
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
          {selectedEnrollment ? (
            <div className="p-6">
              <div className={`flex items-start justify-between mb-6 pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    {selectedEnrollment.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedEnrollment.full_name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedEnrollment.email}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedEnrollment.phone}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEnrollment.status)}`}>
                  {selectedEnrollment.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Course
                  </h4>
                  <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedEnrollment.course_title}
                  </p>
                </div>

                {selectedEnrollment.preferred_day && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Preferred Schedule
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedEnrollment.preferred_day} at {selectedEnrollment.preferred_time}
                    </p>
                  </div>
                )}

                {selectedEnrollment.message && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Message
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedEnrollment.message}
                    </p>
                  </div>
                )}

                {selectedEnrollment.admin_notes && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Admin Notes
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedEnrollment.admin_notes}
                    </p>
                  </div>
                )}

                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Submitted: {new Date(selectedEnrollment.created_at).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => openEditModal(selectedEnrollment)}
                  className="
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700
                    text-white font-medium transition-all
                  "
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {selectedEnrollment.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'confirmed')}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                      text-white font-medium transition-all
                    "
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>
                )}
                {selectedEnrollment.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'completed')}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                      text-white font-medium transition-all
                    "
                  >
                    <Award className="w-4 h-4" />
                    Complete
                  </button>
                )}
                {(selectedEnrollment.status === 'pending' || selectedEnrollment.status === 'confirmed') && (
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'cancelled')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${isDark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}
                    `}
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                {selectedEnrollment.status === 'cancelled' && (
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'pending')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${isDark ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'}
                    `}
                  >
                    <Clock className="w-4 h-4" />
                    Set Pending
                  </button>
                )}
                <button
                  onClick={() => deleteEnrollment(selectedEnrollment.id)}
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
              <GraduationCap className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select an enrollment to view details
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
                    {modalMode === 'create' ? 'Add New Enrollment' : 'Edit Enrollment'}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {modalMode === 'create' ? 'Create a new enrollment entry' : 'Update enrollment information'}
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
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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

                  {/* Course Title */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Book className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        required
                        value={formData.course_title}
                        onChange={(e) => setFormData({ ...formData, course_title: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                        } focus:outline-none`}
                        placeholder="Web Development Bootcamp"
                      />
                    </div>
                  </div>

                  {/* Preferred Day */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Preferred Day
                    </label>
                    <input
                      type="text"
                      value={formData.preferred_day}
                      onChange={(e) => setFormData({ ...formData, preferred_day: e.target.value })}
                      className={`w-full px-4 py-2 rounded-xl transition-colors ${
                        isDark
                          ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                          : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                      } focus:outline-none`}
                      placeholder="Monday, Wednesday"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Preferred Time
                    </label>
                    <input
                      type="text"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className={`w-full px-4 py-2 rounded-xl transition-colors ${
                        isDark
                          ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                          : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                      } focus:outline-none`}
                      placeholder="10:00 - 12:00"
                    />
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
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Student Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-xl transition-colors resize-none ${
                        isDark
                          ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                          : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                      } focus:outline-none`}
                      placeholder="Student's message or inquiry..."
                    />
                  </div>

                  {/* Admin Notes */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Admin Notes
                    </label>
                    <textarea
                      value={formData.admin_notes}
                      onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-xl transition-colors resize-none ${
                        isDark
                          ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-400'
                          : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                      } focus:outline-none`}
                      placeholder="Internal notes (not visible to student)..."
                    />
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
                        {modalMode === 'create' ? 'Create Enrollment' : 'Update Enrollment'}
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

export default DashboardEnrollments;
