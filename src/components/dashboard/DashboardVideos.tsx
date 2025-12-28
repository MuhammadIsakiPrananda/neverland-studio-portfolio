import React, { useState } from 'react';
import type { Theme } from '../../types';
import { Plus, Play, Edit, Trash2, ExternalLink, Youtube } from 'lucide-react';
import { showSuccess, showError } from '../common/ModernNotification';

interface DashboardVideosProps {
  theme: Theme;
}

const DashboardVideos: React.FC<DashboardVideosProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  // Placeholder videos
  const videos = [
    { id: 1, title: 'Company Introduction', platform: 'YouTube', url: 'https://youtube.com/example', thumbnail: '/placeholder.jpg', views: 1250, duration: '3:45' },
    { id: 2, title: 'Product Demo', platform: 'Vimeo', url: 'https://vimeo.com/example', thumbnail: '/placeholder.jpg', views: 890, duration: '5:20' },
    { id: 3, title:  'Customer Testimonial', platform: 'YouTube', url: 'https://youtube.com/example2', thumbnail: '/placeholder.jpg', views: 650, duration: '2:15' },
  ];

  const handleAdd = () => {
    showSuccess('Add Video', 'Video management feature ready for implementation');
  };

  const handleDelete = (title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      showSuccess('Deleted', 'Video removed successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Video Library
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage YouTube, Vimeo, and uploaded videos
          </p>
        </div>
        
        <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Videos', value: '24' },
          { label: 'Total Views', value: '12.5K' },
          { label: 'YouTube', value: '18' },
          { label: 'Vimeo', value: '6' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.id} className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
              <Play className="w-16 h-16 text-white opacity-80" />
              <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{video.title}</h3>
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                {video.views.toLocaleString()} views • {video.platform}
              </p>
              <div className="flex items-center gap-2">
                <button className={`flex-1 p-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} transition-colors flex items-center justify-center gap-2`}>
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(video.title)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardVideos;
