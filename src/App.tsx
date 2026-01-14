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
const DashboardBilling = lazy(() => import('./components/dashboard/DashboardBilling'));
const DashboardReports = lazy(() => import('./components/dashboard/DashboardReports'));
const DashboardRevenue = lazy(() => import('./components/dashboard/DashboardRevenue'));
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

  // State management - Initialize theme from localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app_theme');
    return (savedTheme as Theme) || 'dark';
  });
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
      console.log('App init - Loading user avatar:', storedUser.avatar ? 'Yes ✅' : 'No ❌');
      return {
        id: storedUser.id.toString(),
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role || 'user',
        avatar: storedUser.avatar // Avatar dari database (no fallback)
      };
    }
    return null;
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(() => {
    // Jangan gunakan saved profile - akan di-load dari database
    // Ini hanya fallback sementara sampai verifyAuth selesai
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      return {
        username: storedUser.username || storedUser.email?.split('@')[0] || '',
        name: storedUser.name || '',
        email: storedUser.email || '',
        bio: storedUser.bio || '',
        location: storedUser.location || '',
        website: storedUser.website || '',
        avatar: storedUser.avatar || '', // Avatar dari localStorage (temporary)
        role: storedUser.role || 'user'
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

  // Sync theme with HTML element for shadcn/ui dark mode
  useEffect(() => {
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add current theme class
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem('app_theme', theme);

    // Add smooth transition
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [theme]);

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
              jobTitle: userData.job_title || '',
              company: userData.company || '',
              bio: userData.bio || '',
              location: userData.location || '',
              website: userData.website || '',
              avatar: userData.avatar, // Avatar dari database - PERMANENT
              github: userData.github || '',
              twitter: userData.twitter || '',
              linkedin: userData.linkedin || '',
              instagram: userData.instagram || '',
              birthDate: userData.birth_date || '',
              gender: userData.gender || '',
              role: userData.role || 'user'
            };

            setUserProfile(realtimeProfile);
            setCurrentUser({
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
              role: userData.role || 'user',
              avatar: userData.avatar // Avatar permanent dari database
            });

            // Update localStorage with realtime database data
            localStorage.setItem('userProfile', JSON.stringify(realtimeProfile));
            localStorage.setItem('user', JSON.stringify(userData));

            console.log('✅ Profile synced from database - Avatar loaded:', userData.avatar ? 'Yes' : 'No');
          }
        } catch (error) {
          // If API fails but we have stored user, keep them logged in
          console.log('Failed to verify with backend, using cached user data');
        }
      }
    };
    verifyAuth();
  }, []);

  // Listen for profile updates from ProfileEditModal
  useEffect(() => {
    const handleProfileUpdate = (event: any) => {
      const updatedProfile = event.detail;
      if (updatedProfile) {
        console.log('🔄 Profile update event received');
        console.log('Updated avatar:', updatedProfile.avatar ? 'Yes ✅' : 'No ❌');

        setUserProfile(updatedProfile);

        // Update currentUser state for navbar
        if (currentUser) {
          const newCurrentUser = {
            ...currentUser,
            name: updatedProfile.name,
            email: updatedProfile.email,
            avatar: updatedProfile.avatar
          };
          setCurrentUser(newCurrentUser);
          console.log('✅ Navbar currentUser updated with new avatar');
        }
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [currentUser]);

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

    // Check for navigation state (from reset password page)
    if (location.state) {
      const state = location.state as any;
      if (state.openLogin) {
        setShowLoginModal(true);
        // Clear the state
        navigate(location.pathname, { replace: true });
      } else if (state.openForgotPassword) {
        setShowForgotPasswordModal(true);
        // Clear the state
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location.pathname, location.state, navigate]);

  // Check maintenance mode on mount and periodically
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      // Skip maintenance check for dashboard pages
      if (location.pathname.startsWith('/dashboard')) {
        setIsMaintenance(false); // Ensure maintenance is off for dashboard
        return;
      }

      try {
        const response = await apiService.get('/maintenance/status');
        if (response.data.success) {
          // Only set maintenance to true if explicitly confirmed by backend
          const isActive = response.data.is_maintenance === true;
          setIsMaintenance(isActive);
          if (isActive) {
            setMaintenanceData(response.data.data);
          }
        } else {
          // If API response is not successful, assume NOT in maintenance
          setIsMaintenance(false);
        }
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
        // On error, default to NOT showing maintenance page (fail-safe)
        setIsMaintenance(false);
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

  const handleResetPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setShowForgotPasswordModal(false);
        showSuccess(
          'Email Sent! ✉️',
          'Password reset link has been sent to your email. Please check your inbox.'
        );
      } else {
        showError(
          'Request Failed',
          response.message || 'Failed to send reset link. Please try again.'
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showError(
        'Request Failed',
        'An error occurred while sending the reset link. Please try again.'
      );
    }
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
      // Clear ALL localStorage keys to prevent persistence (ONLY for web utama, NOT dashboard)
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // NOTE: Dashboard auth (dashboard_token, dashboard_user) is NOT cleared here
      navigate('/');
    }
  };

  const handleSimpleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile({});
    setCurrentUser(null);
    // Clear ALL localStorage keys to prevent persistence (ONLY for web utama)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // NOTE: Dashboard auth (dashboard_token, dashboard_user) is kept separate
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

  // Check if current route is OAuth callback
  const isOAuthCallbackRoute = location.pathname.includes('/auth/') && location.pathname.includes('/callback');

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
      {/* Only show Navbar on non-dashboard and non-OAuth callback routes */}
      {!isDashboardRoute && !isOAuthCallbackRoute && (
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
            isOpen={showLoginModal}
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
            isOpen={showRegisterModal}
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


