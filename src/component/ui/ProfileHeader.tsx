import React from 'react';
import { Edit, Camera, Github, Linkedin, Twitter } from 'lucide-react';

interface ProfileHeaderProps {
  user: { name: string; username: string; };
  isEditing: boolean;
  currentCover: string;
  currentAvatar: string;
  onEdit: () => void;
  onAvatarClick: () => void;
  onCoverClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isEditing, currentCover, currentAvatar, onEdit, onAvatarClick, onCoverClick }) => (
  <div className="flex items-center gap-3 p-2">
    <div className="relative group">
      <img className="w-10 h-10 rounded-full object-cover" src={currentAvatar} alt="User avatar" />
      <button onClick={onAvatarClick} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera className="w-5 h-5 text-white" /></button>
    </div>
    <div>
      <h2 className="font-bold text-white leading-tight">{user.name}</h2>
      <p className="text-sm text-slate-400">@{user.username}</p>
    </div>
  </div>
);