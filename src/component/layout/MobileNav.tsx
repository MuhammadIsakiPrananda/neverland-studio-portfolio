import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import MobileMenu from './MobileMenu';

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  activeSection: string;
  handleNavClick: (section: string) => void;
  onLoginClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isMenuOpen, setIsMenuOpen, activeSection, handleNavClick, onLoginClick }) => {
  const mobileHandleNavClick = (section: string) => {
    handleNavClick(section);
    setIsMenuOpen(false);
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
      <AnimatePresence>{isMenuOpen && <MobileMenu activeSection={activeSection} handleNavClick={mobileHandleNavClick} onLoginClick={onLoginClick} />}</AnimatePresence>
    </>
  );
};

export default MobileNav;