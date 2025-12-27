import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../../types';
import { 
  Search, 
  Filter,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { userService, type User } from '../../services/userService';
import { showSuccess, showError } from '../common/ModernNotification';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

interface UserManagementProps {
  theme: Theme;
}

const UserManagement: React.FC<UserManagementProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: null as number | null,
    to: null as number | null,
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current_page,
        per_page: pagination.per_page,
      };

      if (searchQuery) params.search = searchQuery;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await userService.fetchUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.per_page, searchQuery, filterStatus]);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      showSuccess('Success', 'User deleted successfully');
      fetchUsers(); // Refresh list
    } catch (error: any) {
      showError('Error', error.message || 'Failed to delete user');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: isDark 
        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
        : 'bg-green-100 text-green-800 border border-green-200',
      inactive: isDark
        ? 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
        : 'bg-gray-100 text-gray-800 border border-gray-200',
      suspended: isDark
        ? 'bg-red-500/20 text-red-300 border border-red-400/30'
        : 'bg-red-100 text-red-800 border border-red-200',
      pending: isDark
        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${statusColors[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            User Management
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
            Manage all users and their permissions
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
              ${isDark 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}
            `}
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
              ${isDark 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30' 
                : 'bg-stone-900 text-white hover:bg-stone-800'}
            `}
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`
        p-4 rounded-2xl
        ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-stone-400'
            }`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-xl transition-colors
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                focus:outline-none
              `}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-stone-600'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                px-4 py-2 rounded-xl transition-colors cursor-pointer
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900'}
                focus:outline-none
              `}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`
        rounded-2xl overflow-hidden
        ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-amber-400' : 'text-stone-900'}`} />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
              No users found
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-800/50' : 'bg-stone-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-stone-600'
                    }`}>
                      User
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-stone-600'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-stone-600'
                    }`}>
                      Joined
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-stone-600'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-stone-100'}`}>
                  {users.map((user) => (
                    <tr 
                      key={user.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-gray-800/30' : 'hover:bg-stone-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                              {user.name}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-stone-100 text-stone-600'
                            }`}
                            title="View user"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-stone-100 text-stone-600'
                            }`}
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                            }`}
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} users
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    Previous
                  </button>
                  <span className={`px-3 py-1 rounded-lg text-sm ${
                    isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-stone-900 text-white'
                  }`}>
                    {pagination.current_page}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-stone-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  User Details
                </h3>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className={`p-2 rounded-lg ${
                    isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {selectedUser.name}
                  </h4>
                  <p className={isDark ? 'text-gray-400' : 'text-stone-600'}>
                    {selectedUser.username ? `@${selectedUser.username}` : selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Email</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>{selectedUser.email}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Phone</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>{selectedUser.phone}</p>
                  </div>
                )}
                {selectedUser.location && (
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Location</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>{selectedUser.location}</p>
                  </div>
                )}
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Status</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
                {selectedUser.bio && (
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>Bio</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>{selectedUser.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchUsers}
        theme={theme}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
        theme={theme}
      />
    </div>
  );
};

export default UserManagement;
