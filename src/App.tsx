import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LiveChat from './components/common/LiveChat';

// Eager load - Critical pages untuk initial load
import HomePage from './components/pages/HomePage';
import DashboardLogin from './components/auth/DashboardLogin';

// Lazy load - Secondary pages untuk code splitting
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const TeamPage = lazy(() => import('./components/pages/TeamPage'));
const SkillsPage = lazy(() => import('./components/pages/SkillsPage'));
const AwardsPage = lazy(() => import('./components/pages/AwardsPage'));
const ServicesPage = lazy(() => import('./components/pages/ServicesPage'));
const ITLearningPage = lazy(() => import('./components/pages/ITLearningPage'));
const ITSolutionsPage = lazy(() => import('./components/pages/ITSolutionsPage'));
const ITConsultingPage = lazy(() => import('./components/pages/ITConsultingPage'));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage'));
const PricingPage = lazy(() => import('./components/pages/PricingPage'));
const TestimonialsPage = lazy(() => import('./components/pages/TestimonialsPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const MaintenancePage = lazy(() => import('./components/pages/MaintenancePage'));

// Dashboard - Lazy load karena jarang digunakan
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./components/dashboard/DashboardHome'));
const DashboardUsers = lazy(() => import('./components/dashboard/DashboardUsers'));
const DashboardProjects = lazy(() => import('./components/dashboard/DashboardProjects'));
const DashboardAnalytics = lazy(() => import('./components/dashboard/DashboardAnalytics'));
const DashboardContacts = lazy(() => import('./components/dashboard/DashboardContacts'));
const DashboardEnrollments = lazy(() => import('./components/dashboard/DashboardEnrollments'));
const DashboardConsultations = lazy(() => import('./components/dashboard/DashboardConsultations'));
const DashboardActivity = lazy(() => import('./components/dashboard/DashboardActivity'));
const DashboardNewsletter = lazy(() => import('./components/dashboard/DashboardNewsletter'));
const DashboardRoles = lazy(() => import('./components/dashboard/DashboardRoles'));
const DashboardMedia = lazy(() => import('./components/dashboard/DashboardMedia'));
const DashboardVideos = lazy(() => import('./components/dashboard/DashboardVideos'));
const DashboardBilling = lazy(() => import('./components/dashboard/DashboardBilling'));
const DashboardReports = lazy(() => import('./components/dashboard/DashboardReports'));
const DashboardRevenue = lazy(() => import('./components/dashboard/DashboardRevenue'));
const DashboardSecurity = lazy(() => import('./components/dashboard/DashboardSecurity'));
const Settings = lazy(() => import('./components/dashboard/Settings'));

// Auth pages
const OAuthCallback = lazy(() => import('./components/auth/OAuthCallback'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));

// Modals - Lazy load
const LoginModal = lazy(() => import('./components/modals/LoginModal'));
const RegisterModal = lazy(() => import('./components/modals/RegisterModal'));
const ForgotPasswordModal = lazy(() => import('./components/modals/ForgotPasswordModal'));
const TermsModal = lazy(() => import('./components/modals/TermsModal'));
const PrivacyPolicyModal = lazy(() => import('./components/modals/PrivacyPolicyModal'));
const ProfileEditModal = lazy(() => import('./components/common/ProfileEditModal'));

import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import type { Theme, User, ContactMessage } from './types';
import { projects, initialPricingPlans } from './data/mockData';
import { authService } from './services/authService';
import { dashboardAuth } from './services/dashboardAuth';
import { useAuthMonitor } from './hooks/useAuthMonitor';
import { profileService } from './services/apiService';
import { showError } from './components/common/ModernNotification';
import { ModernToaster, showSuccess } from './components/common/ModernNotification';
import apiService from './services/apiService';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  
  // State management - Initialize auth from localStorage to prevent flash
  const [theme, setTheme] = useState<Theme>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      return {
        id: storedUser.id.toString(),
        name: storedUser.name,
        email: storedUser.email,
        role: 'user',
        avatar: storedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(storedUser.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
      };
    }
    return null;
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(() => {
    // Try to get saved profile first (includes custom avatar)
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error('Failed to parse saved profile');
      }
    }
    
    // Fallback to stored user
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      return {
        username: storedUser.email.split('@')[0],
        name: storedUser.name,
        email: storedUser.email,
        bio: 'User',
        location: 'Indonesia',
        website: 'https://neverlandstudio.com',
        avatar: storedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(storedUser.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        role: 'user'
      };
    }
    return {};
  });
  const [pricingPlans] = useState(initialPricingPlans);

  // Maintenance mode state
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);

  // Get current page from location
  const currentPage = location.pathname.substring(1) || 'home';

  // Verify auth with backend in background (optional)
  useEffect(() => {
    const verifyAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Fetch complete profile data from database
          const profileResponse = await profileService.getProfile();
          
          if (profileResponse.success && profileResponse.data) {
            const userData = profileResponse.data;
            
            // Transform backend data to frontend format
            const realtimeProfile = {
              username: userData.username || userData.email.split('@')[0],
              name: userData.name,
              email: userData.email,
              phone: userData.phone || '',
              bio: userData.bio || '',
              location: userData.location || '',
              website: userData.website || '',
              avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
              github: userData.github || '',
              twitter: userData.twitter || '',
              linkedin: userData.linkedin || '',
              instagram: userData.instagram || '',
              role: 'user'
            };
            
            setUserProfile(realtimeProfile);
            setCurrentUser({
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
              role: 'user',
              avatar: realtimeProfile.avatar
            });
            
            // Update localStorage with realtime database data
            localStorage.setItem('userProfile', JSON.stringify(realtimeProfile));
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('Profile synced with database:', userData.name);
          }
        } catch (error) {
          // If API fails but we have stored user, keep them logged in
          console.log('Failed to verify with backend, using cached user data');
        }
      }
    };
    verifyAuth();
  }, []);

  // Check for reopenLoginModal flag (from OAuth cancellation)
  useEffect(() => {
    const shouldReopenModal = localStorage.getItem('reopenLoginModal');
    if (shouldReopenModal === 'true') {
      // Clear flag immediately
      localStorage.removeItem('reopenLoginModal');
      // Open modal with a small delay to ensure component is mounted
      setTimeout(() => {
        setShowLoginModal(true);
      }, 100);
    }
  }, [location.pathname]);

  // Check maintenance mode on mount and periodically
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      // Skip maintenance check for dashboard pages
      if (location.pathname.startsWith('/dashboard')) {
        return;
      }

      try {
        const response = await apiService.get('/maintenance/status');
        if (response.data.success) {
          setIsMaintenance(response.data.is_maintenance);
          setMaintenanceData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
      }
    };

    checkMaintenanceMode();

    // Check every 30 seconds
    const interval = setInterval(checkMaintenanceMode, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Scroll to top on route change or refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handlers
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };
  
  // Monitor auth status and auto-logout if user is deleted
  useAuthMonitor(() => {
    // User was deleted, force logout
    handleLogout();
  });
  
  const handleLogin = async (email: string) => {
    try {
      // Fetch real profile data from database after login
      const profileResponse = await profileService.getProfile();
      
      if (profileResponse.success && profileResponse.data) {
        const userData = profileResponse.data;
        
        // Transform backend data to frontend format with all fields
        const realtimeProfile = {
          username: userData.username || userData.email.split('@')[0],
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
          github: userData.github || '',
          twitter: userData.twitter || '',
          linkedin: userData.linkedin || '',
          instagram: userData.instagram || '',
          role: 'user'
        };
        
        const currentUserData: User = {
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          role: 'user',
          avatar: realtimeProfile.avatar
        };
        
        setCurrentUser(currentUserData);
        setUserProfile(realtimeProfile);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        
        // Save realtime database data to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userProfile', JSON.stringify(realtimeProfile));
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Login successful! Profile loaded from database:', userData.name);
        
        // Navigate to home
        navigate('/home');
      }
    } catch (error) {
      console.error('Error fetching profile after login:', error);
      // Fallback to basic user data if profile fetch fails
      showError('Profile Load Error', 'Could not load complete profile. Please refresh the page.');
    }
  };



  const handleRegister = async () => {
    try {
      // Fetch complete profile data from database after registration
      const profileResponse = await profileService.getProfile();
      
      if (profileResponse.success && profileResponse.data) {
        const userData = profileResponse.data;
        
        // Transform backend data to frontend format with all fields
        const realtimeProfile = {
          username: userData.username || userData.email.split('@')[0],
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
          github: userData.github || '',
          twitter: userData.twitter || '',
          linkedin: userData.linkedin || '',
          instagram: userData.instagram || '',
          role: 'user'
        };
        
        setUserProfile(realtimeProfile);
        setCurrentUser({
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          role: 'user',
          avatar: realtimeProfile.avatar
        });
        setIsAuthenticated(true);
        
        // Save realtime database data to localStorage
        localStorage.setItem('userProfile', JSON.stringify(realtimeProfile));
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Registration successful! Profile loaded from database:', userData.name);
      }
    } catch (error) {
      console.error('Error fetching profile after registration:', error);
    } finally {
      setShowRegisterModal(false);
      navigate('/home');
    }
  };

  const handleResetPassword = (email: string) => {
    // Mock reset password - in real app, send reset email
    alert(`Password reset link sent to ${email}`);
    setShowForgotPasswordModal(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      showSuccess(
        'Logged Out Successfully! 👋',
        'See you again soon.'
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserProfile({});
      // Clear ALL localStorage keys to prevent persistence
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleSimpleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile({});
    setCurrentUser(null);
    // Clear ALL localStorage keys to prevent persistence
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/home');
    
    showSuccess(
      'Logged Out Successfully! 👋',
      'See you again soon.'
    );
  };

  const handleProfileSave = async (updatedProfile: any) => {
    try {
      // Update local state immediately for instant UI feedback
      const newProfile = { ...userProfile, ...updatedProfile };
      setUserProfile(newProfile);
      
      // Fetch fresh data from backend untuk realtime sync dengan database
      const freshData = await profileService.getProfile();
      if (freshData.success && freshData.data) {
        const userData = freshData.data;
        
        // Update dengan data realtime dari database
        const realtimeProfile = {
          username: userData.username || userData.email.split('@')[0],
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          jobTitle: userData.job_title,
          company: userData.company,
          bio: userData.bio || 'User',
          location: userData.location || 'Indonesia',
          website: userData.website || 'https://neverlandstudio.com',
          linkedin: userData.linkedin,
          twitter: userData.twitter,
          github: userData.github,
          instagram: userData.instagram,
          birthDate: userData.birth_date,
          gender: userData.gender,
          avatar: userData.avatar,
          role: 'user'
        };
        
        // Update semua state dengan data realtime
        setUserProfile(realtimeProfile);
        setCurrentUser({
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          role: 'user',
          avatar: userData.avatar
        });
        
        // Simpan data realtime ke localStorage
        localStorage.setItem('userProfile', JSON.stringify(realtimeProfile));
        localStorage.setItem('user', JSON.stringify(userData));
        
        showSuccess(
          `Profile Updated! ✨`,
          `Synced with database: ${userData.name}!`
        );
      }
    } catch (error) {
      console.error('Failed to sync with database:', error);
      // Fallback: gunakan data lokal saja
      const newProfile = { ...userProfile, ...updatedProfile };
      setUserProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = {
          ...userData,
          name: updatedProfile.name || userData.name,
          email: updatedProfile.email || userData.email,
          avatar: updatedProfile.avatar || userData.avatar
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setCurrentUser({
          id: userData.id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          role: 'user',
          avatar: updatedUser.avatar
        });
      }
      
      showSuccess(
        `Profile Updated! ✨`,
        `Your changes have been saved locally.`
      );
    }
  };

  const handleContactSubmit = (_data: any) => {
    // Contact submission is handled by the backend API
    // This function is kept for compatibility but doesn't store locally anymore
  };

  // Navigation handler
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  // Theme classes
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryBg = isDark ? 'bg-gray-800' : 'bg-white';

  // Check if current route is dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Show maintenance page if maintenance is active (but not for dashboard)
  if (isMaintenance && !isDashboardRoute) {
    return (
      <Suspense fallback={<PageLoader />}>
        <MaintenancePage 
          title={maintenanceData?.title}
          message={maintenanceData?.message}
          estimatedTime={maintenanceData?.estimated_time}
        />
      </Suspense>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}>
      {/* Only show Navbar on non-dashboard routes */}
      {!isDashboardRoute && (
        <Navbar
          theme={theme}
          isDark={isDark}
          currentPage={currentPage}
          isMenuOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          secondaryBg={secondaryBg}
          setCurrentPage={handleNavigate}
          setIsMenuOpen={setIsMenuOpen}
          toggleTheme={toggleTheme}
          toggleLanguage={toggleLanguage}
          handleLogout={handleLogout}
          setShowLoginModal={setShowLoginModal}
          userProfile={userProfile}
          onShowProfileEdit={() => setShowProfileEdit(true)}
          onSimpleLogout={handleSimpleLogout}
        />
      )}

      {/* Main content - no padding on dashboard routes */}
      <main className={!isDashboardRoute ? "pt-20" : ""}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage theme={theme} onNavigate={handleNavigate} />} />
            <Route path="/about" element={<AboutPage theme={theme} />} />
            <Route path="/team" element={<TeamPage theme={theme} />} />
            <Route path="/skills" element={<SkillsPage theme={theme} />} />
            <Route path="/awards" element={<AwardsPage theme={theme} />} />
            <Route path="/services" element={<ServicesPage theme={theme} />} />
            <Route path="/it-learning" element={<ITLearningPage />} />
            <Route path="/it-solutions" element={<ITSolutionsPage />} />
            <Route path="/it-consulting" element={<ITConsultingPage />} />
            <Route path="/projects" element={<ProjectsPage theme={theme} />} />
            <Route path="/pricing" element={<PricingPage theme={theme} plans={pricingPlans} />} />
            <Route path="/testimonials" element={<TestimonialsPage theme={theme} />} />
            
            <Route path="/contact" element={<ContactPage theme={theme} onSubmit={handleContactSubmit} />} />
          
          {/* Dashboard - Shows login if not authenticated, dashboard if authenticated */}
          <Route 
            path="/dashboard" 
            element={
              dashboardAuth.isAuthenticated() ? (
                <DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardHome theme={theme} />
                </DashboardLayout>
              ) : (
                <DashboardLogin />
              )
            } 
          />
          <Route 
            path="/auth/google/callback" 
            element={<OAuthCallback />} 
          />
          <Route 
            path="/auth/github/callback" 
            element={<OAuthCallback />} 
          />
          <Route 
            path="/auth/callback" 
            element={<OAuthCallback />} 
          />
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />
          <Route 
            path="/dashboard/users" 
            element={
              <DashboardLayout 
                theme={theme}
                onThemeToggle={toggleTheme}
                onLogout={handleLogout}
              >
                <DashboardUsers theme={theme} />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/projects" 
            element={
              <DashboardLayout 
                theme={theme}
                onThemeToggle={toggleTheme}
                onLogout={handleLogout}
              >
                <DashboardProjects theme={theme} />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/analytics" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardAnalytics theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/contacts" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardContacts theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/enrollments" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardEnrollments theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/consultations" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardConsultations theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/settings" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <Settings theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/activity" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardActivity theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/newsletter" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardNewsletter theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/roles" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardRoles theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/media" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardMedia theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/videos" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardVideos theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/billing" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardBilling theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/reports" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardReports theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/revenue" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardRevenue theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/security" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardSecurity theme={theme} />
                </DashboardLayout>} 
          />
        </Routes>
        </Suspense>
      </main>

      {/* Only show Footer and LiveChat on non-dashboard routes */}
      {!isDashboardRoute && <Footer theme={theme} onNavigate={handleNavigate} />}
      {!isDashboardRoute && <LiveChat theme={theme} />}
      
      {/* Modals */}
      {showLoginModal && (
        <Suspense fallback={null}>
          <LoginModal
            theme={theme}
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
            onSignUp={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
            onForgotPassword={() => {
              setShowLoginModal(false);
              setShowForgotPasswordModal(true);
            }}
          />
        </Suspense>
      )}

      {showRegisterModal && (
        <Suspense fallback={null}>
          <RegisterModal
            theme={theme}
            onClose={() => setShowRegisterModal(false)}
            onRegister={handleRegister}
            onSignIn={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
            onShowTerms={() => setShowTermsModal(true)}
            onShowPrivacy={() => setShowPrivacyModal(true)}
          />
        </Suspense>
      )}

      {showForgotPasswordModal && (
        <Suspense fallback={null}>
          <ForgotPasswordModal
            theme={theme}
            onClose={() => setShowForgotPasswordModal(false)}
            onResetPassword={handleResetPassword}
            onBackToLogin={() => {
              setShowForgotPasswordModal(false);
              setShowLoginModal(true);
            }}
          />
        </Suspense>
      )}

      {showTermsModal && (
        <Suspense fallback={null}>
          <TermsModal
            theme={theme}
            onClose={() => setShowTermsModal(false)}
          />
        </Suspense>
      )}

      {showPrivacyModal && (
        <Suspense fallback={null}>
          <PrivacyPolicyModal
            theme={theme}
            onClose={() => setShowPrivacyModal(false)}
          />
        </Suspense>
      )}

      {showProfileEdit && (
        <Suspense fallback={null}>
          <ProfileEditModal
            theme={theme}
            isOpen={showProfileEdit}
            onClose={() => setShowProfileEdit(false)}
            currentProfile={userProfile}
            onSave={handleProfileSave}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
        <ModernToaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}


