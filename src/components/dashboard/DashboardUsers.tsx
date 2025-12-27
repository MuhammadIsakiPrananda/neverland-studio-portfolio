import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { 
  Search, 
  UserPlus, 
  Trash2,
  Edit,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { userService } from '../../services/apiService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';
import { useDashboardAuth } from '../../hooks/useDashboardAuth';
import AddUserModal from './AddUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  role?: string;
  bio?: string;
  location?: string;
  status?: string;
  created_at: string;
  email_verified_at?: string | null;
  avatar?: string;
}

interface DashboardUsersProps {
  theme: Theme;
}

const DashboardUsers: React.FC<DashboardUsersProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  // Ensure API token is available
  useDashboardAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Prevent concurrent fetches
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 15
  });

  // Fetch users from database with retry
  const fetchUsers = async (retryCount = 0) => {
    // Prevent concurrent fetches
    if (isFetching && retryCount === 0) {
      console.log('⏭️  Skipping fetch - already in progress');
      return;
    }
    
    try {
      setIsFetching(true);
      setLoading(true);
      console.log(`🔄 Fetching users... (attempt ${retryCount + 1})`);
      
      const response = await userService.getUsers({
        search: searchQuery,
        page: pagination.current_page,
        per_page: pagination.per_page
      });

      console.log('Users response:', response);

      if (response && response.success && response.data) {
        setUsers(response.data);
        // Only update pagination if values actually changed to prevent loop
        if (response.pagination) {
          setPagination(prev => {
            const hasChanged = 
              prev.total !== response.pagination.total ||
              prev.last_page !== response.pagination.last_page ||
              prev.per_page !== response.pagination.per_page;
            
            return hasChanged ? response.pagination : prev;
          });
        }
        console.log(`✅ Successfully loaded ${response.data.length} users`);
      } else {
        setUsers([]);
        if (retryCount < 2) {
          console.warn(`⚠️ Invalid response, retrying... (${retryCount + 1}/2)`);
          setTimeout(() => fetchUsers(retryCount + 1), 1000);
          return;
        }
        showError('No Users Found', 'Unable to load users from database');
      }
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      
      if (retryCount < 2) {
        console.warn(`⚠️ Retrying after error... (${retryCount + 1}/2)`);
        setTimeout(() => fetchUsers(retryCount + 1), 1000);
        return;
      }
      
      setUsers([]);
      const errorMsg = error.response?.data?.message || error.message || 'Could not fetch users';
      showError('Failed to Load Users', errorMsg);
    } finally {
      if (retryCount >= 2 || retryCount === 0) {
        setLoading(false);
        setIsFetching(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [pagination.current_page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to real-time user updates
  useEffect(() => {
    let isSubscribed = true;
    
    const unsubscribeUsers = realtimeService.subscribe('users', (data) => {
      // Only refresh if we got valid data and component is still mounted
      if (isSubscribed && data && Array.isArray(data)) {
        setUsers(data);
        console.log('✅ Real-time update: received', data.length, 'users');
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribeUsers();
    };
  }, []); // Only subscribe once

  // Search debounce
  useEffect(() => {
    if (!searchQuery) return; // Don't search on empty query
    
    const timer = setTimeout(() => {
      if (pagination.current_page === 1) {
        fetchUsers();
      } else {
        setPagination(prev => ({ ...prev, current_page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      // Prepare update data
      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        bio: editingUser.bio,
        location: editingUser.location,
        email_verified_at: editingUser.email_verified_at
      };

      console.log('Updating user with data:', updateData);

      const response = await userService.updateUser(editingUser.id, updateData);

      console.log('Update response:', response);

      if (response.success) {
        showSuccess('User Updated', 'Email verification status has been updated');
        setShowEditModal(false);
        setEditingUser(null);
        await fetchUsers(); // Refresh list to update badges
      }
    } catch (error: any) {
      console.error('Update error:', error);
      showError('Update Failed', error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      const response = await userService.updateUser(userId, { status: newStatus });
      
      if (response.success) {
        showSuccess('Status Updated', `User status changed to ${newStatus}`);
        fetchUsers(); // Refresh list
      }
    } catch (error: any) {
      showError('Update Failed', error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return;

    try {
      const response = await userService.deleteUser(userId);
      
      if (response.success) {
        showSuccess('User Deleted', 'User has been removed successfully');
        fetchUsers(); // Refresh list
      }
    } catch (error: any) {
      showError('Delete Failed', error.response?.data?.message || 'Failed to delete user');
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Users Management
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage user accounts from database (Realtime)
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-sm">Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className={`p-3 sm:p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Users</p>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {pagination.total}
          </p>
        </div>
        <div className={`p-3 sm:p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Users</p>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {users.filter(u => u.email_verified_at).length}
          </p>
        </div>
        <div className={`p-3 sm:p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Current Page</p>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {pagination.current_page} / {pagination.last_page}
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-slate-800">
            <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={selectAllUsers}
                    className="rounded"
                  />
                </th>
                <th className={`px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  User
                </th>
                <th className={`hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Location
                </th>
                <th className={`px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Status
                </th>
                <th className={`hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Joined
                </th>
                <th className={`px-3 sm:px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4" colSpan={6}>
                      <div className={`h-12 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Search className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      No users found in database
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs sm:text-base">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-medium text-xs sm:text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {user.location || '-'}
                      </p>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${user.email_verified_at ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className={`px-3 sm:px-4 py-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                  disabled={pagination.current_page === 1}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50'} disabled:cursor-not-allowed`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50'} disabled:cursor-not-allowed`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-lg my-4 sm:my-8 rounded-2xl p-4 sm:p-6 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Edit User
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 sm:pr-2">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Phone
                </label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  value={editingUser.location || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Verification Status
                </label>
                <select
                  value={editingUser?.email_verified_at ? 'verified' : 'unverified'}
                  onChange={(e) => setEditingUser({ 
                    ...editingUser!, 
                    email_verified_at: e.target.value === 'verified' ? '1' : null 
                  })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                >
                  <option value="verified">✓ Verified</option>
                  <option value="unverified">✗ Unverified</option>
                </select>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Control email verification status for this user
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Bio
                </label>
                <textarea
                  value={editingUser.bio || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchUsers();
        }}
        theme={theme}
      />
    </div>
  );
};

export default DashboardUsers;
