import React from "react";
import {
  Loader,
  Save,
  Github,
  Linkedin,
  Twitter,
  Image as ImageIcon,
} from "lucide-react";
import { SettingsCard } from "@/shared/components";

interface ProfileTabContentProps {
  isLoading: boolean;
  formData: any; // Replace 'any' with a more specific type if available
  remainingUsernameChanges?: number;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
  remainingUsernameChanges = 0,
  handleInputChange,
  handleCancel,
  handleSaveChanges,
  fileInputRef,
  coverPhotoInputRef,
  handleAvatarChange,
  handleCoverPhotoChange,
}) => {
  const isUsernameChangeDisabled = remainingUsernameChanges <= 0;

  return (
    <div className="space-y-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={coverPhotoInputRef}
        onChange={handleCoverPhotoChange}
        className="hidden"
        accept="image/*"
      />

      <SettingsCard
        title="Personal Information"
        description="Update your name, username, and bio."
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 mt-1 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">
              Username
            </label>
            <p className="text-xs text-slate-500 mt-1" id="username-help">
              {isUsernameChangeDisabled
                ? "You have reached the username change limit for this month."
                : `You have ${remainingUsernameChanges} change(s) left this month.`}
            </p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isUsernameChangeDisabled || isLoading}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 mt-1 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors disabled:bg-slate-900/40 disabled:cursor-not-allowed disabled:text-slate-600 text-slate-200"
              aria-describedby="username-help"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 mt-1 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors resize-none text-slate-200"
              placeholder="Tell us a little about yourself..."
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Social Links"
        description="Connect your social media accounts to be displayed on your profile."
      >
        <div className="space-y-3">
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              name="socials.github"
              value={formData.socials?.github || ""}
              onChange={handleInputChange}
              placeholder="github.com/username"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-9 pr-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-200"
            />
          </div>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              name="socials.linkedin"
              value={formData.socials?.linkedin || ""}
              onChange={handleInputChange}
              placeholder="linkedin.com/in/username"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-9 pr-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-200"
            />
          </div>
          <div className="relative">
            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              name="socials.twitter"
              value={formData.socials?.twitter || ""}
              onChange={handleInputChange}
              placeholder="twitter.com/username"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-9 pr-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-200"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Profile Customization"
        description="Change your cover photo to personalize your profile."
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="py-2 px-5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-sm font-semibold disabled:opacity-50 text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="flex items-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {isLoading ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>
        }
      >
        <div>
          <label className="text-sm font-medium text-slate-400">
            Cover Photo
          </label>
          <div
            onClick={() => coverPhotoInputRef.current?.click()}
            className="mt-2 flex justify-center items-center w-full h-32 border-2 border-dashed border-slate-800 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors bg-slate-950/30"
          >
            <div className="text-center text-slate-500">
              <ImageIcon className="mx-auto h-8 w-8" />
              <p className="mt-1 text-sm">Click to upload a new cover photo</p>
              <p className="text-xs">Recommended size: 1500x500</p>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
