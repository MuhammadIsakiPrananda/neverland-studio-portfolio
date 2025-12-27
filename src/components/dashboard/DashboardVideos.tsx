import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Film,
  Upload,
  Play,
  Pause,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  FileVideo,
  Plus
} from 'lucide-react';

interface DashboardVideosProps {
  theme: Theme;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadedAt: string;
  size: string;
  status: 'published' | 'draft' | 'processing';
  category: string;
}

const DashboardVideos: React.FC<DashboardVideosProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const videos: Video[] = [
    {
      id: '1',
      title: 'Company Introduction Video 2025',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '3:45',
      views: 15420,
      uploadedAt: '2025-12-20',
      size: '45.2 MB',
      status: 'published',
      category: 'Marketing'
    },
    {
      id: '2',
      title: 'Product Demo - Mobile App',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '8:12',
      views: 8930,
      uploadedAt: '2025-12-19',
      size: '128.5 MB',
      status: 'published',
      category: 'Product'
    },
    {
      id: '3',
      title: 'Team Meeting Recording - Q4 2025',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '45:30',
      views: 234,
      uploadedAt: '2025-12-18',
      size: '892.3 MB',
      status: 'draft',
      category: 'Internal'
    },
    {
      id: '4',
      title: 'Tutorial: Using Our Dashboard',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '12:05',
      views: 5670,
      uploadedAt: '2025-12-17',
      size: '215.8 MB',
      status: 'published',
      category: 'Tutorial'
    },
    {
      id: '5',
      title: 'Customer Testimonial Compilation',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '5:20',
      views: 0,
      uploadedAt: '2025-12-16',
      size: '98.4 MB',
      status: 'processing',
      category: 'Marketing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return isDark ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-green-700 bg-green-100 border-green-300';
      case 'draft': return isDark ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'processing': return isDark ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' : 'text-blue-700 bg-blue-100 border-blue-300';
      default: return isDark ? 'text-slate-400 bg-slate-500/20 border-slate-500/30' : 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const publishedCount = videos.filter(v => v.status === 'published').length;

  const stats = [
    { label: 'Total Videos', value: videos.length.toString(), icon: Film, color: 'blue' },
    { label: 'Published', value: publishedCount.toString(), icon: FileVideo, color: 'green' },
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'purple' },
    { label: 'Storage Used', value: '1.4 GB', icon: Clock, color: 'cyan' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Video Content
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage and organize your video library
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`
                p-6 rounded-xl border transition-all duration-200
                ${isDark 
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 hover:shadow-lg'}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className={`
        p-4 rounded-xl border
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className={`relative ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-colors
                  ${isDark 
                    ? 'bg-transparent text-white placeholder:text-slate-500' 
                    : 'bg-transparent text-slate-900 placeholder:text-slate-400'}
                `}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                px-4 py-2.5 rounded-lg outline-none cursor-pointer transition-colors
                ${isDark 
                  ? 'bg-slate-900/50 text-white border border-slate-700' 
                  : 'bg-slate-50 text-slate-900 border border-slate-200'}
              `}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className={`
              group rounded-xl border overflow-hidden transition-all
              ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:shadow-lg'}
            `}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
              <Film className="w-16 h-16 text-blue-500" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors">
                  <Play className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 text-white text-xs font-medium">
                {video.duration}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className={`font-semibold line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {video.title}
                </h3>
                <button className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className={`
                  px-2 py-1 rounded-md text-xs font-medium border capitalize
                  ${getStatusColor(video.status)}
                `}>
                  {video.status}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {video.category}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                    {video.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                    {video.uploadedAt}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FileVideo className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                    {video.size}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-700">
                <button className={`flex-1 p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                  <Play className="w-4 h-4 mx-auto" />
                </button>
                <button className={`flex-1 p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                  <Download className="w-4 h-4 mx-auto" />
                </button>
                <button className={`flex-1 p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'}`}>
                  <Trash2 className="w-4 h-4 mx-auto text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className={`
          p-12 text-center rounded-xl border
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <Film className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No videos found
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardVideos;
