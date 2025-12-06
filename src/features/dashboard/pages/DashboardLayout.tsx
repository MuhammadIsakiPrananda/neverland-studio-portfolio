import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const getPageTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return 'Dashboard';
  const title = segments[segments.length - 1];
  return title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' ');
};

const DashboardHeader = ({ onMenuClick, title }: { onMenuClick: () => void; title: string }) => (
  <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-gray-700/50 bg-gray-900/30 px-6 backdrop-blur-xl lg:hidden">
    <button
      onClick={onMenuClick}
      className="rounded-full p-2 text-slate-300 hover:bg-white/10"
      aria-label="Open sidebar"
    >
      <FiMenu className="h-6 w-6" />
    </button>
    <h1 className="text-xl font-bold text-white">{title}</h1>
  </header>
);

const DashboardLayout = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-900 text-slate-300">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} title={pageTitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
};

export default DashboardLayout;