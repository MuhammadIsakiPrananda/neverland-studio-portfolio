import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LayoutDashboard, LogOut, Settings, LifeBuoy } from 'lucide-react';

interface ProfileDropdownProps {
  userProfile: {
    name: string;
    email: string;
    avatar: string | null;
  };
  onLogout: () => void;
  onDashboardClick: () => void;
}

const menuContainerVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const menuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } }
  },
  closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } }
};

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userProfile, onLogout, onDashboardClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 hover:border-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
        {userProfile.avatar ? (
          <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl shadow-black/40 z-20"
          >
            <motion.div variants={menuContainerVariants} initial="closed" animate="open" exit="closed" className="p-2">
              <div className="px-2 py-2 border-b border-slate-700 mb-2">
                <p className="text-sm font-semibold text-white truncate">{userProfile.name}</p>
                <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
              </div>
              <motion.button variants={menuItemVariants} onClick={() => { onDashboardClick(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-3 rounded-md"><LayoutDashboard className="w-4 h-4" /> Dashboard</motion.button>
              <motion.button variants={menuItemVariants} onClick={() => { onDashboardClick(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-3 rounded-md"><Settings className="w-4 h-4" /> Settings</motion.button>
              
              <div className="border-t border-slate-700 my-2"></div>

              <motion.button variants={menuItemVariants} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-3 rounded-md"><LifeBuoy className="w-4 h-4" /> Support</motion.button>
              
              <div className="border-t border-slate-700 my-2"></div>

              <motion.button variants={menuItemVariants} onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 rounded-md">
                <LogOut className="w-4 h-4" /> Logout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;