import React from 'react';
import { Loader, Save, Github, Linkedin, Twitter } from 'lucide-react';

interface ProfileTabContentProps {
  isLoading: boolean;
  formData: any; // Replace 'any' with a more specific type if available
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCancel: () => void;
  handleSaveChanges: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  coverPhotoInputRef: React.RefObject<HTMLInputElement>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  isLoading,
  formData,
  handleInputChange,
  handleCancel,
  handleSaveChanges,
  fileInputRef,
  coverPhotoInputRef,
  handleAvatarChange,
  handleCoverPhotoChange,
}) => {
  return (
    <div className="divide-y divide-gray-800 p-6">
      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
      <input type="file" ref={coverPhotoInputRef} onChange={handleCoverPhotoChange} className="hidden" accept="image/*" />
      
      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          <p className="mt-1 text-sm text-slate-400">Update your name, username, and bio.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/50 outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/50 outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">Bio</label>
            <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={3} className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/50 outline-none transition-colors" placeholder="Tell us a little about yourself..."/>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white">Social Links</h3>
          <p className="mt-1 text-sm text-slate-400">Connect your social media accounts.</p>
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="relative"><Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" name="socials.github" value={formData.socials?.github || ''} onChange={handleInputChange} placeholder="github.com/username" className="w-full bg-gray-800/70 border border-gray-700 rounded-lg pl-9 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500/50 outline-none transition-colors" /></div>
          <div className="relative"><Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" name="socials.linkedin" value={formData.socials?.linkedin || ''} onChange={handleInputChange} placeholder="linkedin.com/in/username" className="w-full bg-gray-800/70 border border-gray-700 rounded-lg pl-9 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500/50 outline-none transition-colors" /></div>
          <div className="relative"><Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" name="socials.twitter" value={formData.socials?.twitter || ''} onChange={handleInputChange} placeholder="twitter.com/username" className="w-full bg-gray-800/70 border border-gray-700 rounded-lg pl-9 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500/50 outline-none transition-colors" /></div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="pt-6 flex justify-end gap-3">
        <button onClick={handleCancel} disabled={isLoading} className="py-2 px-5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-semibold disabled:opacity-50">Cancel</button>
        <button onClick={handleSaveChanges} disabled={isLoading} className="flex items-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50">
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span className="font-semibold">{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};