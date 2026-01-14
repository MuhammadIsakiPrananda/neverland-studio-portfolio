import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Calendar, User, Code2, Briefcase, TrendingUp, Filter } from 'lucide-react';
import type { Theme, Project } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import ProjectDetailModal from '../modals/ProjectDetailModal';
import api from '../../services/apiService';
import { realtimeService } from '../../services/realtimeService';

interface ProjectsPageProps {
  theme: Theme;
}

export default function ProjectsPage({ theme }: ProjectsPageProps) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects from API with useCallback to prevent recreating function
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects', { 
        params: { status: 'published' } // Only show published projects on public site
      });
      
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency - function never changes

  // Initial load only once
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Realtime updates - only subscribe once, don't re-subscribe on every render
  useEffect(() => {
    const handleProjectUpdate = (data: any) => {
      // Only refresh if there's actual project change (created, updated, deleted)
      if (data?.type && ['project.created', 'project.updated', 'project.deleted'].includes(data.type)) {
        fetchProjects();
      }
    };

    // Subscribe with longer interval (10 seconds instead of default 5)
    const unsubscribe = realtimeService.subscribe('projects', handleProjectUpdate, 10000);
    
    return () => {
      unsubscribe();
    };
  }, [fetchProjects]);
  
  // Get unique categories - safety check for empty projects array
  const categories = ['All', ...Array.from(new Set((projects || []).map(p => p.category)))];
  
  // Filter projects by category - safety check
  const filteredProjects = selectedCategory === 'All' 
    ? (projects || []) 
    : (projects || []).filter(p => p.category === selectedCategory);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/3 w-[480px] h-[480px] bg-blue-500/20 rounded-full blur-[125px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-[420px] h-[420px] bg-cyan-500/25 rounded-full blur-[115px] animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] bg-purple-500/20 rounded-full blur-[105px] animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-[340px] h-[340px] bg-pink-500/15 rounded-full blur-[95px] animate-pulse" style={{animationDelay: '1.8s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm mb-6 animate-fade-in-down">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('portfolio.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              {t('portfolio.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 leading-relaxed animate-fade-in-up delay-200">
            {t('portfolio.hero.subtitle')}
          </p>
        </div>

        {/* Modern Minimalist Filter - Fully Responsive */}
        <div className="flex justify-center mb-8 sm:mb-12 animate-fade-in-up delay-300 px-2">
          <div className="w-full max-w-4xl">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-700/40 backdrop-blur-xl shadow-2xl">
              {/* Filter Icon - Hidden on very small screens */}
              <div className="hidden sm:flex items-center gap-2 text-slate-400 border-slate-700/50 sm:border-r sm:pr-4">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">{t('portfolio.filter')}</span>
              </div>
              
              {/* Category Pills - Responsive Grid */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const projectCount = category === 'All' 
                    ? projects.length 
                    : projects.filter(p => p.category === category).length;
                  
                  const isActive = selectedCategory === category;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold
                        transition-all duration-300 overflow-hidden
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                          : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-700/60'
                        }
                      `}
                    >
                      {/* Animated Background Glow */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-30 blur-xl -z-10 animate-pulse-slow" />
                      )}
                      
                      <span className="relative flex items-center gap-1.5 sm:gap-2">
                        <span className="whitespace-nowrap">{category}</span>
                        <span className={`
                          px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold
                          ${isActive 
                            ? 'bg-white/20' 
                            : 'bg-slate-700/60 group-hover:bg-slate-600/80'
                          }
                          transition-colors
                        `}>
                          {projectCount}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl animate-pulse bg-slate-800/50" />
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => openProjectModal(project)}
              className={`group relative rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-fade-in-scale delay-${Math.min((index + 1) * 100, 600)}`}
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
                  {project.category}
                </div>

                {/* View Project Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                    <span>View Details</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="space-y-2 mb-4 pb-4 border-b border-slate-700/50">
                  {/* Client */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400">{project.client}</span>
                  </div>
                  
                  {/* Completion Date */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400">Completed 2024</span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.technologies) && project.technologies.slice(0, 3).map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-700/50 text-slate-400">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
              <Code2 className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Projects Found</h3>
            <p className="text-slate-400">Try selecting a different category</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-100">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-3">{projects.length}+</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">Total Projects</div>
          </div>
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-200">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-3">{categories.length - 1}</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">Categories</div>
          </div>
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-300">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-3">100%</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">Success Rate</div>
          </div>
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-400">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-pink-400" />
              <div className="text-2xl md:text-3xl font-bold text-pink-400">Growth</div>
            </div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">Year over Year</div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
