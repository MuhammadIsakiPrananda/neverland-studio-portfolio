import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // NOSONAR
import LandingPageLayout from './pages/LandingPageLayout'; // Path diperbaiki
import { useAuth } from './context/AuthContext';
import DashboardLayout from './pages/Dashboard';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Projects from './pages/dashboard/Projects';
import Team from './pages/dashboard/Team';
import Settings from './pages/dashboard/Settings';
import CalendarPage from './pages/dashboard/CalendarPage';
import Analytics from './pages/dashboard/Analytics';
import Applicants from './pages/dashboard/Applicants'; // Impor komponen baru
import Collaborations from './pages/dashboard/Collaborations'; // Impor komponen baru
import NotificationContainer from './component/ui/NotificationContainer';
import ReviewsPage from './context/ReviewsPage';
import AccessDenied from './context/AccessDenied';


// Placeholder components for the new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="text-slate-400">This page is under construction.</p>
  </div>
);

// Komponen untuk melindungi rute yang memerlukan autentikasi
const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  // Jika pengguna belum login, alihkan ke halaman utama.
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

// Komponen baru untuk melindungi rute yang HANYA untuk admin
const AdminRoute = () => {
  const { userProfile } = useAuth();

  // Jika pengguna adalah admin, izinkan akses. Jika tidak, tampilkan halaman "Akses Ditolak".
  return userProfile?.role === 'admin' ? <Outlet /> : <AccessDenied />;
};


// --- OPTIMASI: Gunakan React.lazy untuk memuat AuthModal hanya saat dibutuhkan ---
const AuthModal = lazy(() => import('./component/ui/AuthModal'));
const ConsultationModal = lazy(() => import('./component/ui/ConsultationModal'));
const UserDashboard = lazy(() => import('./component/ui/UserDashboard'));

function App() {
  const [isConsultationModalOpen, setConsultationModalOpen] = useState(false);
  const [isUserDashboardOpen, setUserDashboardOpen] = useState(false);
  const [dashboardInitialSection, setDashboardInitialSection] = useState('profile');
  const [isModalOpen, setModalOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  
  // Fungsi ini akan menangani data dari LoginForm
  const handleLoginSuccess = (user: any, rememberMe: boolean) => {
    // Buat salinan data pengguna untuk dimodifikasi
    const userProfile = { ...user };

    // Jika pengguna tidak memiliki avatar, tambahkan avatar default
    if (!userProfile.avatar) {
      userProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=0d9488&color=fff&size=128`;
    }

    auth.login(userProfile, rememberMe);

    // Periksa peran pengguna. Hanya admin yang diarahkan ke dasbor.
    if (userProfile.role === 'admin') {
      navigate('/dashboard');
    }
    
    setModalOpen(false); // Tutup modal
  };

  // Pastikan fungsi ini menerima string dan memiliki tipe yang benar
  const handleDashboardClick = (section: string = 'profile') => {
    setDashboardInitialSection(section);
    setUserDashboardOpen(true);
  };

  // Efek untuk mengontrol scroll pada body saat modal terbuka/tertutup
  useEffect(() => {
    if (isModalOpen || isConsultationModalOpen || isUserDashboardOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      // Hanya hapus kelas jika tidak ada modal lain yang aktif di LandingPage
      // Ini mencegah 'jump' jika ada modal lain yang terbuka.
      // Untuk kesederhanaan, kita asumsikan hanya satu modal utama yang aktif.
      document.body.classList.remove('overflow-hidden');
    }
  }, [isModalOpen, isConsultationModalOpen, isUserDashboardOpen]);

  return (
    <>
      <Routes>
        {/* Rute Halaman Utama dibungkus oleh LandingPageLayout, teruskan onLoginClick */}
        <Route element={<LandingPageLayout onLoginClick={() => setModalOpen(true)} onDashboardClick={handleDashboardClick} />}>
          <Route path="/" element={<LandingPage
            onScheduleConsultationClick={() => setConsultationModalOpen(true)}
            isAuthModalOpen={isModalOpen} />} />
        </Route>
        
        {/* Rute yang dilindungi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="calendar" element={<CalendarPage />} />
            
            {/* Rute khusus Admin di dalam dasbor */}
            <Route element={<AdminRoute />}>
              <Route path="analytics" element={<Analytics />} />
              <Route path="inbox" >
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="collaborations" element={<Collaborations />} />
              </Route>
              <Route path="projects" element={<Projects />} />
              <Route path="team" element={<Team />} />
              <Route path="settings/website/general" element={<Placeholder title="Settings: Website General" />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <Suspense fallback={<div /> /* Fallback bisa kosong atau loading spinner */}>
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={() => setConsultationModalOpen(false)}
        />
        {/* Hanya render UserDashboard jika user login DAN modal diminta untuk terbuka */}
        {isUserDashboardOpen && auth.userProfile && (
            <UserDashboard
              user={auth.userProfile}
              onUpdateProfile={auth.updateProfile}
              onClose={() => setUserDashboardOpen(false)}
              onDeleteAccount={auth.logout}
              initialSection={dashboardInitialSection}
              // Key ensures the component remounts when a new section is clicked, applying initialSection correctly.
              key={dashboardInitialSection} 
            />
          )}
      </Suspense>
      <NotificationContainer />
    </>
  );
}

export default App;