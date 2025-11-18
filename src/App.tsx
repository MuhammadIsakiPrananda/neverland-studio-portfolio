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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
        <Route path="settings" element={<Settings />} /> {/* This will be the Profile page */}
        <Route path="settings/website/general" element={<Placeholder title="Settings: Website General" />} />
      </Route>
    </Routes>
  );
}

export default App;