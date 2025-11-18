import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiGrid, FiLogOut, FiChevronsLeft, FiChevronsRight, FiChevronDown, FiUser, FiSearch, FiBarChart2, FiInbox, FiMessageSquare, FiUsers, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

// Define strong types for navigation links
type SubLink = {
  name: string;
  path: string;
  icon: React.ElementType;
  notification?: number | boolean;
  subLinks?: SubLink[]; // For multi-level submenus
};

type NavLinkType = {
  name: string;
  icon: React.ElementType;
} & ({ path: string; subLinks?: never; notification?: number | boolean } | { path?: never; subLinks: SubLink[]; notification?: number | boolean });

// Custom hook to check screen width
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Define navLinks outside the component to prevent re-creation on re-renders
const navLinks: NavLinkType[] = [
  { name: 'Overview', path: '/dashboard', icon: FiHome, notification: true },
  { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
  { 
    name: 'Inbox', 
    icon: FiInbox,
    notification: 8,
    subLinks: [
      { name: 'Reviews', path: '/dashboard/inbox/reviews', icon: FiMessageSquare, notification: 3 },
      { name: 'Applicants', path: '/dashboard/inbox/applicants', icon: FiUsers, notification: 5 },
      { name: 'Collaborations', path: '/dashboard/inbox/collaborations', icon: FiBriefcase },
    ]
  },
  { name: 'Projects', path: '/dashboard/projects', icon: FiGrid },
  { name: 'Team', path: '/dashboard/team', icon: FiUsers },
  { 
    name: 'Settings',
    icon: FiSettings,
    subLinks: [
      { name: 'Profile', path: '/dashboard/settings', icon: FiUser },
      {
        name: 'Website',
        icon: FiSettings,
        subLinks: [
          { name: 'General', path: '/dashboard/settings/website/general', icon: FiSettings },
        ]
      }
    ]
  },
];

const Sidebar = ({ isMobileOpen, setMobileOpen }: { isMobileOpen: boolean, setMobileOpen: (isOpen: boolean) => void }) => {
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [isCollapsed, setIsCollapsed] = useState(isTablet);
  const [searchTerm, setSearchTerm] = useState('');
  const { userProfile, isLoggedIn, logout } = useAuth();

 const sidebarVariants = {
    expanded: { width: '16rem' }, // 256px
    collapsed: { width: '5rem' } // 80px
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

 const { settings, toggleTheme, setLanguage, setNotificationsEnabled } = useSettings();
  // Collapse sidebar automatically on tablet, but allow manual override
  useEffect(() => {
    setIsCollapsed(isTablet);
  }, [isTablet]);

  const finalSidebarVariants = isTablet ? mobileSidebarVariants : sidebarVariants;

  const filteredNavLinks = useMemo(() => {
    if (!searchTerm) return navLinks;

    return navLinks.map(link => {
      // If the parent link matches, include it and all its sublinks
      if (link.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return link;
      }
      // If sublinks exist, filter them
      if (link.subLinks) {
        const filteredSubLinks = link.subLinks.filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filteredSubLinks.length > 0) return { ...link, subLinks: filteredSubLinks };
      }
      return null; // Using filter(Boolean) will remove null entries
    }).filter(Boolean);
  }, [searchTerm, navLinks]);

  return (
    <motion.aside
      initial={false}
      variants={finalSidebarVariants}
      animate={isTablet ? (isMobileOpen ? 'open' : 'closed') : (isCollapsed ? 'collapsed' : 'expanded')}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-slate-900 text-white flex flex-col h-screen z-20 ${isTablet ? 'fixed' : 'sticky'} top-0`}
    >
      {isTablet && isMobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-10" />}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 h-20 border-b border-slate-800`}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-white whitespace-nowrap"
            >
              Neverland
            </motion.span>
          )}
        </AnimatePresence>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
          {isCollapsed ? <FiChevronsRight className="w-6 h-6" /> : <FiChevronsLeft className="w-6 h-6" />}
        </button>
      </div>

      <div className={`p-4 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="relative">
          <FiSearch className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'left-3'}`} />
          {!isCollapsed && (
            <input 
              type="text" 
              placeholder="Search..."
              value={isCollapsed ? '' : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          )}
        </div>
      </div>

      <nav className="flex-grow p-4 pt-0 overflow-y-auto">
        {filteredNavLinks.map(link => link && <NavItem key={link.name} link={link} isCollapsed={isCollapsed} setMobileOpen={setMobileOpen} isTablet={isTablet} />)}
      </nav>

      {isLoggedIn && userProfile && (
        <div className="p-4 mt-auto border-t border-slate-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <img
              src={userProfile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="ml-3 overflow-hidden">
                  <p className="font-semibold text-sm text-white truncate">{userProfile.name}</p>
                  <p className="text-xs text-slate-400 truncate">@{userProfile.username}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={logout} className={`w-full flex items-center mt-4 py-2.5 rounded-lg text-slate-300 hover:bg-red-900/50 hover:text-red-400 transition-colors duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
            <FiLogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium ml-3">Logout</span>}
          </button>
        </div>
      )}
    </motion.aside>
  );
};

const NavItem = ({ link, isCollapsed, setMobileOpen, isTablet }: { link: NavLinkType, isCollapsed: boolean, setMobileOpen: (isOpen: boolean) => void, isTablet: boolean}) => {
  const { pathname } = useLocation();
  // For parent links, check if the current path starts with the parent's logical group.
  // For sublinks, check if any sublink path is active.
  const isParentActive = link.subLinks ? link.subLinks.some(sub => pathname.startsWith(sub.path)) : false;
  const [isOpen, setIsOpen] = useState(isParentActive);

  const handleItemClick = () => {
    if (link.subLinks) {
      setIsOpen(!isOpen);
    } else {
      if (isTablet) setMobileOpen(false);
    }
  };

  if (link.subLinks) {
    return (
      <div className="my-1">
        <div
          onClick={handleItemClick}
          className={`flex items-center h-12 px-4 rounded-lg transition-colors duration-200 group relative cursor-pointer ${
            isParentActive ? 'text-white bg-slate-800/50' : 'text-slate-300 hover:bg-slate-800'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <link.icon className="w-6 h-6" />
          {!isCollapsed && (
            <span className="font-medium ml-3 whitespace-nowrap flex-1">{link.name}</span>
          )}
          {!isCollapsed && link.notification && (
            <NotificationBadge notification={link.notification} />
          )}
          {!isCollapsed && <FiChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
        </div>
        <AnimatePresence>
          {isOpen && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden ml-4 pl-4 border-l border-slate-700"
            >
              {link.subLinks.map((subLink) => (
                <NavItem key={subLink.name} link={subLink} isCollapsed={isCollapsed} setMobileOpen={setMobileOpen} isTablet={isTablet} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={link.path!} // Non-null assertion: we know path exists if subLinks doesn't
      // Use `end` prop for the overview link to prevent it from matching all other dashboard routes
      end={link.path === '/dashboard'}
      onClick={handleItemClick}
      title={isCollapsed ? link.name : ''}
      className={({ isActive }) =>
        `flex items-center h-12 my-1 rounded-lg transition-colors duration-200 group relative ${
          isActive // Updated style for active link
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
            : 'text-slate-300 hover:bg-slate-800'
        } ${isCollapsed ? 'justify-center' : 'px-4' }`
      }
    >
      <link.icon className="w-6 h-6" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="font-medium ml-3 whitespace-nowrap flex-1"
          >
            {link.name}
          </motion.span>
        )}
      </AnimatePresence>
      {!isCollapsed && link.notification && (
        <NotificationBadge notification={link.notification} />
      )}
      {isCollapsed && !link.subLinks && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-violet-600 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {link.name}
        </div>
      )}
    </NavLink>
  );
};

const NotificationBadge = ({ notification }: { notification: number | boolean }) => {
  if (typeof notification === 'number' && notification > 0) {
    return (
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} // Updated style for notification badge
        className="bg-violet-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2"
      >
        {notification}
      </motion.div>
    );
  }
  if (notification === true) {
    return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-violet-500 rounded-full h-2 w-2 ml-2" />;
  }
  return null;
};

export default Sidebar;