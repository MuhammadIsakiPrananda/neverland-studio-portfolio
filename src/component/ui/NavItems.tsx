
import { motion } from 'framer-motion';
import { navItems } from '../../data/navItems';

interface NavItemsProps {
  activeSection: string;
  handleNavClick: (section: string) => void;
}

const NavItems: React.FC<NavItemsProps> = ({ activeSection, handleNavClick }) => {
  return (
    <div className="hidden lg:flex items-center gap-1 transition-all duration-300">
      {navItems.map((item) => (
        <div
          key={item.name}
          className="relative"
        >
          <button
            onClick={() => handleNavClick(item.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 relative hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${ 
              activeSection === item.name ? 'text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">{item.icon} {item.name}</span>
          </button>
          {activeSection === item.name && (
            <motion.div 
              layoutId="active-pill" 
              className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-full shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-slate-900" 
              style={{ borderRadius: 9999 }} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default NavItems;