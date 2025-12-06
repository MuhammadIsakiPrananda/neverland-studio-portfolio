import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome, FiSettings, FiChevronDown,
  FiUser, FiSearch, FiBarChart2, FiInbox, FiMessageSquare, FiUsers,
  FiBriefcase, FiCreditCard, FiLayout, FiPlusCircle, FiCalendar,
  FiCheckSquare, FiImage, FiHelpCircle, FiLogOut, FiX
} from 'react-icons/fi';
import { useAuth } from '@/features/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface NavItemType {
  name: string;
  icon: React.ElementType;
  path?: string;
  badge?: number | boolean;
  children?: NavItemType[];
}

interface SidebarContextType {
  isTablet: boolean;
  closeMobile: () => void;
}

// Context
const SidebarContext = createContext<SidebarContextType | null>(null);
const useSidebar = () => useContext(SidebarContext)!;

// Hooks
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

// Navigation Data
const navigation: NavItemType[] = [
  { name: 'Overview', path: '/dashboard', icon: FiHome },
  { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
  { name: 'Calendar', path: '/dashboard/calendar', icon: FiCalendar },
  {
    name: 'Inbox', icon: FiInbox, badge: 8,
    children: [
      { name: 'Reviews', path: '/dashboard/inbox/reviews', icon: FiMessageSquare, badge: 3 },
      { name: 'Applicants', path: '/dashboard/inbox/applicants', icon: FiUsers, badge: 5 },
      { name: 'Collaborations', path: '/dashboard/inbox/collaborations', icon: FiBriefcase },
    ]
  },
  {
    name: 'Portfolios', icon: FiLayout,
    children: [
      { name: 'All Portfolios', path: '/dashboard/portfolios', icon: FiLayout },
      { name: 'Create New', path: '/dashboard/portfolios/new', icon: FiPlusCircle },
    ]
  },
  { name: 'Tasks', path: '/dashboard/tasks', icon: FiCheckSquare, badge: 4 },
  { name: 'Clients', path: '/dashboard/clients', icon: FiUsers },
  { name: 'Media', path: '/dashboard/media', icon: FiImage },
  { name: 'divider', icon: () => null }, // Divider
  {
    name: 'Settings', icon: FiSettings,
    children: [
      { name: 'Profile', path: '/dashboard/settings', icon: FiUser },
      { name: 'Billing', path: '/dashboard/settings/billing', icon: FiCreditCard },
      { name: 'Website', path: '/dashboard/settings/website', icon: FiSettings },
    ]
  },
  { name: 'Support', path: '/dashboard/support', icon: FiHelpCircle },
  { name: 'divider', icon: () => null }, // Divider
];

// Animation Variants
const sidebarVariants = {
  // Sidebar is always expanded on desktop
  open: { width: 280 },
};

const mobileVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -300, opacity: 0 },
};

// Components
const Badge = ({ value }: { value: number | boolean }) => {
  if (value === true) {
    return <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />;
  }
  if (typeof value === 'number' && value > 0) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-semibold bg-violet-500/20 text-violet-300 rounded-full">
        {value > 99 ? '99+' : value}
      </span>
    );
  }
  return null;
};

const Tooltip = ({ children, label }: { children: React.ReactNode; label: string }) => {
  const { isTablet } = useSidebar();
  if (isTablet) return <>{children}</>; // Disable tooltips on touch devices
  
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-700">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
      </div>
    </div>
  );
};

const NavItem = ({ item, depth = 0 }: { item: NavItemType; depth?: number }) => {
  // Handle divider
  if (item.name === 'divider') {
    return <hr className="my-2 border-gray-700/50" />;
  }

  const location = useLocation();
  const { closeMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);  
  
  const isChildActive = item.children?.some(c => c.path && location.pathname.startsWith(c.path));
  const hasChildren = !!item.children?.length;
  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      closeMobile();
    }
  };

  const baseClasses = `
    relative flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
    transition-all duration-200 group
    ${depth > 0 ? 'ml-3' : ''}
  `;

  const content = (isActive: boolean) => (
    <>
      {isActive && !hasChildren && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 rounded-xl"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      <item.icon className={`relative w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
      <AnimatePresence mode="wait">
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className={`relative flex-1 font-medium text-sm truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}
        >
          {item.name}
        </motion.span>
      </AnimatePresence>
      {item.badge && <Badge value={item.badge} />}
      {hasChildren && (
        <FiChevronDown className={`relative w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </>
  );

  // Parent with children
  if (hasChildren) {
    return (
      <div className="relative">
        <Tooltip label={item.name}>
          <div
            onClick={handleClick}
            className={`${baseClasses} ${isChildActive ? 'bg-white/5 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            {content(isChildActive || false)}
          </div>
        </Tooltip>

        {/* Expanded dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-1 pl-4 border-l border-gray-700/50"
            >
              {item.children!.map(child => (
                <NavItem key={child.name} item={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Regular link
  return (
    <Tooltip label={item.name}>
      <NavLink
        to={item.path || '#'}
        end={item.path === '/dashboard'}
        onClick={handleClick}
        className={({ isActive }) => `${baseClasses} ${isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5'}`}
      >
        {({ isActive }) => content(isActive)}
      </NavLink>
    </Tooltip>
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="px-4 mb-2">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white/5 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
        />
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { userProfile, logout } = useAuth();
  if (!userProfile) return null;

  return (
    <div className="p-4 border-t border-gray-700/50">
      <div className="flex items-center gap-3">
        <img
          src={userProfile.image || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`}
          alt=""
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500/30"
        />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 min-w-0"
          >
            <p className="font-semibold text-sm text-white truncate">{userProfile.name}</p>
            <p className="text-xs text-slate-400 truncate">@{userProfile.username}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <Tooltip label="Logout">
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </Tooltip>
    </div>
  );
};

// Main Sidebar Component
const Sidebar = ({ isMobileOpen, setMobileOpen }: { isMobileOpen: boolean; setMobileOpen: (v: boolean) => void }) => {
  const isTablet = useMediaQuery('(max-width: 1024px)');  
  const { isLoggedIn } = useAuth();

  const contextValue = useMemo(() => ({
    isTablet,
    closeMobile: () => isTablet && setMobileOpen(false),
  }), [isTablet, setMobileOpen]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isTablet && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={isTablet ? mobileVariants : sidebarVariants}
        initial={false}
        animate={isTablet ? (isMobileOpen ? 'open' : 'closed') : 'open'}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className={`
          bg-gray-900/80 backdrop-blur-2xl border-r border-gray-700/50 flex flex-col z-50 custom-scrollbar
          ${isTablet ? 'fixed inset-y-0 left-0 w-[280px]' 
                     : 'sticky top-0 h-screen'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-10 h-10 flex-shrink-0 cursor-pointer"
            >
              <img
                src="/images/Neverland Studio.webp"
                alt="Neverland Studio Logo"
                className="w-full h-full object-cover rounded-xl shadow-lg shadow-violet-500/25"
              />
            </motion.div>
            <AnimatePresence>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
              >
                Neverland
              </motion.span>
            </AnimatePresence>
          </div>
          
          {isTablet && (
            <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="py-4 border-b border-gray-700/50"><SearchBar /></div>

        {/* Navigation */}
        <nav className="flex-grow px-2 py-4 space-y-1">
          {navigation.map(item => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* User Profile */}
        {isLoggedIn && <UserProfile />}
      </motion.aside>
    </SidebarContext.Provider>
  );
};

export default Sidebar;