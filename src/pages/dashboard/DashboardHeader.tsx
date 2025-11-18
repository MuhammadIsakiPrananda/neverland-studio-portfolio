import { motion } from 'framer-motion';
import { Bell, Search, User } from 'lucide-react';
import { User as UserType } from '../../utils/api';

interface DashboardHeaderProps {
  user: UserType | null;
  title: string;
}

const DashboardHeader = ({ user, title }: DashboardHeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-slate-900/50 border-b border-slate-800 px-8 py-4 sticky top-0 z-10 backdrop-blur-sm"
      data-testid="dashboard-header"
    >
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="dashboard-title">{title}</h1>
          <p className="text-slate-400 text-sm">Welcome back, {user?.name || 'Admin'}!</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors w-64"
              data-testid="dashboard-search"
            />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            data-testid="dashboard-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
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
      </div>
    </motion.header>
  );
};

export default DashboardHeader;