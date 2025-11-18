import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type UserProfile = NonNullable<ReturnType<typeof useAuth>['userProfile']>;

const Settings = () => {
  const { userProfile, updateProfile, isLoggedIn, isLoading } = useAuth();

  // 1. Tampilkan loading spinner saat context sedang memeriksa status login
  if (isLoading) {
    return (
      <div className="text-white p-8 max-w-2xl mx-auto text-center">
        <p>Loading Settings...</p>
      </div>
    );
  }

  // 2. Tampilkan pesan jika pengguna belum login
  if (!isLoggedIn || !userProfile) {
    return (
      <div className="text-white p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-4 text-slate-400">Please log in to view and edit your settings.</p>
      </div>
    );
  }

  // 3. Tampilkan form jika pengguna sudah login
  // Memberikan 'key' unik akan me-reset state form jika user berganti.
  return <SettingsForm userProfile={userProfile} updateProfile={updateProfile} key={userProfile.username} />;
};

interface SettingsFormProps {
  userProfile: UserProfile;
  updateProfile: (newProfileData: Partial<UserProfile>) => void;
}

const SettingsForm = ({ userProfile, updateProfile }: SettingsFormProps) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: userProfile.name || '',
    bio: userProfile.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulasi pembaruan agar terlihat ada proses loading
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      alert('Profile updated successfully!'); // Ganti dengan notifikasi yang lebih baik
    }, 1000);
  };

  return (
    <div className="text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="flex items-center mb-8">
        <img
          src={userProfile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`}
          alt="User Avatar"
          className="w-20 h-20 rounded-full mr-6 border-2 border-slate-600"
        />
        <div>
          <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
          <p className="text-slate-400">@{userProfile.username} &middot; {userProfile.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
        </div>
        <div className="mb-6">
          <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
          <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Tell us a little about yourself" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-wait">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;