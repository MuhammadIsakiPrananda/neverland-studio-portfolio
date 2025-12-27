import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Image as ImageIcon,
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  Grid3x3,
  List,
  Eye,
  Edit,
  FolderOpen,
  Calendar,
  FileImage,
  Film,
  File,
  Plus
} from 'lucide-react';

interface DashboardMediaProps {
  theme: Theme;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  dimensions?: string;
  usedIn: number;
}

const DashboardMedia: React.FC<DashboardMediaProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const mediaFiles: MediaFile[] = [
    {
      id: '1',
      name: 'hero-banner.jpg',
      type: 'image',
      size: '2.4 MB',
      url: '/placeholder-image.jpg',
      uploadedBy: 'Admin User',
      uploadedAt: '2025-12-20',
      dimensions: '1920x1080',
      usedIn: 3
    },
    {
      id: '2',
      name: 'product-showcase.mp4',
      type: 'video',
      size: '15.8 MB',
      url: '/placeholder-video.mp4',
      uploadedBy: 'John Doe',
      uploadedAt: '2025-12-19',
      dimensions: '1080p',
      usedIn: 1
    },
    {
      id: '3',
      name: 'company-logo.png',
      type: 'image',
      size: '156 KB',
      url: '/placeholder-image.jpg',
      uploadedBy: 'Admin User',
      uploadedAt: '2025-12-18',
      dimensions: '512x512',
      usedIn: 25
    },
    {
      id: '4',
      name: 'presentation.pdf',
      type: 'document',
      size: '4.2 MB',
      url: '/placeholder-document.pdf',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2025-12-17',
      usedIn: 2
    },
    {
      id: '5',
      name: 'team-photo.jpg',
      type: 'image',
      size: '3.1 MB',
      url: '/placeholder-image.jpg',
      uploadedBy: 'Admin User',
      uploadedAt: '2025-12-16',
      dimensions: '2400x1600',
      usedIn: 1
    },
    {
      id: '6',
      name: 'tutorial-video.mp4',
      type: 'video',
      size: '28.5 MB',
      url: '/placeholder-video.mp4',
      uploadedBy: 'Bob Johnson',
      uploadedAt: '2025-12-15',
      dimensions: '4K',
      usedIn: 5
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return FileImage;
      case 'video': return Film;
      case 'document': return File;
      default: return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image': return 'blue';
      case 'video': return 'purple';
      case 'document': return 'green';
      default: return 'gray';
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const stats = [
    { label: 'Total Files', value: mediaFiles.length.toString(), icon: FolderOpen, color: 'blue' },
    { label: 'Images', value: mediaFiles.filter(f => f.type === 'image').length.toString(), icon: FileImage, color: 'green' },
    { label: 'Videos', value: mediaFiles.filter(f => f.type === 'video').length.toString(), icon: Film, color: 'purple' },
    { label: 'Storage Used', value: '52.5 GB', icon: ImageIcon, color: 'cyan' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Media Library
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your images, videos, and documents
          </p>
        </div>
        <div className="flex gap-3">
          {selectedFiles.length > 0 && (
            <button className={`
              px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
              ${isDark 
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}
            `}>
              <Trash2 className="w-4 h-4" />
              Delete ({selectedFiles.length})
            </button>
          )}
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
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

      {/* Filters and View Controls */}
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
                placeholder="Search files..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`
                px-4 py-2.5 rounded-lg outline-none cursor-pointer transition-colors
                ${isDark 
                  ? 'bg-slate-900/50 text-white border border-slate-700' 
                  : 'bg-slate-50 text-slate-900 border border-slate-200'}
              `}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2.5 rounded-lg transition-colors
                ${viewMode === 'grid'
                  ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  : isDark ? 'bg-slate-900/50 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-2.5 rounded-lg transition-colors
                ${viewMode === 'list'
                  ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  : isDark ? 'bg-slate-900/50 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type);
            const color = getFileColor(file.type);
            const isSelected = selectedFiles.includes(file.id);

            return (
              <div
                key={file.id}
                onClick={() => toggleFileSelection(file.id)}
                className={`
                  group relative rounded-xl border transition-all cursor-pointer
                  ${isSelected
                    ? isDark ? 'bg-blue-500/20 border-blue-500' : 'bg-blue-50 border-blue-500'
                    : isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:shadow-lg'
                  }
                `}
              >
                <div className="aspect-video rounded-t-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
                  <Icon className={`w-16 h-16 text-${color}-500`} />
                </div>
                <div className="p-4">
                  <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {file.size}
                    </span>
                    {file.dimensions && (
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {file.dimensions}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                    <button className={`flex-1 p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                      <Eye className="w-4 h-4 mx-auto" />
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
            );
          })}
        </div>
      ) : (
        <div className={`
          rounded-xl border overflow-hidden
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Name
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Type
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Size
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Uploaded By
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Date
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Used In
                  </th>
                  <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {filteredFiles.map((file) => {
                  const Icon = getFileIcon(file.type);
                  return (
                    <tr 
                      key={file.id}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-blue-500" />
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className={`p-4 capitalize ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {file.type}
                      </td>
                      <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {file.size}
                      </td>
                      <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {file.uploadedBy}
                      </td>
                      <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {file.uploadedAt}
                        </div>
                      </td>
                      <td className={`p-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {file.usedIn} places
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <Download className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'}`}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMedia;
