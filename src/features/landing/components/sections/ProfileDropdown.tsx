import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { User, LogOut, Settings, LifeBuoy, FileText } from 'lucide-react';

interface ProfileDropdownProps {
  userProfile: {
    name: string;
    email: string;
    avatar: string | null;
  };
  onLogout: () => void;
  onDashboardClick: (section?: string) => void;
}

// Tipe untuk memastikan hanya section yang valid yang bisa dikirim
type DashboardSection = 'profile' | 'support' | 'terms';

const menuContainerVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const menuItemVariants: Variants = {
  open: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  closed: { y: 20, opacity: 0, transition: { duration: 0.15 } }
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

  const handleItemClick = (section: DashboardSection) => {
    setIsOpen(false); // Tutup dropdown terlebih dahulu
    onDashboardClick(section);
  };

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
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-20"
          >
            <motion.div variants={menuContainerVariants} initial="closed" animate="open" exit="closed" className="p-2.5">
              <div className="px-2 py-3 border-b border-white/10 mb-2">
                <p className="text-base font-bold text-white truncate">{userProfile.name}</p>
                <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
              </div>
              <motion.button 
                variants={menuItemVariants} 
                onClick={() => handleItemClick('profile')}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-100 flex items-center gap-3.5 rounded-lg transition-colors group"
              ><Settings className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" /> Profile Settings</motion.button>
              <motion.button 
                variants={menuItemVariants} 
                onClick={() => handleItemClick('support')}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-100 flex items-center gap-3.5 rounded-lg transition-colors group"
              ><LifeBuoy className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" /> Help Center</motion.button>
              <motion.button 
                variants={menuItemVariants} 
                onClick={() => handleItemClick('terms')}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-100 flex items-center gap-3.5 rounded-lg transition-colors group"
              ><FileText className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" /> Terms & Conditions</motion.button>
              
              <div className="border-t border-white/10 my-1.5"></div>

              <motion.button variants={menuItemVariants} onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3.5 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" /> Logout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;