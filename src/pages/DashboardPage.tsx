import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../component/dashboard/Sidebar';
import DashboardHeader from '../component/dashboard/DashboardHeader';
import StatsCard from '../component/dashboard/StatsCard';
import AnalyticsChart from '../component/dashboard/AnalyticsChart';
import RecentActivity from '../component/dashboard/RecentActivity';
import ProjectsTable from '../component/dashboard/ProjectsTable';
import QuickActions from '../component/dashboard/QuickActions';
import { FolderKanban, TrendingUp, Users, DollarSign } from 'lucide-react';
import { api, DashboardStats, AnalyticsData, Activity, Project } from '../utils/api';
import { motion } from 'framer-motion';
import { useNotification } from '../component/ui/useNotification';
import NotificationProvider from '../component/ui/NotificationProvider';

const DashboardPage = () => {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, analyticsData, activitiesData, projectsData] = await Promise.all([
          api.getDashboardStats(),
          api.getAnalytics(),
          api.getActivities(),
          api.getProjects(),
        ]);

        setStats(statsData);
        setAnalytics(analyticsData);
        setActivities(activitiesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        addNotification('Error', 'Failed to load dashboard data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, refreshKey, addNotification]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      addNotification('Success', 'Project deleted successfully', 'success');
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to delete project:', error);
      addNotification('Error', 'Failed to delete project', 'error');
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-900 flex" data-testid="dashboard-page">
        <Sidebar onLogout={handleLogout} />

        <div className="flex-1 overflow-auto">
          <DashboardHeader user={user} title="Dashboard Overview" />

          <main className="p-8 space-y-8">
            {isLoading ? (
              <div className="text-center text-slate-400 py-20">Loading dashboard data...</div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <AnalyticsChart data={analytics} />

                {/* Projects Table */}
                <ProjectsTable projects={projects} onDelete={handleDeleteProject} />

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