import { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/Dashboard';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Projects from './pages/dashboard/Projects';
import Team from './pages/dashboard/Team';
import Settings from './pages/dashboard/Settings';
import Analytics from './pages/dashboard/Analytics';

// Placeholder components for the new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="text-slate-400">This page is under construction.</p>
  </div>
);

// --- OPTIMASI: Gunakan React.lazy untuk memuat AuthModal hanya saat dibutuhkan ---
const AuthModal = lazy(() => import('./component/ui/AuthModal'));

function App() {
  // State untuk modal sekarang dikelola di level tertinggi
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Routes>
        {/* Berikan fungsi untuk membuka modal ke LandingPage */}
        <Route path="/" element={<LandingPage onLoginClick={() => setModalOpen(true)} />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inbox">
            <Route path="reviews" element={<Placeholder title="Inbox: Reviews" />} />
            <Route path="applicants" element={<Placeholder title="Inbox: Applicants" />} />
            <Route path="collaborations" element={<Placeholder title="Inbox: Collaborations" />} />
          </Route>
          <Route path="projects" element={<Projects />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/website/general" element={<Placeholder title="Settings: Website General" />} />
        </Route>
      </Routes>

      <Suspense fallback={<div /> /* Fallback bisa kosong atau loading spinner */}>
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          // Karena App tidak lagi memanggil useAuth, kita tidak bisa langsung meneruskan 'login'.
          // Kita akan menangani ini di dalam AuthModal.
          // Untuk sekarang, kita buat agar modal bisa ditutup setelah login.
          onLoginSuccess={() => setModalOpen(false)}
        />
      </Suspense>
    </>
  );
}

export default App;