import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import NavItems from '../ui/NavItems';
import ProfileDropdown from '../sections/ProfileDropdown';
import { Globe, LogIn } from 'lucide-react';

interface DesktopNavProps {
  isScrolled: boolean;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; avatar: string | null; } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: (section?: string) => void;
  onQuoteClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isScrolled, activeSection, handleNavClick, isLoggedIn, userProfile, onLoginClick, onLogout, onDashboardClick, onQuoteClick }) => {
  return (
    <nav className="hidden md:flex fixed top-4 left-0 right-0 z-50 px-8">
      <motion.div
        className="mx-auto flex items-center gap-8 p-3 rounded-full transition-all duration-300"
        animate={{
          backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.4)',
          borderColor: isScrolled ? 'rgba(34, 211, 238, 0.3)' : 'rgba(51, 65, 85, 0.3)', // Warna cyan saat scroll
          boxShadow: isScrolled ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
        }}
        style={{ borderWidth: '1px' }}
      >
        <a href="#Home" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }}>
          <Logo />
        </a>
        <NavItems activeSection={activeSection} handleNavClick={handleNavClick} />
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 text-slate-300 hover:text-white transition-colors rounded-full">
            <Globe className="w-5 h-5" />
          </button>
          {isLoggedIn ? (
            <>{userProfile && <ProfileDropdown userProfile={userProfile} onLogout={onLogout} onDashboardClick={onDashboardClick} />}</>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500/80 to-cyan-500/80 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-900/30 tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
          <button 
            onClick={onQuoteClick} 
            className="whitespace-nowrap rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-900/50 tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
          >
              Get Started
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default DesktopNav;