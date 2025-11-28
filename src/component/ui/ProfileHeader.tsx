import React from 'react';
import { Camera } from 'lucide-react';

interface ProfileHeaderProps {
  user: { name: string; username: string; };
  currentAvatar: string;
  onAvatarClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, currentAvatar, onAvatarClick }) => (
  <div className="flex flex-col items-center text-center gap-4 p-2">
    <div className="relative group w-24 h-24">
      <img className="w-full h-full rounded-full object-cover border-2 border-slate-700/50 shadow-lg group-hover:border-amber-500/50 transition-colors" src={currentAvatar} alt="User avatar" />
      <button onClick={onAvatarClick} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <Camera className="w-6 h-6 text-amber-400" />
      </button>
    </div>
    <div>
      <h2 className="text-xl font-bold text-white leading-tight">{user.name}</h2>
      <p className="text-sm text-slate-400">@{user.username}</p>
    </div>
  </div>
);