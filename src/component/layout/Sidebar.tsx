import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiGrid, FiInfo, FiLogOut, FiChevronsLeft, FiChevronsRight, FiChevronDown, FiUser, FiCreditCard, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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

const Sidebar = ({ isMobileOpen, setMobileOpen }: { isMobileOpen: boolean, setMobileOpen: (isOpen: boolean) => void }) => {
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [isCollapsed, setIsCollapsed] = useState(isTablet);
  const [searchTerm, setSearchTerm] = useState('');
  const { userProfile, isLoggedIn, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Projects', path: '/projects', icon: FiGrid, notification: 5 },
    { name: 'About', path: '/about', icon: FiInfo, notification: true },
    { 
      name: 'Settings', 
      icon: FiSettings,
      subLinks: [
        { name: 'Profile', path: '/settings', icon: FiUser },
        { name: 'Billing', path: '/settings/billing', icon: FiCreditCard, notification: 1 },
      ]
    }
  ];

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
      return null;
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
              value={searchTerm}
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

const NavItem = ({ link, isCollapsed, setMobileOpen, isTablet }: { link: any, isCollapsed: boolean, setMobileOpen: (isOpen: boolean) => void, isTablet: boolean}) => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(pathname.startsWith(link.path) && link.subLinks);

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
            pathname.startsWith(link.path) ? 'text-white' : 'text-slate-300 hover:bg-slate-800'
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
              {link.subLinks.map((subLink: any) => (
                <NavLink
                  key={subLink.name}
                  to={subLink.path}
                  onClick={() => { if (isTablet) setMobileOpen(false); }}
                  className={({ isActive }) => `flex items-center h-10 my-1 px-4 rounded-lg text-sm transition-colors duration-200 ${isActive ? 'bg-cyan-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <subLink.icon className="w-4 h-4 mr-3" />
                  <span className="flex-1">{subLink.name}</span>
                  {subLink.notification && (
                    <NotificationBadge notification={subLink.notification} />
                  )}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={link.path}
      onClick={handleItemClick}
      title={isCollapsed ? link.name : ''}
      className={({ isActive }) =>
        `flex items-center h-12 my-1 rounded-lg transition-colors duration-200 group relative ${
          isActive
            ? 'bg-cyan-600 text-white shadow-lg'
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
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-cyan-600 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
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
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2"
      >
        {notification}
      </motion.div>
    );
  }
  if (notification === true) {
    return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-red-500 rounded-full h-2 w-2 ml-2" />;
  }
  return null;
};

export default Sidebar;