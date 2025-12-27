import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../../types';
import api from '../../services/apiService';
import { realtimeService } from '../../services/realtimeService';
import { notificationService } from '../../services/notificationService';
import { 
  Search, 
  Plus,
  Grid3x3,
  List,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'archived';
  featured: boolean;
  image?: string;
  technologies: string[];
  client?: string;
  date: string;
  url?: string;
}

interface DashboardProjectsProps {
  theme: Theme;
}

const DashboardProjects: React.FC<DashboardProjectsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

  // Fetch projects from backend
  const fetchProjects = useCallback(async () => {
    try {
      const params: any = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterCategory !== 'all') params.category = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get('/admin/projects', { params });
      
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      notificationService.showError('Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterStatus, filterCategory, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Subscribe to real-time project updates
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe('projects', () => {
      fetchProjects();
    });

    return () => unsubscribe();
  }, [fetchProjects]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/admin/projects/${id}`);
      notificationService.showSuccess('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      notificationService.showError('Failed to delete project');
    }
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div
      className={`
        group rounded-xl border overflow-hidden transition-all duration-300 hover:scale-105
        ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'}
      `}
    >
      {/* Project Image */}
      <div className={`relative h-48 ${isDark ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center`}>
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className={`w-16 h-16 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
            Featured
          </span>
        )}
      </div>

      {/* Project Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {project.title}
          </h3>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {project.description}
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className={`flex items-center gap-2 text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <Calendar className="w-3 h-3" />
          <span>{new Date(project.date).toLocaleDateString()}</span>
          {project.client && (
            <>
              <span>•</span>
              <span>{project.client}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
            `}
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
            `}
            title="Edit project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}
            `}
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ProjectListItem = ({ project }: { project: Project }) => (
    <div
      className={`
        p-4 rounded-xl border transition-colors
        ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <ImageIcon className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {project.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className={`text-sm mb-2 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {project.description}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Tag className="w-3 h-3" />
              {project.category}
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              <Calendar className="w-3 h-3 inline mr-1" />
              {new Date(project.date).toLocaleDateString()}
            </span>
            {project.technologies.slice(0, 2).map((tech, idx) => (
              <span key={idx} className={`px-2 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
            title="View project"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
            title="Edit project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Projects Management
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your portfolio projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className={`flex items-center rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2 rounded-lg transition-colors
                ${viewMode === 'grid' 
                  ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
                  : isDark ? 'text-slate-400' : 'text-slate-600'}
              `}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-2 rounded-lg transition-colors
                ${viewMode === 'list' 
                  ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
                  : isDark ? 'text-slate-400' : 'text-slate-600'}
              `}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
              text-white font-medium transition-all shadow-lg shadow-blue-500/20
            "
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Project</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, color: 'blue' },
          { label: 'Active', value: projects.filter(p => p.status === 'active').length, color: 'blue' },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'green' },
          { label: 'Featured', value: projects.filter(p => p.featured).length, color: 'yellow' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`
              p-4 rounded-xl border
              ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
            `}
          >
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`
        p-4 rounded-xl border
        ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg text-sm
                  ${isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}
                  border focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`
                w-full px-4 py-2 rounded-lg text-sm
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'}
                border focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`
                w-full px-4 py-2 rounded-lg text-sm
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'}
                border focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {loading ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-64 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className={`
          p-12 text-center rounded-xl border
          ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No projects found
          </p>
        </div>
      ) : (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'}
        `}>
          {filteredProjects.map((project) => (
            viewMode === 'grid' 
              ? <ProjectCard key={project.id} project={project} />
              : <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardProjects;
