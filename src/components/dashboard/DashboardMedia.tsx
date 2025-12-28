import React, { useState } from 'react';
import type { Theme } from '../../types';
import { Upload, Image, File, Trash2, Download, Search, Grid3x3, List } from 'lucide-react';
import { showSuccess, showError } from '../common/ModernNotification';

interface DashboardMediaProps {
  theme: Theme;
}

const DashboardMedia: React.FC<DashboardMediaProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder media items
  const mediaItems = [
    { id: 1, name: 'project-banner.jpg', type: 'image', size: '2.5 MB', url: '/placeholder.jpg', date: '2025-12-28' },
    { id: 2, name: 'company-logo.png', type: 'image', size: '150 KB', url: '/placeholder.jpg', date: '2025-12-27' },
    { id: 3, name: 'presentation.pdf', type: 'document', size: '5.2 MB', url: '/placeholder.pdf', date: '2025-12-26' },
  ];

  const handleUpload = () => {
    showSuccess('Upload Ready', 'File upload feature will be implemented with backend storage');
  };

  const handleDelete = (name: string) => {
    if (confirm(`Delete ${name}?`)) {
      showSuccess('Deleted', 'File deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Media Library
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your uploaded files and images
          </p>
        </div>
        
        <button 
          onClick={handleUpload}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: '156', icon: File },
          { label: 'Images', value: '89', icon: Image },
          { label: 'Documents', value: '45', icon: File },
          { label: 'Storage Used', value: '2.4 GB', icon: Upload }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-blue-500" />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200'} border focus:ring-2 focus:ring-blue-500 outline-none`}
            />
          </div>

          <div className={`flex items-center rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900' : ''}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
        {mediaItems.map(item => (
          <div key={item.id} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:shadow-lg'} transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {item.type === 'image' ? <Image className="w-5 h-5 text-blue-500" /> : <File className="w-5 h-5 text-slate-500" />}
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.name}
                </span>
              </div>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
              {item.size} • {new Date(item.date).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2">
              <button className={`flex-1 p-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} transition-colors flex items-center justify-center gap-2`}>
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
              <button 
                onClick={() => handleDelete(item.name)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Zone Placeholder */}
      <div className={`p-12 rounded-xl border-2 border-dashed text-center ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Drag and drop files here, or click to browse
        </p>
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Supports: JPG, PNG, GIF, PDF, DOC (Max 10MB)
        </p>
      </div>
    </div>
  );
};

export default DashboardMedia;
