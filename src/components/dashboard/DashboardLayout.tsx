import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Theme } from '../../types';
import { dashboardAuth } from '../../services/dashboardAuth';
import { 
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Bell,
  Search,
  Mail,
  MessageSquare,
  BookOpen,
  Calendar,
  Shield,
  CreditCard,
  FileText,
  ChevronDown,
  ChevronRight,
  Star,
  Image,
  Video,
  FileCode,
  Database,
  Server,
  Activity,
  Clock,
  Check,
  Trash2,
  Sparkles,
  Gauge,
  FolderOpen,
  UserCog,
  Briefcase,
  Code,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import notificationService, { type Notification } from '../../services/notificationService';
import realtimeService from '../../services/realtimeService';
import logoImage from '../../assets/Profile Neverland Studio.jpg';

interface DashboardLayoutProps {
  theme: Theme;
  onThemeToggle: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  status?: 'online' | 'offline' | 'warning';
}

interface NavSection {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  theme, 
  onThemeToggle,
  children 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['favorites', 'overview', 'management']);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard_favorites');
    return saved ? JSON.parse(saved) : ['dashboard', 'users', 'analytics'];
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboard_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Sidebar always open on desktop, toggle on mobile
      setSidebarOpen(!mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Get current dashboard user
  const currentUser = dashboardAuth.getCurrentUser();
  
  // Dashboard-specific logout handler
  const handleLogout = () => {
    dashboardAuth.logout();
    navigate('/dashboard');
    window.location.reload(); // Force reload to show login page
  };
  
  // Notification state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Subscribe to notification updates
  useEffect(() => {
    const updateNotifications = () => {
      setUnreadCount(notificationService.getUnreadCount());
      setNotifications(notificationService.getNotifications(10));
    };

    // Initial load
    updateNotifications();

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe(updateNotifications);

    return () => unsubscribe();
  }, []);

  // Dynamic badge counts state
  const [badgeCounts, setBadgeCounts] = useState({
    contacts: 0,
    enrollments: 0,
    consultations: 0
  });

  // Subscribe to real-time badge updates
  useEffect(() => {
    const updateBadges = async () => {
      try {
        const stats = await realtimeService.getRealtimeStats();
        if (stats) {
          setBadgeCounts({
            contacts: stats.contacts?.unread || stats.contacts?.new || 0,
            enrollments: stats.enrollments?.pending || 0,
            consultations: stats.consultations?.pending || 0
          });
        }
      } catch (error) {
        console.error('Failed to update badges:', error);
      }
    };

    // Initial load
    updateBadges();

    // Subscribe to real-time updates
    const unsubscribeStats = realtimeService.subscribe('stats', (data) => {
      if (data) {
        setBadgeCounts({
          contacts: data.contacts?.unread || data.contacts?.new || 0,
          enrollments: data.enrollments?.pending || 0,
          consultations: data.consultations?.pending || 0
        });
      }
    });

    const unsubscribeContacts = realtimeService.subscribe('contacts', updateBadges);
    const unsubscribeEnrollments = realtimeService.subscribe('enrollments', updateBadges);
    const unsubscribeConsultations = realtimeService.subscribe('consultations', updateBadges);

    return () => {
      unsubscribeStats();
      unsubscribeContacts();
      unsubscribeEnrollments();
      unsubscribeConsultations();
    };
  }, []);

  const navSections: NavSection[] = [
    {
      title: 'Favorites',
      icon: Star,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
      ].filter(item => favorites.includes(item.id))
    },
    {
      title: 'Overview',
      icon: Gauge,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', status: 'online' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
        { id: 'activity', label: 'Activity Log', icon: Activity, path: '/dashboard/activity' },
      ]
    },
    {
      title: 'Content Management',
      icon: FolderOpen,
      items: [
        { 
          id: 'contacts', 
          label: 'Contacts', 
          icon: Mail, 
          path: '/dashboard/contacts', 
          badge: badgeCounts.contacts > 0 ? badgeCounts.contacts : undefined 
        },
        { 
          id: 'enrollments', 
          label: 'Enrollments', 
          icon: BookOpen, 
          path: '/dashboard/enrollments', 
          badge: badgeCounts.enrollments > 0 ? badgeCounts.enrollments : undefined 
        },
        { 
          id: 'consultations', 
          label: 'Consultations', 
          icon: Calendar, 
          path: '/dashboard/consultations', 
          badge: badgeCounts.consultations > 0 ? badgeCounts.consultations : undefined 
        },
        { id: 'newsletter', label: 'Newsletter', icon: MessageSquare, path: '/dashboard/newsletter' },
      ]
    },
    {
      title: 'User Management',
      icon: UserCog,
      items: [
        { id: 'users', label: 'All Users', icon: Users, path: '/dashboard/users' },
        { id: 'roles', label: 'Roles & Permissions', icon: Shield, path: '/dashboard/roles' },
      ]
    },
    {
      title: 'Projects & Portfolio',
      icon: Briefcase,
      items: [
        { id: 'projects', label: 'All Projects', icon: FolderKanban, path: '/dashboard/projects' },
        { id: 'media', label: 'Media Library', icon: Image, path: '/dashboard/media' },
        { id: 'videos', label: 'Video Content', icon: Video, path: '/dashboard/videos' },
      ]
    },
    {
      title: 'Business',
      icon: Wallet,
      items: [
        { id: 'billing', label: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
        { id: 'reports', label: 'Reports', icon: FileText, path: '/dashboard/reports' },
        { id: 'revenue', label: 'Revenue', icon: BarChart3, path: '/dashboard/revenue' },
      ]
    },
    {
      title: 'System',
      icon: ShieldCheck,
      items: [
        { id: 'security', label: 'Security', icon: Shield, path: '/dashboard/security', status: 'warning' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ]
    }
  ];

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 w-72
          ${isMobile 
            ? `${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
            : ''
          }
          ${isDark ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-slate-200'}
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center justify-between px-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="Neverland Studio Logo" 
              className="w-10 h-10 rounded-lg object-cover shadow-lg"
            />
            <div>
              <h1 className="font-bold text-sm bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Neverland Studio
              </h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Admin Dashboard</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className={`relative ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className={`
                w-full pl-10 pr-3 py-2 text-sm rounded-lg
                bg-transparent outline-none
                ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
              `}
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
          {navSections.map((section) => {
            const SectionIcon = section.icon;
            const filteredItems = section.items.filter(item => 
              searchQuery === '' || 
              item.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredItems.length === 0) return null;
            
            return (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 mb-1
                  text-xs font-semibold uppercase tracking-wider
                  ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}
                  transition-colors group
                `}
              >
                <div className="flex items-center gap-2">
                  <SectionIcon className={`w-4 h-4 ${isDark ? 'text-slate-600 group-hover:text-slate-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
                  <span>{section.title}</span>
                  {/* Show total badge count for Content Management section */}
                  {section.title === 'Content Management' && (
                    (() => {
                      const totalBadge = (badgeCounts.contacts || 0) + (badgeCounts.enrollments || 0) + (badgeCounts.consultations || 0);
                      return totalBadge > 0 ? (
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-bold
                          bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-400 border border-red-500/40
                          animate-pulse
                        `}>
                          {totalBadge}
                        </span>
                      ) : null;
                    })()
                  )}
                </div>
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
              
              {expandedSections.includes(section.title) && (
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <div
                        key={item.id}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group
                          ${active
                            ? isDark
                              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                              : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200 shadow-sm'
                            : isDark
                              ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }
                        `}
                      >
                        <button
                          onClick={() => navigate(item.path)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                          title={item.label}
                        >
                          <div className="relative">
                            <Icon className="w-5 h-5 flex-shrink-0" />
                          {item.status && (
                            <span className={`absolute -bottom-1 -right-1 w-2 h-2 ${getStatusColor(item.status)} rounded-full border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}></span>
                          )}
                        </div>
                        <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <span className={`
                            relative px-2 py-0.5 rounded-full text-xs font-bold
                            ${active
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                              : isDark
                                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
                                : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border border-red-200'
                            }
                            animate-pulse
                          `}>
                            {/* Ping animation for new items */}
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                                active ? 'bg-blue-400' : 'bg-red-400'
                              } opacity-75`}></span>
                              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                                active ? 'bg-blue-500' : 'bg-red-500'
                              }`}></span>
                            </span>
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`
                          p-1 rounded-md transition-all duration-200 flex-shrink-0
                          ${favorites.includes(item.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : isDark
                              ? 'text-slate-600 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
                              : 'text-slate-300 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
                          }
                        `}
                        title={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          );})}
        </nav>

        {/* Sidebar Footer - Logout Only */}
        <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} space-y-2`}>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${isDark 
                ? 'hover:bg-red-500/20 text-red-400 border border-red-400/30' 
                : 'hover:bg-red-50 text-red-600 border border-red-200'}
            `}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          
          {/* Version info */}
          <div className={`text-center pt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            <p className="text-xs">Version 1.0.0</p>
            <p className="text-[10px] mt-0.5">© 2025 Neverland Studio</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${isMobile ? 'ml-0' : 'ml-72'}
          min-h-screen
        `}
      >
        {/* Top Bar */}
        <header className={`
          h-16 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6
          ${isDark 
            ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-800' 
            : 'bg-white/80 backdrop-blur-lg border-b border-slate-200'}
        `}>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors lg:hidden ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <h2 className={`text-lg sm:text-xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1) || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Button */}
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`p-2 rounded-lg transition-colors relative ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
            >
              <Bell className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* User Profile */}
            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 p-0.5">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-sm">
                      {currentUser?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div className="hidden sm:block">
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentUser?.email || 'admin@neverland.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(100, 116, 139, 0.4)' : 'rgba(148, 163, 184, 0.4)'};
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(100, 116, 139, 0.6)' : 'rgba(148, 163, 184, 0.6)'};
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: ${isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
        }
        
        /* Smooth scrolling */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
