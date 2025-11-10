
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import NavItems from '../ui/NavItems';
import ActionButtons from './ActionButtons';

interface DesktopNavProps {
  isScrolled: boolean;
  activeSection: string;
  handleNavClick: (section: string) => void;
  onLoginClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isScrolled, activeSection, handleNavClick, onLoginClick }) => {
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
        <ActionButtons onLoginClick={onLoginClick} onGetStartedClick={() => handleNavClick('Contact')} />
      </motion.div>
    </nav>
  );
};

export default DesktopNav;