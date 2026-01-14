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
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

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
  // NOTE: This ONLY clears dashboard authentication (dashboard_token, dashboard_user)
  // It does NOT affect web utama authentication (auth_token, user, userProfile)
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
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/dashboard', status: 'online' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
        { id: 'reports', label: 'Reports', icon: FileText, path: '/dashboard/reports' },
      ]
    },
    {
      title: 'Management',
      icon: FolderOpen,
      items: [
        { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
        { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/dashboard/projects' },
        { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck, path: '/dashboard/roles' },
      ]
    },
    {
      title: 'Communication',
      icon: Mail,
      items: [
        {
          id: 'contacts',
          label: 'Contact Messages',
          icon: Mail,
          path: '/dashboard/contacts',
          badge: badgeCounts.contacts > 0 ? badgeCounts.contacts : undefined
        },
        {
          id: 'enrollments',
          label: 'Course Enrollments',
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
      title: 'Business',
      icon: Briefcase,
      items: [
        { id: 'billing', label: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
        { id: 'revenue', label: 'Revenue', icon: Wallet, path: '/dashboard/revenue' },
      ]
    },
    {
      title: 'System',
      icon: Server,
      items: [
        { id: 'activity', label: 'Activity Logs', icon: Activity, path: '/dashboard/activity' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ]
    },
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
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} relative overflow-hidden`}>
      {/* Decorative Background - Match main website */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-slate-50 to-slate-50'}`}></div>
        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]'} bg-[size:24px_24px]`}></div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
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
          ${isDark ? 'bg-slate-900/95' : 'bg-white'} backdrop-blur-xl border-r ${isDark ? 'border-slate-800/50' : 'border-slate-200'} shadow-2xl
          flex flex-col
        `}
      >
        {/* Ultra Modern Sidebar Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            {/* Logo with Glow Effect */}
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg"></div>
              <img
                src={logoImage}
                alt="Neverland Studio"
                className="relative w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-primary/30"
              />
            </div>
            
            {/* Brand Text */}
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Neverland Studio
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Admin Dashboard</p>
            </div>

            {/* Close Button (Mobile) */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modern Search Bar */}
        <div className="p-4">
          <div className="relative group">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-muted-foreground' : 'text-slate-400'} group-focus-within:text-primary transition-colors`} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className={`pl-10 h-10 ${isDark ? 'bg-accent/50 border-accent' : 'bg-slate-100 border-slate-200'} focus:bg-background transition-colors`}
            />
          </div>
        </div>

        {/* Clean Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
          {navSections.map((section) => {
            const SectionIcon = section.icon;
            const filteredItems = section.items.filter(item =>
              searchQuery === '' ||
              item.label.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <SectionIcon className="w-3.5 h-3.5" />
                    <span>{section.title}</span>
                    {/* Badge indicator for Communication section */}
                    {section.title === 'Communication' && (() => {
                      const totalBadge = (badgeCounts.contacts || 0) + (badgeCounts.enrollments || 0) + (badgeCounts.consultations || 0);
                      return totalBadge > 0 ? (
                        <div className="relative">
                          <Badge variant="destructive" className="px-1.5 py-0 text-xs font-bold animate-pulse">
                            {totalBadge}
                          </Badge>
                          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                  {expandedSections.includes(section.title) ? (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 transition-transform" />
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
                          className={`relative group flex items-center gap-2 rounded-lg transition-all duration-200 ${
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }`}
                        >
                          <button
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-3 flex-1 px-3 py-2.5"
                            title={item.label}
                          >
                            <div className="relative flex-shrink-0">
                              <Icon className="w-4.5 h-4.5" />
                              {item.status && (
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${getStatusColor(item.status)} rounded-full border-2 border-card`}></span>
                              )}
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                          </button>

                          {/* Badge for notifications */}
                          {item.badge && item.badge > 0 && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2">
                              <Badge variant="destructive" className="px-2 py-0.5 text-xs font-bold animate-pulse shadow-lg shadow-red-500/50">
                                {item.badge > 99 ? '99+' : item.badge}
                              </Badge>
                            </div>
                          )}

                          {/* Favorite Star */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            className={`absolute right-2 p-1.5 rounded-md transition-all duration-200 ${
                              favorites.includes(item.id)
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-muted-foreground/30 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
                            }`}
                            title={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star className={`w-3.5 h-3.5 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Ultra Modern Sidebar Footer */}
        <div className="p-4 border-t border-border/50 space-y-3">
          {/* Clean User Profile Card */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all group cursor-pointer">
            <div className="relative">
              <Avatar className="h-11 w-11 border-2 border-primary/30 shadow-lg">
                <AvatarImage src={logoImage} alt={currentUser?.name || 'Admin'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-white font-bold text-base">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              {/* Online Status Indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full">
                <span className="absolute inset-0 animate-ping bg-green-500 rounded-full opacity-75"></span>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                {currentUser?.name || 'Admin User'}
              </p>
              <p className="text-xs leading-tight truncate text-muted-foreground font-medium" title={currentUser?.email || 'admin@neverland.com'}>
                {currentUser?.email || 'admin@neverland.com'}
              </p>
            </div>
          </div>

          {/* Clean Logout Button */}
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full justify-start gap-2 h-10 font-semibold hover:scale-[1.02] transition-transform"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </Button>

          {/* Clean Version Info */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/70 font-medium">v1.0.0 • © 2025</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${isMobile ? 'ml-0' : 'ml-72'}
          min-h-screen
          ${isDark ? 'bg-slate-950' : 'bg-slate-50'}
          relative
        `}
      >
        {/* Decorative Background - Similar to main site */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-slate-50 to-slate-50'}`}></div>
          <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]'} bg-[size:24px_24px]`}></div>
        </div>

        {/* Ultra Modern Top Bar */}
        <header className={`h-16 sticky top-0 z-20 flex items-center justify-between px-6 ${isDark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200'} shadow-2xl`}>
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl transition-all lg:hidden hover:bg-accent text-muted-foreground hover:text-foreground hover:scale-110"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Page Title with Breadcrumb Style */}
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1).replace('-', ' ') || 'Dashboard'}
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Welcome back, {currentUser?.name || 'Admin'}
              </p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications with Badge */}
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2.5 rounded-xl transition-all hover:bg-accent hover:scale-105 group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                </div>
              )}
            </button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="rounded-xl hover:scale-105 transition-transform"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </Button>
          </div>
        </header>

        {/* Clean Page Content with proper layering */}
        <div className="relative z-10 p-6 max-w-[1600px] mx-auto">
          <div className="min-h-[calc(100vh-7rem)]">
            {children}
          </div>
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
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: hsl(var(--primary) / 0.5);
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
