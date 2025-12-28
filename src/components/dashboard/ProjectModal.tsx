import { useState } from 'react';
import { X } from 'lucide-react';
import type { Theme } from '../../types';

interface Project {
  id?: number;
  title: string;
  description: string;
  client?: string;
  category: string;
  technologies: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  start_date?: string;
  end_date?: string;
  project_url?: string;
  github_url?: string;
  images?: string[];
}

interface ProjectModalProps {
  theme: Theme;
  project?: Project;
  onClose: () => void;
  onSave: (project: Partial<Project>) => Promise<void>;
}

export default function ProjectModal({ theme, project, onClose, onSave }: ProjectModalProps) {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: project?.title || '',
    description: project?.description || '',
    client: project?.client || '',
    category: project?.category || 'web',
    technologies: project?.technologies || [],
    status: project?.status || 'draft',
    featured: project?.featured || false,
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    project_url: project?.project_url || '',
    github_url: project?.github_url || '',
  });
  const [techInput, setTechInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter(t => t !== tech) || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border
        ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter project title"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Describe the project"
            />
          </div>

          {/* Client & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Client
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Client name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="design">UI/UX Design</option>
                <option value="backend">Backend</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className={`flex-1 px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Add technology (press Enter)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies?.map((tech, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Featured Project
                </span>
              </label>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Project URL
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="https://project-url.com"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                project ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
