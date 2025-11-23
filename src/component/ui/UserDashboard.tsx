import { useState, useCallback } from 'react';
import { X, UserCircle, Shield, CreditCard, Palette, Bell, LifeBuoy, KeyRound, FileText, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountTabContent } from './AccountTab';
import { AppearanceTabContent } from './AppearanceTab';
import { SecurityTabContent } from './SecurityTab';
import { DeleteAccountModal } from './DeleteAccountModal';
import { NotificationsTabContent } from './NotificationsTab';
import { ApiKeysTabContent } from './ApiKeysTab';
import { SupportTabContent } from './SupportTab';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabContent } from './ProfileTabContent';
import { useAppearanceState } from './useAppearanceState';
import { useProfileState } from './useProfileState';
import { useSecurityState } from './useSecurityState';
import { TermsTabContent } from './TermsTab';
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
  initialSection?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateProfile, onClose, onDeleteAccount, initialSection = 'profile' }) => {
  // Inisialisasi state langsung dari prop untuk memastikan tab yang benar aktif saat dibuka.
  const [activeSection, setActiveSection] = useState(initialSection);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navItems = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account & Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'apiKeys', label: 'API Keys', icon: KeyRound },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
  ];

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

  const profileCompletion = calculateProfileCompletion();

  const currentAvatar = avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=0d9488&color=fff&size=128`;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
          className="relative w-full max-w-6xl h-[90vh] bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 border border-slate-700/50 text-slate-200 flex overflow-hidden"
        >
          {/* Overlay untuk sidebar mobile */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-10 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </AnimatePresence>
          {/* Sidebar */}
          <aside className={`absolute md:relative inset-y-0 left-0 w-72 flex-shrink-0 bg-slate-950/60 md:bg-slate-950/30 border-r border-slate-800/50 p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <h2 className="text-xl font-bold text-white mb-8">Settings</h2>
            <div className="flex flex-col gap-6">
              <ProfileHeader 
                user={user}
                currentAvatar={currentAvatar}
                onAvatarClick={() => fileInputRef.current?.click()}
              />
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-white">{Math.round(profileCompletion)}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <motion.div 
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
            <nav className="mt-10 flex flex-col gap-2 flex-grow">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false); // Tutup sidebar di mobile setelah memilih
                  }} 
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                  {activeSection === item.id && (
                    <motion.div layoutId="active-nav-pill" className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-lg border border-cyan-500/30" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <item.icon className={`relative w-5 h-5 ${activeSection === item.id ? 'text-cyan-400' : ''}`} />
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#52525b #18181b' }}>
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 bg-slate-900/50 backdrop-blur-sm z-10 p-4 border-b border-slate-800 flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-semibold text-white">
              {navItems.find(item => item.id === activeSection)?.label}
            </h3>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="p-8"
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
                <AccountTabContent />
              )}
              {activeSection === 'security' && (
                <SecurityTabContent 
                  {...securityState}
                  isLoading={isDeleting} // Or a dedicated loading state for security
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                />
              )}
              {activeSection === 'appearance' && (
                <AppearanceTabContent 
                  appSettings={appSettings} 
                  onThemeChange={handleThemeChange} 
                  onSettingsChange={handleSettingsChange} 
                />
              )}
              {activeSection === 'notifications' && (
                <NotificationsTabContent />
              )}
              {activeSection === 'support' && (
                <SupportTabContent />
              )}
              {activeSection === 'apiKeys' && (
                <ApiKeysTabContent />
              )}
              {activeSection === 'terms' && (
                <TermsTabContent />
              )}
            </motion.div>
          </AnimatePresence>
          </main>
        </motion.div>
      </div>
      {/* Tombol Close dipindahkan ke luar panel utama untuk posisi yang lebih baik */}
      <button onClick={onClose} className="fixed top-6 right-6 bg-slate-800/50 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all z-[70]">
        <X className="w-6 h-6" />
      </button>
      
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