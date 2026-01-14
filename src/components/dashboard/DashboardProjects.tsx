import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../../types';
import api from '../../services/apiService';
import { realtimeService } from '../../services/realtimeService';
import { showSuccess, showError } from '../common/ModernNotification';
import ProjectModal from './ProjectModal';
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
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

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
      showError('Load Failed', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Realtime updates - listen for project changes
  useEffect(() => {
    const handleProjectUpdate = () => {
      // Refresh projects list when changes occur
      fetchProjects();
    };

    // Subscribe to realtime project updates
    const unsubscribe = realtimeService.subscribe('projects', handleProjectUpdate);

    return () => {
      unsubscribe();
    };
  }, [fetchProjects]);



  const handleDeleteProject = async (id: number) => {
    // Confirmation modal would be better, but using simple confirm for now
    const confirmed = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirmed) return;

    // Add to deleting state
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      const response = await api.delete(`/admin/projects/${id}`);
      if (response.data.success) {
        showSuccess('Project Deleted', 'Project has been removed successfully');
        // Realtime will trigger auto-refresh, but we'll also call fetchProjects for immediate update
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showError('Delete Failed', 'Failed to delete project. Please try again.');
    } finally {
      // Remove from deleting state
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    try {
      if (editingProject) {
        // Update existing project
        const response = await api.put(`/admin/projects/${editingProject.id}`, projectData);
        if (response.data.success) {
          showSuccess('Project Updated', 'Changes saved successfully');
          setShowModal(false);
          setEditingProject(null);
          // Realtime will trigger auto-refresh, but we'll also call fetchProjects for immediate update
          fetchProjects();
        }
      } else {
        // Create new project
        const response = await api.post('/admin/projects', projectData);
        if (response.data.success) {
          showSuccess('Project Created', 'New project added successfully');
          setShowModal(false);
          // Realtime will trigger auto-refresh, but we'll also call fetchProjects for immediate update
          fetchProjects();
        }
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      showError(
        'Save Failed',
        error.response?.data?.message || 'Failed to save project. Please try again.'
      );
      throw error; // Re-throw to keep modal open
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
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
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const isDeleting = deletingIds.has(project.id);

    return (
      <div
        className={`
        group rounded-xl border overflow-hidden transition-all duration-300 hover:scale-105
        ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'}
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
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
            {Array.isArray(project.technologies) && project.technologies.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                {tech}
              </span>
            ))}
            {Array.isArray(project.technologies) && project.technologies.length > 3 && (
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
              onClick={() => handleEditProject(project)}
              className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
            `}
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteProject(project.id)}
              disabled={isDeleting}
              className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}
              ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
              title="Delete project"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProjectListItem = ({ project }: { project: Project }) => {
    const isDeleting = deletingIds.has(project.id);

    return (
      <div
        className={`
        p-4 rounded-xl border transition-colors
        ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'}
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
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
              {Array.isArray(project.technologies) && project.technologies.slice(0, 2).map((tech, idx) => (
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
              onClick={() => handleEditProject(project)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteProject(project.id)}
              disabled={isDeleting}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'} ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Delete project"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-1">
      {/* Ultra Modern Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 blur-2xl opacity-30"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Projects Management
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Manage your portfolio projects
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Modern View Toggle */}
          <div className="flex items-center gap-1 p-1.5 bg-accent/50 rounded-xl border border-border/50">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              title="Grid view"
              className="h-9 px-3"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              title="List view"
              className="h-9 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            onClick={handleAddProject}
            className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Ultra Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: projects.length, icon: ImageIcon, color: 'primary' },
          { label: 'Published', value: projects.filter(p => p.status === 'published').length, icon: Eye, color: 'green-500' },
          { label: 'Draft', value: projects.filter(p => p.status === 'draft').length, icon: Edit, color: 'yellow-500' },
          { label: 'Featured', value: projects.filter(p => p.featured).length, icon: Tag, color: 'blue-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mt-2">{stat.value}</p>
                  </div>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-${stat.color}/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className={`relative p-3.5 rounded-2xl bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 group-hover:from-${stat.color}/20 group-hover:to-${stat.color}/10 transition-all duration-300`}>
                      <Icon className={`w-6 h-6 text-${stat.color}`} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modern Filters */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Modern Search */}
            <div className="md:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-accent/50 border-accent focus:bg-background transition-colors text-base"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
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
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Project Modal */}
      {showModal && (
        <ProjectModal
          theme={theme}
          project={editingProject || undefined}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default DashboardProjects;
