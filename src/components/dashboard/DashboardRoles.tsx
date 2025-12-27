import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  Lock,
  Unlock,
  Settings,
  Eye,
  Database
} from 'lucide-react';

interface DashboardRolesProps {
  theme: Theme;
}

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  color: string;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
}

const DashboardRoles: React.FC<DashboardRolesProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      users: 2,
      permissions: ['all'],
      color: 'red',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access to most features',
      users: 5,
      permissions: ['users.manage', 'projects.manage', 'content.manage', 'analytics.view'],
      color: 'blue',
      createdAt: '2025-01-05'
    },
    {
      id: '3',
      name: 'Project Manager',
      description: 'Manage projects and team assignments',
      users: 12,
      permissions: ['projects.manage', 'projects.view', 'users.view'],
      color: 'green',
      createdAt: '2025-01-10'
    },
    {
      id: '4',
      name: 'Editor',
      description: 'Create and edit content',
      users: 25,
      permissions: ['content.create', 'content.edit', 'content.view'],
      color: 'purple',
      createdAt: '2025-01-15'
    },
    {
      id: '5',
      name: 'Viewer',
      description: 'Read-only access to content',
      users: 56,
      permissions: ['content.view', 'projects.view'],
      color: 'gray',
      createdAt: '2025-01-20'
    }
  ];

  const permissionCategories = [
    {
      category: 'User Management',
      permissions: [
        { id: 'users.view', name: 'View Users', enabled: true },
        { id: 'users.create', name: 'Create Users', enabled: true },
        { id: 'users.edit', name: 'Edit Users', enabled: true },
        { id: 'users.delete', name: 'Delete Users', enabled: false },
        { id: 'users.manage', name: 'Manage Users', enabled: true }
      ]
    },
    {
      category: 'Project Management',
      permissions: [
        { id: 'projects.view', name: 'View Projects', enabled: true },
        { id: 'projects.create', name: 'Create Projects', enabled: true },
        { id: 'projects.edit', name: 'Edit Projects', enabled: true },
        { id: 'projects.delete', name: 'Delete Projects', enabled: false },
        { id: 'projects.manage', name: 'Manage Projects', enabled: true }
      ]
    },
    {
      category: 'Content Management',
      permissions: [
        { id: 'content.view', name: 'View Content', enabled: true },
        { id: 'content.create', name: 'Create Content', enabled: true },
        { id: 'content.edit', name: 'Edit Content', enabled: true },
        { id: 'content.delete', name: 'Delete Content', enabled: false },
        { id: 'content.manage', name: 'Manage Content', enabled: true }
      ]
    },
    {
      category: 'Analytics',
      permissions: [
        { id: 'analytics.view', name: 'View Analytics', enabled: true },
        { id: 'analytics.export', name: 'Export Reports', enabled: true }
      ]
    },
    {
      category: 'Settings',
      permissions: [
        { id: 'settings.view', name: 'View Settings', enabled: true },
        { id: 'settings.edit', name: 'Edit Settings', enabled: false }
      ]
    }
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Roles', value: roles.length.toString(), icon: Shield, color: 'blue' },
    { label: 'Total Users', value: roles.reduce((sum, r) => sum + r.users, 0).toString(), icon: Users, color: 'green' },
    { label: 'Active Permissions', value: '42', icon: Lock, color: 'purple' },
    { label: 'Custom Roles', value: '3', icon: Settings, color: 'cyan' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Roles & Permissions
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage user roles and access control permissions
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Role
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
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className={`
        p-4 rounded-xl border
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className={`relative ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search roles..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <div className={`
            rounded-xl border overflow-hidden
            ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
          `}>
            <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                All Roles ({filteredRoles.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-700">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    p-4 cursor-pointer transition-colors
                    ${selectedRole === role.id
                      ? isDark ? 'bg-blue-500/20 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500'
                      : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br from-${role.color}-500 to-${role.color}-600 shadow-lg shadow-${role.color}-500/20`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {role.name}
                      </h3>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {role.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            {role.users} users
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            {role.permissions.includes('all') ? 'All' : role.permissions.length} perms
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className={`flex-1 px-3 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button className={`flex-1 px-3 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${isDark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="lg:col-span-2">
          <div className={`
            rounded-xl border overflow-hidden
            ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
          `}>
            <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Permission Settings
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedRole 
                  ? `Configure permissions for ${roles.find(r => r.id === selectedRole)?.name}`
                  : 'Select a role to configure permissions'
                }
              </p>
            </div>

            <div className="p-4 space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.category}>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.permissions.map((perm) => (
                      <div
                        key={perm.id}
                        className={`
                          p-3 rounded-lg border transition-all cursor-pointer
                          ${perm.enabled
                            ? isDark ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' : 'bg-green-50 border-green-200 hover:bg-green-100'
                            : isDark ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {perm.enabled ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-slate-400" />
                            )}
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {perm.name}
                            </span>
                          </div>
                          {perm.enabled ? (
                            <Unlock className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                          ) : (
                            <Lock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} flex justify-end gap-3`}>
              <button className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoles;
