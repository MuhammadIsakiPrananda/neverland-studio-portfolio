import { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiGrid, FiChevronsLeft, FiChevronsRight, FiChevronDown, FiUser, FiSearch, FiBarChart2, FiInbox, FiMessageSquare, FiUsers, FiBriefcase, FiCreditCard, FiLayout, FiPlusCircle, FiCalendar, FiCheckSquare, FiImage, FiHelpCircle, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Define strong types for navigation links
type NavLinkType = {
  name: string;
  icon: React.ElementType;
  path?: string;
  notification?: number | boolean;
  subLinks?: NavLinkType[];
};

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
  { name: 'Calendar', path: '/dashboard/calendar', icon: FiCalendar },
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
  {
    name: 'Portfolios',
    icon: FiGrid,
    subLinks: [
      { name: 'All Portfolios', path: '/dashboard/portfolios', icon: FiLayout },
      { name: 'Add New', path: '/dashboard/portfolios/new', icon: FiPlusCircle },
    ]
  },
  { name: 'Tasks', path: '/dashboard/tasks', icon: FiCheckSquare, notification: 4 },
  { name: 'Clients', path: '/dashboard/clients', icon: FiUsers },
  { name: 'Media', path: '/dashboard/media', icon: FiImage },
  { 
    name: 'Settings',
    icon: FiSettings,
    subLinks: [
      { name: 'Profile', path: '/dashboard/settings', icon: FiUser },
      { name: 'Billing', path: '/dashboard/settings/billing', icon: FiCreditCard },
      {
        path: '#', // Add a placeholder path
        name: 'Website',
        icon: FiSettings,
        subLinks: [
          { name: 'General', path: '/dashboard/settings/website/general', icon: FiSettings },
        ]
      }
    ]
  },
  {
    name: 'Support',
    icon: FiHelpCircle,
    path: '/dashboard/support'
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

  // Collapse sidebar automatically on tablet, but allow manual override
  useEffect(() => {
    setIsCollapsed(isTablet);
  }, [isTablet]);

  const finalSidebarVariants = isTablet ? mobileSidebarVariants : sidebarVariants;

  const filteredNavLinks = useMemo(() => {
    if (!searchTerm) return navLinks;

    const filterLinks = (links: NavLinkType[]): NavLinkType[] => {
      return links.map(link => {
        if (link.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return link; // Keep parent if it matches
        }
        if (link.subLinks) {
          const filteredSubs = filterLinks(link.subLinks);
          if (filteredSubs.length > 0) return { ...link, subLinks: filteredSubs };
        }
        return null;
      }).filter((link): link is NavLinkType => link !== null);
    };
    return filterLinks(navLinks);
  }, [searchTerm]);

  return (
    <motion.div
      initial={false}
      variants={finalSidebarVariants}
      animate={isTablet ? (isMobileOpen ? 'open' : 'closed') : (isCollapsed ? 'collapsed' : 'expanded')}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-gray-900 text-white flex flex-col h-screen z-20 ${isTablet ? 'fixed' : 'sticky'} top-0`}
    >
      {/* Overlay for mobile view */}
      {isTablet && isMobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-10" />}
      
      {/* Header with Logo and Toggle Button */}
      <div className={`flex items-center p-4 h-20 border-b border-gray-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="bg-violet-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.79-2.731 9.172-.64.84-1.775 1.242-2.85 1.015A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 .155-.006.308-.017.46a9.964 9.964 0 01-2.91 6.56c-1.09.863-2.52 1.03-3.728.463A9.945 9.945 0 0112 11z" /></svg>
            </div>
            <AnimatePresence>
            {!isCollapsed && (
                <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-white whitespace-nowrap"
                >
                Neverland
                </motion.span>
            )}
            </AnimatePresence>
        </div>
        {!isTablet && (
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          {isCollapsed ? <FiChevronsRight className="w-6 h-6" /> : <FiChevronsLeft className="w-6 h-6" />}
        </button>
        )}
      </div>

      {/* Search Bar */}
      <div className={`p-4 ${isCollapsed ? 'px-3' : ''}`}>
        <div className="relative">
          <FiSearch className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isCollapsed ? 'left-3' : 'left-3'}`} />
          {!isCollapsed && (
            <input 
              type="text" 
              placeholder="Search..."
              value={isCollapsed ? '' : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          )}
        </div>
      </div>

      {/* Main navigation area */}
      <div className="flex-grow overflow-y-auto border-r border-gray-800">
        <nav className="p-4 pt-0">
          {filteredNavLinks.map(link => link && <NavItem key={link.name} link={link} isCollapsed={isCollapsed} setMobileOpen={setMobileOpen} isTablet={isTablet} />)}
        </nav>
      </div>

      {/* User Profile Footer */}
      {isLoggedIn && userProfile && (
        <div className={`p-4 border-t border-gray-800 space-y-4 ${isCollapsed ? '' : 'border-r border-gray-800'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <img
              src={userProfile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-600"
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
          <button onClick={logout} className={`w-full flex items-center py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <FiExternalLink className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium ml-3">Back to Main</span>}
          </button>
        </div>
      )}
    </motion.div>
  );
};

const NavItem = ({ link, isCollapsed, setMobileOpen, isTablet }: { link: NavLinkType, isCollapsed: boolean, setMobileOpen: (isOpen: boolean) => void, isTablet: boolean}) => {
  const location = useLocation();
  const isParentActive = link.subLinks ? link.subLinks.some(sub => sub.path && location.pathname.startsWith(sub.path)) : false;
  const [isOpen, setIsOpen] = useState(isParentActive);

  const handleItemClick = () => {
    if (link.subLinks) {
      setIsOpen(!isOpen);
    } else {
      if (isTablet) setMobileOpen(false);
    }
  };

  // Sync dropdown state with routing
  useEffect(() => {
    setIsOpen(isParentActive);
  }, [isParentActive]);


  if (link.subLinks) {
    return (
      <div className="my-1">
        <div
          onClick={handleItemClick}
          className={`flex items-center h-12 px-4 rounded-lg transition-colors duration-200 group relative cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white ${
            isParentActive ? 'text-white bg-gray-800' : ''
          } ${isCollapsed ? 'justify-center' : 'pr-2'}`}
        >
          <link.icon className="w-6 h-6" />
          {!isCollapsed && ( // Wrapper to prevent text wrapping during collapse animation
            <span className="font-medium ml-3 whitespace-nowrap flex-1">{link.name}</span>
          )}
          {!isCollapsed && link.notification && (
            <NotificationBadge notification={link.notification} />
          )}
          {!isCollapsed && <FiChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
          {isCollapsed && (
            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-violet-600 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
              {link.name}
            </div>
          )}
        </div>
        <AnimatePresence>
          {isOpen && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden ml-6 pl-2 border-l-2 border-gray-700"
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

  const commonProps = {
    onClick: handleItemClick,
    title: isCollapsed ? link.name : '',
  };

  return (
    <NavLink
      to={link.path || '#'}
      // Use `end` prop for the overview link to prevent it from matching all other dashboard routes
      end={link.path === '/dashboard'}
      {...commonProps}
      className={({ isActive }) =>
        `flex items-center h-12 my-1 rounded-lg transition-colors duration-200 group relative text-gray-400 hover:bg-gray-800 hover:text-white ${
          isActive ? 'bg-gray-800 text-white' : ''
        } ${isCollapsed ? 'justify-center' : 'px-4' }`
      }
    >
      {({ isActive }) => <Content link={link} isCollapsed={isCollapsed} isActive={isActive} />}
    </NavLink>
  );
};

const Content = ({ link, isCollapsed, isActive }: { link: NavLinkType, isCollapsed: boolean, isActive: boolean }) => (
  <> 
    {isActive && !isCollapsed && (
      <motion.div layoutId="active-indicator" className="absolute left-0 h-6 w-1 bg-violet-500 rounded-r-full" />
    )}
    <link.icon className="w-6 h-6" />
    <AnimatePresence>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="font-medium ml-3 whitespace-nowrap flex-1 overflow-hidden"
        >
          {link.name}
        </motion.span>
      )}
    </AnimatePresence>
    {!isCollapsed && link.notification && (
      <NotificationBadge notification={link.notification} />
    )}
    {isCollapsed && (
      <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-violet-600 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
        {link.name}
      </div>
    )}
  </>
);

const NotificationBadge = ({ notification }: { notification: number | boolean }) => {
  if (typeof notification === 'number' && notification > 0) {
    return (
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="bg-violet-500 text-white text-xs font-bold rounded-full h-5 min-w-[1.25rem] flex items-center justify-center ml-auto px-1"
      >
        {notification}
      </motion.div>
    );
  }
  if (notification === true) {
    return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-violet-500 rounded-full h-2 w-2 ml-auto" />;
  }
  return null;
};

export default Sidebar;