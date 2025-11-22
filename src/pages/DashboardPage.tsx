import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsCard from './dashboard/StatsCard';
import AnalyticsChart from './dashboard/AnalyticsChart';
import RecentActivity from './dashboard/RecentActivity';
import ProjectsTable from './dashboard/ProjectsTable';
import QuickActions from './dashboard/QuickActions';
import { FolderKanban, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useNotification } from '../component/ui/useNotification';
import { NotificationProvider } from '../component/ui/NotificationProvider';

// --- Mock Data ---
const mockStats = {
  total_projects: 124,
  active_projects: 8,
  total_clients: 42,
  revenue: 125430.50,
  growth_rate: 15.2,
};

const mockAnalytics = [
  { month: 'Jan', revenue: 12000, projects: 5 },
  { month: 'Feb', revenue: 18000, projects: 7 },
  { month: 'Mar', revenue: 15000, projects: 6 },
  { month: 'Apr', revenue: 22000, projects: 9 },
  { month: 'May', revenue: 25000, projects: 8 },
  { month: 'Jun', revenue: 30000, projects: 10 },
];

const mockActivities = [
  { id: '1', type: 'project', title: 'New Project: "QuantumLeap"', description: 'Initiated by Alex Johnson.', user: 'Alex J.', timestamp: new Date().toISOString() },
  { id: '2', type: 'milestone', title: 'Milestone Reached: "Phoenix" Beta', description: 'UI/UX design phase completed.', user: 'Sarah M.', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'client', title: 'New Client: "Innovate Inc."', description: 'Onboarded for a 6-month retainer.', user: 'Mike W.', timestamp: new Date(Date.now() - 86400000).toISOString() },
];

const mockProjects = [
  { id: 'p1', title: 'Project Phoenix', client: 'Innovate Inc.', status: 'in_progress', progress: 75, budget: 50000, deadline: '2024-12-31' },
  { id: 'p2', title: 'Website Redesign', client: 'Creative Solutions', status: 'completed', progress: 100, budget: 25000, deadline: '2024-10-01' },
  { id: 'p3', title: 'Mobile App "ConnectU"', client: 'Startup Hub', status: 'pending', progress: 10, budget: 75000, deadline: '2025-03-15' },
];
// --- End Mock Data ---

const DashboardPage = () => {
  const { userProfile, isLoggedIn, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [stats, setStats] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, authLoading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setStats(mockStats);
        setAnalytics(mockAnalytics);
        setActivities(mockActivities);
        setProjects(mockProjects);
        setIsLoading(false);
        addNotification('Info', 'Mock data loaded successfully', 'info');
      }, 1000);
    };

    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn, refreshKey, addNotification]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleDeleteProject = async (projectId: string) => {
    // Simulate deleting a project
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    addNotification('Success', 'Project deleted successfully (mock)', 'success');
    // No need to refresh key with mock data
  };

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-900" data-testid="dashboard-page">
        <div className="flex-1">
          <DashboardHeader user={userProfile} title="Dashboard Overview" />

          <main className="p-4 md:p-8 space-y-8">
            {isLoading ? (
              <div className="text-center text-slate-400 py-20">Loading dashboard data...</div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <StatsCard
                    title="Total Projects"
                    value={stats?.total_projects || 0}
                    icon={FolderKanban}
                    color="cyan"
                    delay={0}
                  />
                  <StatsCard
                    title="Active Projects"
                    value={stats?.active_projects || 0}
                    icon={TrendingUp}
                    trend={stats?.growth_rate}
                    color="teal"
                    delay={0.1}
                  />
                  <StatsCard
                    title="Total Clients"
                    value={stats?.total_clients || 0}
                    icon={Users}
                    color="purple"
                    delay={0.2}
                  />
                  <StatsCard
                    title="Revenue"
                    value={`$${(stats?.revenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend={12.5}
                    color="orange"
                    delay={0.3}
                  />
                </div>

                {/* Analytics Chart */}
                <div className="overflow-x-auto"><AnalyticsChart data={analytics} /></div>

                {/* Projects Table */}
                {/* Menambahkan shadow-inner-right untuk indikator scroll di mobile */}
                <div className="overflow-x-auto custom-scrollbar relative md:shadow-none 
                  before:absolute before:top-0 before:right-0 before:h-full before:w-8 before:bg-gradient-to-l before:from-gray-900 before:to-transparent before:pointer-events-none before:opacity-100 md:before:hidden">
                  <ProjectsTable projects={projects} onDelete={handleDeleteProject} />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivity activities={activities} />
                  <QuickActions />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default DashboardPage;