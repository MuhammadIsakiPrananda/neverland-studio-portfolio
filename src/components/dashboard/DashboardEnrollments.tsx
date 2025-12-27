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
  Filter
} from 'lucide-react';
import api from '../../services/apiService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';

interface Enrollment {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  program: string;
  experience_level?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchEnrollments = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const response = await api.get('/admin/enrollments');
      const enrollmentsData = response.data.data || response.data;
      
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      setLastUpdate(new Date());
      
      if (showToast) {
        showSuccess('Enrollments refreshed!');
      }
    } catch (error: any) {
      console.error('Failed to fetch enrollments:', error);
      if (showToast) {
        showError('Failed to load enrollments');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    
    // Subscribe to real-time enrollment updates
    const unsubscribe = realtimeService.subscribe('enrollments', (data) => {
      if (data && Array.isArray(data)) {
        setEnrollments(data);
        setLastUpdate(new Date());
      } else {
        fetchEnrollments();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.program.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const updateStatus = async (id: number, newStatus: 'pending' | 'approved' | 'rejected') => {
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
            Course Enrollments
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time enrollment management • Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrollments', value: enrollments.length, icon: GraduationCap, color: 'blue' },
          { label: 'Pending', value: enrollments.filter(e => e.status === 'pending').length, icon: Clock, color: 'yellow' },
          { label: 'Approved', value: enrollments.filter(e => e.status === 'approved').length, icon: CheckCircle, color: 'green' },
          { label: 'Rejected', value: enrollments.filter(e => e.status === 'rejected').length, icon: XCircle, color: 'red' },
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
                    {enrollment.program}
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
                    Program
                  </h4>
                  <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedEnrollment.program}
                  </p>
                </div>

                {selectedEnrollment.experience_level && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Experience Level
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedEnrollment.experience_level}
                    </p>
                  </div>
                )}

                {selectedEnrollment.motivation && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Motivation
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {selectedEnrollment.motivation}
                    </p>
                  </div>
                )}

                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Submitted: {new Date(selectedEnrollment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {selectedEnrollment.status !== 'approved' && (
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'approved')}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                      text-white font-medium transition-all
                    "
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {selectedEnrollment.status !== 'rejected' && (
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'rejected')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${isDark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}
                    `}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                )}
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
    </div>
  );
};

export default DashboardEnrollments;
