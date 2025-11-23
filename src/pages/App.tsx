import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Layouts
import LandingPageLayout from './LandingPageLayout';
import DashboardLayout from './dashboard/DashboardLayout';

// Pages
import LandingPage from './LandingPage';
import AnalyticsPage from './dashboard/Analytics'; // Pastikan file ini ada
import OverviewPage from './dashboard/DashboardOverview'; // Nama file yang benar adalah DashboardOverview

// Components
import AuthModal from '../component/ui/AuthModal'; // Path yang benar adalah di dalam /ui/
import { useAuth } from '../context/AuthContext';
import ConsultationModal from '../component/ui/ConsultationModal'; // 1. Impor modal konsultasi

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false); // 2. Tambahkan state untuk modal konsultasi
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (user: any, rememberMe: boolean) => {
    // Buat salinan data pengguna untuk dimodifikasi
    const userProfile = { ...user };

    // Jika pengguna tidak memiliki avatar, tambahkan avatar default
    if (!userProfile.avatar) {
      userProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=0d9488&color=fff&size=128`;
    }

    auth.login(userProfile, rememberMe);

    if (userProfile.role === 'admin') {
      // Langsung navigasi ke dasbor utama setelah login berhasil
      navigate('/dashboard');
    }
    
    setIsAuthModalOpen(false); // Tutup modal
  };

  const handleDashboardClick = (section?: string) => {
    // Fungsi ini akan menangani klik dari ProfileDropdown
    // dan menavigasi ke bagian dasbor yang sesuai.
    navigate(section ? `/dashboard/${section}` : '/dashboard');
  };

  return (
    <>
      <Routes>
        {/* Rute untuk Halaman Utama (Landing Page) */}
        <Route
          element={<LandingPageLayout onLoginClick={() => setIsAuthModalOpen(true)} onDashboardClick={handleDashboardClick} />}
        >
          <Route
            path="/"
            element={
              <LandingPage
                onScheduleConsultationClick={() => setIsConsultationModalOpen(true)} // 3. Panggil fungsi untuk membuka modal
                isAuthModalOpen={isAuthModalOpen}
              />
            }
          />
        </Route>

        {/* Rute untuk Dasbor */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          {/* Tambahkan rute dasbor lainnya di sini */}
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      {isAuthModalOpen && <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />}

      {/* 4. Render modal konsultasi secara kondisional */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </>
  );
}

export default App;