import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LiveChat from './components/common/LiveChat';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import TeamPage from './components/pages/TeamPage';
import SkillsPage from './components/pages/SkillsPage';
import AwardsPage from './components/pages/AwardsPage';
import ServicesPage from './components/pages/ServicesPage';
import ITLearningPage from './components/pages/ITLearningPage';
import ITSolutionsPage from './components/pages/ITSolutionsPage';
import ProjectsPage from './components/pages/ProjectsPage';
import PricingPage from './components/pages/PricingPage';
import TestimonialsPage from './components/pages/TestimonialsPage';
import ContactPage from './components/pages/ContactPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import DashboardUsers from './components/dashboard/DashboardUsers';
import DashboardProjects from './components/dashboard/DashboardProjects';
import DashboardAnalytics from './components/dashboard/DashboardAnalytics';
import DashboardContacts from './components/dashboard/DashboardContacts';
import DashboardEnrollments from './components/dashboard/DashboardEnrollments';
import DashboardConsultations from './components/dashboard/DashboardConsultations';
import DashboardActivity from './components/dashboard/DashboardActivity';
import DashboardNewsletter from './components/dashboard/DashboardNewsletter';
import DashboardRoles from './components/dashboard/DashboardRoles';
import DashboardSessions from './components/dashboard/DashboardSessions';
import DashboardMedia from './components/dashboard/DashboardMedia';
import DashboardVideos from './components/dashboard/DashboardVideos';
import DashboardBilling from './components/dashboard/DashboardBilling';
import DashboardReports from './components/dashboard/DashboardReports';
import DashboardRevenue from './components/dashboard/DashboardRevenue';
import DashboardAPI from './components/dashboard/DashboardAPI';
import DashboardDatabase from './components/dashboard/DashboardDatabase';
import DashboardSecurity from './components/dashboard/DashboardSecurity';
import DashboardLogs from './components/dashboard/DashboardLogs';
import Settings from './components/dashboard/Settings';
import DashboardLogin from './components/auth/DashboardLogin';
import OAuthCallback from './components/auth/OAuthCallback';
import ResetPassword from './components/auth/ResetPassword';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import TermsModal from './components/modals/TermsModal';
import PrivacyPolicyModal from './components/modals/PrivacyPolicyModal';
import ProfileEditModal from './components/common/ProfileEditModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import type { Theme, User, ContactMessage } from './types';
import { projects, initialPricingPlans } from './data/mockData';
import { authService } from './services/authService';
import { dashboardAuth } from './services/dashboardAuth';
import { useAuthMonitor } from './hooks/useAuthMonitor';
import { profileService } from './services/apiService';
import { showError } from './components/common/ModernNotification';
import { useState, useEffect } from 'react';
import { ModernToaster, showSuccess } from './components/common/ModernNotification';

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
          <Route path="/projects" element={<ProjectsPage theme={theme} projects={projects} />} />
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
            path="/dashboard/sessions" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardSessions theme={theme} />
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
            path="/dashboard/api" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardAPI theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/database" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardDatabase theme={theme} />
                </DashboardLayout>} 
          />
          <Route 
            path="/dashboard/logs" 
            element={<DashboardLayout 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogout}
                >
                  <DashboardLogs theme={theme} />
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
      </main>

      {/* Only show Footer and LiveChat on non-dashboard routes */}
      {!isDashboardRoute && <Footer theme={theme} setCurrentPage={handleNavigate} />}
      {!isDashboardRoute && <LiveChat />}
      
      {showLoginModal && (
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
      )}

      {showRegisterModal && (
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
      )}

      {showForgotPasswordModal && (
        <ForgotPasswordModal
          theme={theme}
          onClose={() => setShowForgotPasswordModal(false)}
          onResetPassword={handleResetPassword}
          onBackToLogin={() => {
            setShowForgotPasswordModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {showTermsModal && (
        <TermsModal
          theme={theme}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {showPrivacyModal && (
        <PrivacyPolicyModal
          theme={theme}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {showProfileEdit && (
        <ProfileEditModal
          theme={theme}
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          currentProfile={userProfile}
          onSave={handleProfileSave}
        />
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


