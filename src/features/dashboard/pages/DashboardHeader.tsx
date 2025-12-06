import { motion } from 'framer-motion';
import { useState } from 'react';
import DashboardHeaderActions from './DashboardHeaderActions';

interface DashboardHeaderProps {
  user: any | null;
  title: string;
}

const DashboardHeader = ({ user, title }: DashboardHeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  // Contoh: Anda bisa mendapatkan status notifikasi dari state atau API
  const hasNotifications = true;

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
        <DashboardHeaderActions
          user={user}
          hasNotifications={hasNotifications}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>
    </motion.header>
  );
};

export default DashboardHeader;