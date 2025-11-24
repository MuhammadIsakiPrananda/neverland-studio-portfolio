import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
} as const;

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="bg-gray-900 text-slate-300 min-h-screen font-sans flex">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardLayout;