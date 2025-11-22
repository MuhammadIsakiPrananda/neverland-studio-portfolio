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
  onDashboardClick: () => void;
  onQuoteClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isScrolled, activeSection, handleNavClick, isLoggedIn, userProfile, onLoginClick, onLogout, onDashboardClick, onQuoteClick }) => {
  return (
    <nav className="hidden md:flex fixed top-4 left-0 right-0 z-50 px-6">
      <motion.div
        className="max-w-7xl mx-auto w-full flex justify-between items-center p-2 rounded-full transition-all duration-300"
        animate={{
          backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.5)',
          borderColor: isScrolled ? 'rgba(51, 65, 85, 0.5)' : 'rgba(51, 65, 85, 0.2)',
        }}
        style={{
          boxShadow: isScrolled ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
          borderWidth: '1px',
          border: '1px solid',
        }}
      >
        <a href="#Home" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }} className="pl-2">
          <Logo />
        </a>
        <NavItems activeSection={activeSection} handleNavClick={handleNavClick} />
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-10 h-10 text-slate-300 hover:text-white transition-colors rounded-full">
            <Globe className="w-5 h-5" />
          </button>
          {isLoggedIn ? (
            <div className="pr-1">{userProfile && <ProfileDropdown userProfile={userProfile} onLogout={onLogout} onDashboardClick={onDashboardClick} />}</div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="btn-shine bg-gradient-to-r from-teal-500/80 to-cyan-500/80 text-white px-4 py-2 rounded-full shadow-md shadow-cyan-900/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-sm font-semibold transform hover:-translate-y-0.5 tracking-wide flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
          <button onClick={onQuoteClick} className="btn-shine bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full shadow-md shadow-cyan-900/50 hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm font-semibold transform hover:-translate-y-0.5 tracking-wide ml-2">
              Get Started
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default DesktopNav;