import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const MainLayout = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative lg:flex min-h-screen bg-slate-950 text-white">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden p-4 border-b border-slate-800 flex items-center">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-slate-800">
            <FiMenu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold ml-4">Neverland</h1>
        </div>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;