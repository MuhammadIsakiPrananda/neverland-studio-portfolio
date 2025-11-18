import { Bell, Search, User } from 'lucide-react';
import { User as UserType } from '../../utils/api';

interface DashboardHeaderActionsProps {
  user: UserType | null;
  hasNotifications: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const DashboardHeaderActions = ({
  user,
  hasNotifications,
  searchValue,
  onSearchChange,
}: DashboardHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors w-64"
          data-testid="dashboard-search"
          aria-label="Search dashboard"
        />
      </div>

      {/* Notifications */}
      <button
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        data-testid="dashboard-notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {hasNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
        )}
      </button>

      {/* User Avatar */}
      <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
          <p className="text-xs text-slate-400">{user?.role || 'Administrator'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeaderActions;