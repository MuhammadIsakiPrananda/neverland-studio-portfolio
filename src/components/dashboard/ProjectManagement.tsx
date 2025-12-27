import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Search,
  Grid,
  List,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  Tag
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: 'published' | 'draft';
  featured: boolean;
  views: number;
  createdAt: string;
}

interface ProjectManagementProps {
  theme: Theme;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock projects
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
      category: 'Web Development',
      status: 'published',
      featured: true,
      views: 1234,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mobile Banking App',
      description: 'Modern banking application with secure transactions',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
      category: 'Mobile App',
      status: 'published',
      featured: false,
      views: 856,
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      title: 'Portfolio Website',
      description: 'Creative portfolio with modern animations',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      category: 'Design',
      status: 'draft',
      featured: false,
      views: 423,
      createdAt: '2024-03-10'
    },
  ];

  const [projects] = useState<Project[]>(mockProjects);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Project Management
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
            Manage your portfolio projects
          </p>
        </div>
        
        <button className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
          ${isDark 
            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30' 
            : 'bg-stone-900 text-white hover:bg-stone-800'}
        `}>
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className={`
        p-4 rounded-2xl
        ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-stone-400'
            }`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-xl transition-colors
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                focus:outline-none
              `}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                px-4 py-2 rounded-xl transition-colors
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900'}
                focus:outline-none
              `}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {/* View Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-stone-100'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? isDark
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-white text-stone-900 shadow'
                    : isDark
                      ? 'text-gray-400'
                      : 'text-stone-600'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? isDark
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-white text-stone-900 shadow'
                    : isDark
                      ? 'text-gray-400'
                      : 'text-stone-600'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`
                rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105
                ${isDark 
                  ? 'bg-gray-900/50 border border-gray-800 hover:border-amber-400/30' 
                  : 'bg-white border border-stone-200 hover:border-stone-300 shadow-lg'}
              `}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-amber-500/90 backdrop-blur">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${
                  project.status === 'published'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
                }`}>
                  {project.status}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-stone-600'}`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                    {project.category}
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                  {project.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                    <Eye className="w-4 h-4" />
                    {project.views}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                    <Calendar className="w-4 h-4" />
                    {project.createdAt}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                    ${isDark 
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20' 
                      : 'bg-stone-100 text-stone-900 hover:bg-stone-200'}
                  `}>
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className={`
                    px-3 py-2 rounded-xl transition-colors
                    ${isDark 
                      ? 'bg-red-500/10 text-red-400 border border-red-400/30 hover:bg-red-500/20' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'}
                  `}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`
          rounded-2xl overflow-hidden
          ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-stone-200 shadow-lg'}
        `}>
          <div className="divide-y divide-gray-800">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className={`p-4 flex items-center gap-4 transition-colors ${
                  isDark ? 'hover:bg-gray-800/30' : 'hover:bg-stone-50'
                }`}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {project.title}
                    </h3>
                    {project.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>
                      {project.category}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>
                      {project.views} views
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-stone-500'}>
                      {project.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    project.status === 'published'
                      ? isDark 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-green-100 text-green-800'
                      : isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-stone-100 text-stone-700'
                  }`}>
                    {project.status}
                  </span>
                  <button className={`p-2 rounded-lg ${
                    isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-stone-100 text-stone-600'
                  }`}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg ${
                    isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                  }`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
