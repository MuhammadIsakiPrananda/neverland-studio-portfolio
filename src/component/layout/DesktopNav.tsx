
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import NavItems from '../ui/NavItems';
import ProfileDropdown from '../sections/ProfileDropdown';

interface DesktopNavProps {
  isScrolled: boolean;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; avatar: string | null; };
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isScrolled, activeSection, handleNavClick, isLoggedIn, userProfile, onLoginClick, onLogout, onDashboardClick }) => {
  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <motion.div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}
        animate={{ y: 0 }}
        initial={{ y: -100 }}
      >
        <div className={`flex items-center justify-between bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl transition-all duration-300 ${isScrolled ? 'px-4 py-2' : 'px-6 py-3'}`}>
          <a href="#Home" onClick={() => handleNavClick('Home')} className="pl-2">
            <Logo />
          </a>
          <NavItems activeSection={activeSection} handleNavClick={handleNavClick} />
          <div className="pr-2">
            {isLoggedIn ? (
              <ProfileDropdown userProfile={userProfile} onLogout={onLogout} onDashboardClick={onDashboardClick} />
            ) : (
              <button onClick={onLoginClick} className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105">Login</button>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default DesktopNav;