import { useAuth } from '@/features/auth';
import SettingsForm from './SettingsForm';

// Ekspor tipe ini agar bisa digunakan oleh SettingsForm.tsx
export type UserProfile = NonNullable<ReturnType<typeof useAuth>['userProfile']>;

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

export default Settings;