
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { navItems as originalNavItems } from '../../data/navItems'; 
import ProfileDropdown from '../sections/ProfileDropdown';

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; avatar: string | null; } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: (section?: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isMenuOpen, setIsMenuOpen, activeSection, handleNavClick, isLoggedIn, userProfile, onLoginClick, onLogout, onDashboardClick }) => {
  // Menambahkan "Reviews" ke dalam daftar navigasi secara dinamis, sama seperti di desktop nav
  const pricingIndex = originalNavItems.findIndex(item => item.name === 'Pricing');
  const navItems = [...originalNavItems];
  
  // Jika "Pricing" ditemukan, sisipkan "Reviews" setelahnya.
  if (pricingIndex !== -1) {
    navItems.splice(pricingIndex + 1, 0, { name: 'Reviews', href: '/reviews', icon: <></> }); // icon kosong karena tidak ditampilkan di mobile
  }

  const menuContainerVariants: Variants = {
    hidden: { opacity: 0, transition: { when: "afterChildren" } },
    visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
        <a href="#Home" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }} className="z-50 group">
          <Logo />
        </a>
        <div className="flex items-center gap-2">
          {isLoggedIn && userProfile && (
            <div className="z-50">
              <ProfileDropdown userProfile={userProfile} onLogout={onLogout} onDashboardClick={onDashboardClick} />
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white z-50 w-12 h-12 flex items-center justify-center bg-gray-800/50 border border-gray-700/50 rounded-full backdrop-blur-sm"
          >{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-950 to-black z-50 flex flex-col items-center justify-center"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <ul className="flex flex-col items-center gap-4 text-center">
              {navItems.map((item) => (
                <motion.li key={item.name} variants={menuItemVariants}>
                  <button 
                    onClick={() => { handleNavClick(item.name); setIsMenuOpen(false); }} 
                    className={`text-3xl font-bold tracking-wide transition-colors duration-300 px-4 py-2 rounded-lg ${
                      activeSection === item.name ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.div variants={menuItemVariants} className="absolute bottom-12 px-8 w-full">
              {isLoggedIn ? (
                <p className="text-center text-slate-400">Signed in as <span className="font-bold text-white">{userProfile?.name}</span></p>
              ) : (
                <button onClick={onLoginClick} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-full text-lg font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-105">
                  Login / Sign Up
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      
    </>
  );
};

export default MobileNav;