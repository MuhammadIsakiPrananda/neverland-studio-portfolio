
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { navItems } from '../../data/navItems'; 
import ProfileDropdown from '../sections/ProfileDropdown';

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; avatar: string | null; };
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isMenuOpen, setIsMenuOpen, activeSection, handleNavClick, isLoggedIn, userProfile, onLoginClick, onLogout, onDashboardClick }) => {
  const menuVariants: Variants = {
    hidden: { x: '100%', transition: { type: 'tween', duration: 0.3, ease: 'easeIn' } },
    visible: { x: '0%', transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
        <a href="#Home" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }} className="z-50 group">
          <Logo />
        </a>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white z-50 w-12 h-12 flex items-center justify-center bg-gray-800/50 border border-gray-700/50 rounded-full backdrop-blur-sm"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-slate-900/90 border-l border-slate-800/50 p-8 flex flex-col"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <button onClick={() => { handleNavClick(item.name); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === item.name ? 'bg-teal-500/10 text-teal-300' : 'text-slate-300 hover:bg-slate-800/50'}`}>
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6 border-t border-slate-700/50">
                {isLoggedIn ? (
                  <ProfileDropdown userProfile={userProfile} onLogout={onLogout} onDashboardClick={onDashboardClick} />
                ) : (
                  <button onClick={onLoginClick} className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-full text-base font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105">
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;