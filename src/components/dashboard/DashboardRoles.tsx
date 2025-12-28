import React from 'react';
import type { Theme } from '../../types';
import { Shield, Users, Check, X } from 'lucide-react';

interface DashboardRolesProps {
  theme: Theme;
}

const DashboardRoles: React.FC<DashboardRolesProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const roles = [
    { id: 1, name: 'Super Admin', users: 2, permissions: { all: true } },
    { id: 2, name: 'Admin', users: 5, permissions: { users: true, content: true, analytics: false } },
    { id: 3, name: 'Editor', users: 12, permissions: { content: true, users: false, analytics: false } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Roles & Permissions
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage user roles and access control
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {roles.map(role => (
          <div key={role.id} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{role.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{role.users} users</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['Users', 'Content', 'Analytics'].map((perm, idx) => {
                const key = perm.toLowerCase() as keyof typeof role.permissions;
                const hasPermission = role.permissions.all || role.permissions[key];
                return (
                  <div key={idx} className={`flex items-center gap-2 text-sm ${hasPermission ? 'text-green-500' : 'text-red-500'}`}>
                    {hasPermission ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {perm}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRoles;
