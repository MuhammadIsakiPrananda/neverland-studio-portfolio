import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { userService, UpdateUserData, User as UserType } from '../../services/userService';
import { showSuccess, showError } from '../common/ModernNotification';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserType | null;
  theme: 'dark' | 'light';
}

export default function EditUserModal({ isOpen, onClose, onSuccess, user, theme }: EditUserModalProps) {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    job_title: '',
    company: '',
    status: 'active',
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        job_title: user.job_title || '',
        company: user.company || '',
        status: user.status || 'active',
      });
    }
  }, [user]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Get scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Prevent scroll and compensate for scrollbar
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const result = await userService.updateUser(user.id, formData);
      showSuccess('Success', result.message || 'User updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Full Screen Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`relative w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto ${
            isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-stone-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Edit User
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
              {user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-stone-400'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'
                  } focus:outline-none`}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-stone-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'
                  } focus:outline-none`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Phone
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-stone-400'}`} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'
                  } focus:outline-none`}
                  placeholder="+62 812 3456 7890"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Location
              </label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-stone-400'}`} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'
                  } focus:outline-none`}
                  placeholder="Jakarta, Indonesia"
                />
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700 text-white'
                    : 'bg-stone-50 border border-stone-200 text-stone-900'
                } focus:outline-none`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Bio
              </label>
              <div className="relative">
                <FileText className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-stone-400'}`} />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl transition-colors ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-amber-400'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'
                  } focus:outline-none resize-none`}
                  placeholder="Short bio about the user..."
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isDark
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
