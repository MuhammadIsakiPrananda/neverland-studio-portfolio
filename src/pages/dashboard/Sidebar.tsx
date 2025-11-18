import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Settings, ChevronLeft, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Projects', icon: FolderKanban, path: '/dashboard/projects' },
    { name: 'Team', icon: Users, path: '/dashboard/team' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <motion.div
            animate={{ width: isCollapsed ? '5rem' : '16rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative h-screen bg-gray-800/70 backdrop-blur-sm border-r border-gray-700/50 text-slate-300 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-center p-4 h-20 border-b border-gray-700/50">
                <Link to="/">
                    <motion.img 
                        src="/logo.svg" // Pastikan Anda memiliki logo di folder /public
                        alt="Logo" 
                        className="transition-all duration-300"
                        animate={{ width: isCollapsed ? '2rem' : '2.5rem' }}
                    />
                </Link>
                <AnimatePresence>
                {!isCollapsed && (
                    <motion.span 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: 0.1 }} className="text-xl font-bold text-white ml-2 whitespace-nowrap"
                    >
                        Neverland
                    </motion.span>
                )}
                </AnimatePresence>
            </div>

            {/* Nav Items */}
            <nav className="flex-grow p-2">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                                    location.pathname === item.path ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50'
                                }`}
                            >
                                <item.icon className="w-6 h-6 flex-shrink-0" />
                                <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="ml-4 whitespace-nowrap">{item.name}</motion.span>
                                )}
                                </AnimatePresence>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-2 border-t border-gray-700/50">
                 <Link to="/" className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 hover:bg-red-500/20 hover:text-red-400`}>
                    <LogOut className="w-6 h-6 flex-shrink-0" />
                    <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="ml-4 whitespace-nowrap">Keluar</motion.span>
                    )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Collapse Button */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-20 bg-cyan-500 text-white p-1.5 rounded-full focus:outline-none hover:bg-cyan-600 transition-all">
                <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
        </motion.div>
    );
};

export default Sidebar;