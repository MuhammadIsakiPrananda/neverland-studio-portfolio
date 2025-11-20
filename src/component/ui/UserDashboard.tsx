import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountTabContent } from './AccountTab';
import { AppearanceTabContent } from './AppearanceTab';
import { SecurityTabContent } from './SecurityTab';
import { DeleteAccountModal } from './DeleteAccountModal';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabContent } from './ProfileTabContent';
import { useAppearanceState } from './useAppearanceState';
import { useProfileState } from './useProfileState';
import { useSecurityState } from './useSecurityState';
import { useDeletionState } from './useDeletionState';

interface UserData {
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio?: string;
  coverPhoto?: string | null;
  socials?: { github?: string; linkedin?: string; twitter?: string; };
}

interface UserDashboardProps {
  user: UserData;
  onUpdateProfile: (updatedUser: UserData) => void;
  onClose: () => void;
  onDeleteAccount: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateProfile, onClose, onDeleteAccount }) => {
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    setActiveSection('profile');
  }, [user]);

  const { appSettings, handleSettingsChange, handleThemeChange } = useAppearanceState();
  const { isLoading, formData, handleInputChange, handleSaveChanges, handleCancel, avatarPreview, coverPhotoPreview, fileInputRef, coverPhotoInputRef, handleAvatarChange, handleCoverPhotoChange } = useProfileState(user, onUpdateProfile);
  const securityState = useSecurityState();
  const { isDeleteModalOpen, setIsDeleteModalOpen, isDeleting, handleAccountDeletion } = useDeletionState(onDeleteAccount);

  const calculateProfileCompletion = useCallback(() => {
    let score = 0;
    const total = 5;
    if (user.avatar || avatarPreview) score++;
    if (user.bio) score++;
    if (user.coverPhoto || coverPhotoPreview) score++;
    if (user.socials && Object.values(user.socials).some(s => s)) score++;
    score++;
    return (score / total) * 100;
  }, [user, avatarPreview, coverPhotoPreview]);

  calculateProfileCompletion();

  const currentAvatar = avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=0d9488&color=fff&size=128`;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative w-full max-w-5xl h-[85vh] bg-gray-900 rounded-2xl shadow-2xl shadow-black/30 border border-gray-800 text-slate-200 flex flex-col overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-slate-300 hover:text-white hover:bg-black/40 transition-all z-20">
            <X className="w-5 h-5" />
          </button>

          <header className="p-6 border-b border-gray-800">
            <ProfileHeader 
              user={user}
              currentAvatar={currentAvatar}
              onAvatarClick={() => fileInputRef.current?.click()}
            />
            <nav className="relative flex items-center gap-4 mt-6 border-b border-gray-800">
              {['profile', 'security', 'account', 'appearance'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`relative flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors ${
                    activeSection === section ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="capitalize">{section === 'account' ? 'Account & Billing' : section}</span>
                  {activeSection === section && (
                    <motion.div layoutId="active-nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                </button>
              ))}
            </nav>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-950/50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#52525b #18181b' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'profile' && (
                <>
                  <ProfileTabContent
                    isLoading={isLoading}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCancel={handleCancel}
                    handleSaveChanges={handleSaveChanges}
                    fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                    coverPhotoInputRef={coverPhotoInputRef as React.RefObject<HTMLInputElement>}
                    handleAvatarChange={handleAvatarChange}
                    handleCoverPhotoChange={handleCoverPhotoChange}
                  />
                </>
              )}
              {activeSection === 'account' && (
                <div className="p-6"><AccountTabContent /></div>
              )}
              {activeSection === 'security' && (
                <div className="p-6">
                  <SecurityTabContent 
                    {...securityState}
                    isLoading={isDeleting} // Or a dedicated loading state for security
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                  />
                </div>
              )}
              {activeSection === 'appearance' && (
                <div className="p-6">
                  <AppearanceTabContent 
                    appSettings={appSettings} 
                    onThemeChange={handleThemeChange} 
                    onSettingsChange={handleSettingsChange} 
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </main>
        </motion.div>
      </div>
      
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(confirmation) => handleAccountDeletion(confirmation, user.username)}
        username={user.username}
        isLoading={isDeleting}
      />
    </>
  );
};

export default UserDashboard;