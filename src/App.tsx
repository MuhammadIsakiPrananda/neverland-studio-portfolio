import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth, type UserProfile } from './context/AuthContext';
import NotificationContainer from './component/ui/NotificationContainer';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/Dashboard';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Projects from './pages/dashboard/Projects';
import Team from './pages/dashboard/Team';
import Settings from './pages/dashboard/Settings';
import Analytics from './pages/dashboard/Analytics';
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
  const { isLoggedIn, isLoading, userProfile } = useAuth();

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

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  
  // Fungsi ini akan menangani data dari LoginForm
  const handleLoginSuccess = (user: any, rememberMe: boolean) => {
    auth.login(user, rememberMe);
    // Arahkan SEMUA pengguna yang berhasil login ke dasbor.
    navigate('/dashboard');
    setModalOpen(false); // Tutup modal
  };

  // Efek untuk mengontrol scroll pada body saat modal terbuka/tertutup
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      // Hanya hapus kelas jika tidak ada modal lain yang aktif di LandingPage
      // Ini mencegah 'jump' jika ada modal lain yang terbuka.
      // Untuk kesederhanaan, kita asumsikan hanya satu modal utama yang aktif.
      document.body.classList.remove('overflow-hidden');
    }
  }, [isModalOpen]);

  return (
    <>
      <Routes>
        {/* Berikan fungsi untuk membuka modal ke LandingPage */}
        <Route path="/" element={<LandingPage onLoginClick={() => setModalOpen(true)} isAuthModalOpen={isModalOpen} />} />
        
        {/* Rute yang dilindungi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Rute khusus Admin di dalam dasbor */}
            <Route element={<AdminRoute />}>
              <Route path="analytics" element={<Analytics />} />
              <Route path="inbox">
                <Route path="reviews" element={<Placeholder title="Inbox: Reviews" />} />
                <Route path="applicants" element={<Placeholder title="Inbox: Applicants" />} />
                <Route path="collaborations" element={<Placeholder title="Inbox: Collaborations" />} />
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
      </Suspense>
      <NotificationContainer />
    </>
  );
}

export default App;