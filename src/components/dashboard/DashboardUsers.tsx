import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import {
  Search,
  UserPlus,
  Trash2,
  Edit,
  X,
  Save,
  AlertCircle,
  Users,
  FileText
} from 'lucide-react';
import { userService } from '../../services/apiService';
import realtimeService from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';
import { useDashboardAuth } from '../../hooks/useDashboardAuth';
import AddUserModal from './AddUserModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


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
  const [newlyAddedUsers, setNewlyAddedUsers] = useState<number[]>([]); // Track new users for animation

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showEditModal || showAddModal) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Get scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Prevent scroll and compensate for scrollbar
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [showEditModal, showAddModal]);
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

  // Subscribe to real-time user updates with notifications
  useEffect(() => {
    let isSubscribed = true;
    let previousUserCount = users.length;
    let previousUserIds = new Set(users.map(u => u.id));

    const unsubscribeUsers = realtimeService.subscribe('users', (data) => {
      // Only refresh if we got valid data and component is still mounted
      if (isSubscribed && data && Array.isArray(data)) {
        const newCount = data.length;
        const oldCount = previousUserCount;
        const newUserIds = new Set(data.map((u: User) => u.id));
        
        // Find newly added users
        const addedUsers = data.filter((u: User) => !previousUserIds.has(u.id)).map((u: User) => u.id);
        if (addedUsers.length > 0) {
          setNewlyAddedUsers(addedUsers);
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setNewlyAddedUsers(prev => prev.filter(id => !addedUsers.includes(id)));
          }, 3000);
        }
        
        // Notify user of changes
        if (oldCount > 0 && newCount !== oldCount) {
          if (newCount > oldCount) {
            showSuccess('User Added', `New user joined! Total: ${newCount} users`, 3000);
          } else if (newCount < oldCount) {
            showSuccess('User Removed', `User deleted. Total: ${newCount} users`, 3000);
          }
        }
        
        setUsers(data);
        previousUserCount = newCount;
        previousUserIds = newUserIds;
        console.log('✅ Real-time update: received', data.length, 'users');
        
        // Update pagination total
        setPagination(prev => ({
          ...prev,
          total: newCount
        }));
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

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedUsers.map(id => userService.deleteUser(id)));
      showSuccess('Users Deleted', `Successfully deleted ${selectedUsers.length} user(s)`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: any) {
      showError('Delete Failed', error.message || 'Failed to delete users');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = () => {
    if (selectedUsers.length === 0) return;
    
    const selectedData = users.filter(u => selectedUsers.includes(u.id));
    const csv = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'].join(','),
      ...selectedData.map(u => [
        u.name,
        u.email,
        u.phone || '-',
        u.role || 'user',
        u.email_verified_at ? 'Verified' : 'Unverified',
        new Date(u.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showSuccess('Export Complete', `Exported ${selectedUsers.length} user(s)`);
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Users Management
          </h1>
          <p className={`text-sm font-normal mt-1 flex items-center gap-2 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <Users className={`w-4 h-4 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`} />
            Manage user accounts and permissions
          </p>
        </div>

        <Button 
          onClick={() => setShowAddModal(true)}
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className={`group relative overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${
          isDark
            ? 'border-slate-800/50 bg-slate-900/40 hover:border-slate-700/60'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>Total Users</p>
                <p className={`text-3xl font-black ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {pagination.total}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className={`relative p-3 rounded-xl border group-hover:border-primary/30 transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700/50'
                    : 'bg-slate-100/80 border-slate-200'
                }`}>
                  <Users className={`w-5 h-5 group-hover:text-primary transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`group relative overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-0.5 ${
          isDark
            ? 'border-slate-800/50 bg-slate-900/40 hover:border-slate-700/60'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>Verified Users</p>
                <p className={`text-3xl font-black ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {users.filter(u => u.email_verified_at).length}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className={`relative p-3 rounded-xl border group-hover:border-green-500/30 transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700/50'
                    : 'bg-slate-100/80 border-slate-200'
                }`}>
                  <UserPlus className={`w-5 h-5 group-hover:text-green-400 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`group relative overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 ${
          isDark
            ? 'border-slate-800/50 bg-slate-900/40 hover:border-slate-700/60'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>Current Page</p>
                <p className={`text-3xl font-black ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {pagination.current_page} / {pagination.last_page}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className={`relative p-3 rounded-xl border group-hover:border-blue-500/30 transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700/50'
                    : 'bg-slate-100/80 border-slate-200'
                }`}>
                  <FileText className={`w-5 h-5 group-hover:text-blue-400 transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Filter */}
      <Card className={`border backdrop-blur-sm ${
        isDark
          ? 'border-slate-800/50 bg-slate-900/40'
          : 'border-slate-200 bg-white'
      }`}>
        <CardContent className="p-5">
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-primary transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 h-10 focus:border-primary/50 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar - Always Visible */}
      <Card className={`border backdrop-blur-sm transition-all duration-300 ${
        selectedUsers.length > 0 
          ? 'border-primary/50 bg-primary/5' 
          : isDark
            ? 'border-slate-800/50 bg-slate-900/40'
            : 'border-slate-200 bg-white'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                selectedUsers.length > 0
                  ? 'bg-primary/20 border-primary/30'
                  : isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 border-slate-300'
              }`}>
                <span className={`text-sm font-bold transition-colors duration-300 ${
                  selectedUsers.length > 0 ? 'text-primary' : isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {selectedUsers.length}
                </span>
              </div>
              <div>
                <p className={`text-sm font-semibold transition-colors duration-300 ${
                  selectedUsers.length > 0 ? (isDark ? 'text-white' : 'text-slate-900') : isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {selectedUsers.length > 0 
                    ? `${selectedUsers.length} ${selectedUsers.length === 1 ? 'user' : 'users'} selected`
                    : 'No users selected'
                  }
                </p>
                <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
                  {selectedUsers.length > 0 
                    ? 'Choose an action to apply' 
                    : 'Select users to perform bulk actions'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExport}
                disabled={selectedUsers.length === 0}
                className={isDark ? 'border-slate-700 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed' : 'border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedUsers.length === 0}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedUsers.length === 0}
                className={isDark ? 'text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed' : 'text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className={`backdrop-blur-sm overflow-hidden ${
        isDark ? 'border-slate-800/50 bg-slate-900/40' : 'border-slate-200 bg-white'
      }`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={selectAllUsers}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No users found in database
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isNewlyAdded = newlyAddedUsers.includes(user.id);
                return (
                  <TableRow 
                    key={user.id}
                    className={isNewlyAdded ? 'animate-pulse bg-primary/10 border-l-4 border-l-primary' : ''}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.location || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id, user.name)}
                          title="Delete user"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                disabled={pagination.current_page === pagination.last_page}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <>
          {/* Full Screen Backdrop */}
          <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-y-auto">
            <div
              className={`w-full max-w-lg my-4 sm:my-8 rounded-2xl p-4 sm:p-6 pointer-events-auto ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
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
        </>
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
