import type { Theme } from '../../types';
import { X, User, Mail, MapPin, Globe, FileText, Camera, Phone, Briefcase, Building2, Linkedin, Twitter, Github, Instagram, Calendar, Users, Settings, Shield, Lock, Eye, EyeOff, Smartphone, Monitor, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { securityService, profileService } from '../../services/apiService';
import { showSuccess, showError } from './ModernNotification';
import DecorativeBackground from './DecorativeBackground';

interface UserProfile {
  username: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  bio: string;
  location: string;
  website: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  birthDate?: string;
  gender?: string;
  avatar: string;
}

interface LoginHistory {
  id: number;
  ip_address: string;
  browser: string;
  platform: string;
  location: string;
  status: 'success' | 'failed';
  failure_reason?: string;
  created_at: string;
}

interface ActiveSession {
  id: number;
  token_id: number;
  device_name: string;
  browser: string;
  platform: string;
  ip_address: string;
  location: string;
  last_activity: string;
  is_current: boolean;
}

interface ProfileEditModalProps {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  currentProfile: Partial<UserProfile>;
  onSave: (profile: Partial<UserProfile>) => void;
}

type Section = 'profile' | 'professional' | 'personal' | 'social' | 'security' | 'account';

export default function ProfileEditModal({ theme, isOpen, onClose, currentProfile, onSave }: ProfileEditModalProps) {
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<Section>('profile');
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    github: '',
    instagram: '',
    birthDate: '',
    gender: '',
    avatar: '',
    ...currentProfile
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // General error message (for modals)
  const [successMessage, setSuccessMessage] = useState(''); // General success message (for modals)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [twoFAErrorMessage, setTwoFAErrorMessage] = useState('');
  const [twoFASuccessMessage, setTwoFASuccessMessage] = useState('');

  // Delete Account state
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Login History & Sessions state
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Avatar file upload handler
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when currentProfile changes
  useEffect(() => {
    if (isOpen) {
      setProfile({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        company: '',
        bio: '',
        location: '',
        website: '',
        linkedin: '',
        twitter: '',
        github: '',
        instagram: '',
        birthDate: '',
        gender: '',
        avatar: '',
        ...currentProfile
      });
    }
  }, [isOpen, currentProfile]);

  // Close modal on ESC key - DISABLED: User must click close button
  // useEffect(() => {
  //   const handleEsc = (e: KeyboardEvent) => {
  //     if (e.key === 'Escape') onClose();
  //   };
  //   if (isOpen) {
  //     document.addEventListener('keydown', handleEsc);
  //   }
  //   return () => {
  //     document.removeEventListener('keydown', handleEsc);
  //   };
  // }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow value
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Fetch user's 2FA status from backend when modal opens
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isOpen) {
        try {
          const response = await profileService.getProfile();
          if (response.success && response.data) {
            // Update 2FA status from backend
            setTwoFactorEnabled(response.data.two_factor_enabled || false);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [isOpen]); // Re-fetch whenever modal opens

  // Auto-refresh 2FA QR code every 5 minutes
  useEffect(() => {
    let countdownInterval: number;

    if (isEnabling2FA && qrCodeData) {
      // Countdown timer
      countdownInterval = window.setInterval(() => {
        setRefreshCountdown((prev) => {
          if (prev <= 1) {
            // Refresh 2FA setup
            handleEnable2FA();
            return 300; // Reset to 5 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isEnabling2FA, qrCodeData]);

  // Fetch login history when Security section is active
  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (isOpen && activeSection === 'security') {
        try {
          setLoadingHistory(true);
          const response = await securityService.getLoginHistory(10);
          if (response.success && response.data) {
            setLoginHistory(response.data.history || []);
          }
        } catch (error) {
          console.error('Failed to fetch login history:', error);
        } finally {
          setLoadingHistory(false);
        }
      }
    };
    
    fetchLoginHistory();
  }, [isOpen, activeSection]);

  // Fetch active sessions when Security section is active
  useEffect(() => {
    const fetchActiveSessions = async () => {
      if (isOpen && activeSection === 'security') {
        try {
          setLoadingSessions(true);
          const response = await securityService.getActiveSessions();
          if (response.success && response.data) {
            setActiveSessions(response.data.sessions || []);
          }
        } catch (error) {
          console.error('Failed to fetch active sessions:', error);
        } finally {
          setLoadingSessions(false);
        }
      }
    };
    
    fetchActiveSessions();
  }, [isOpen, activeSection]);

  // Helper function to format timestamp to relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Handler to revoke a session
  const handleRevokeSession = async (sessionId: number) => {
    try {
      setLoadingSessions(true);
      const response = await securityService.revokeSession(sessionId);
      
      if (response.success) {
        showSuccess('Session Revoked', 'The session has been terminated successfully');
        // Refresh sessions list
        const sessionsResponse = await securityService.getActiveSessions();
        if (sessionsResponse.success && sessionsResponse.data) {
          setActiveSessions(sessionsResponse.data.sessions || []);
        }
      }
    } catch (error: any) {
      showError('Revoke Failed', error.response?.data?.message || 'Failed to revoke session');
    } finally {
      setLoadingSessions(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Prepare profile data for backend
      const profileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        job_title: profile.jobTitle,
        company: profile.company,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        github: profile.github,
        instagram: profile.instagram,
        birth_date: profile.birthDate,
        gender: profile.gender,
        avatar: profile.avatar,
      };
      
      // Update profile via API
      const response = await profileService.updateProfile(profileData);
      
      if (response.success) {
        setSuccessMessage('Profile updated successfully!');
        
        // Fetch fresh data from backend untuk ensure realtime sync
        try {
          const freshProfile = await profileService.getProfile();
          if (freshProfile.success && freshProfile.data) {
            const userData = freshProfile.data;
            
            // Update local state dengan data realtime dari backend
            const updatedProfile = {
              username: userData.username || userData.email.split('@')[0],
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              jobTitle: userData.job_title,
              company: userData.company,
              bio: userData.bio,
              location: userData.location,
              website: userData.website,
              linkedin: userData.linkedin,
              twitter: userData.twitter,
              github: userData.github,
              instagram: userData.instagram,
              birthDate: userData.birth_date,
              gender: userData.gender,
              avatar: userData.avatar,
              role: 'user'
            };
            
            onSave(updatedProfile);
            
            // Update localStorage dengan data fresh dari database
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          }
        } catch (fetchError) {
          console.error('Failed to fetch fresh profile:', fetchError);
          // Fallback: gunakan data dari response
          onSave(profile);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            localStorage.setItem('user', JSON.stringify({
              ...userData,
              ...response.data.user
            }));
          }
        }
        
        // Show success toast
        showSuccess('Profile Updated Successfully!', '✅');
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update profile';
      setErrorMessage(errorMsg);
      
      // Show error toast
      showError('Update Failed!', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file - hanya terima image
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError('Invalid File Type', 'Please upload an image file (JPG, PNG, or WebP)');
      e.target.value = ''; // Reset input
      return;
    }

    // Validasi ukuran file - max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showError('File Too Large', 'Image size must be less than 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Optional: Resize jika terlalu besar (untuk optimasi)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Max dimensions untuk profile photo
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert ke base64 dengan quality 0.9 untuk balance size dan quality
        const resizedImage = canvas.toDataURL(file.type, 0.9);
        
        setProfile(prev => ({ ...prev, avatar: resizedImage }));
        showSuccess('Image Uploaded', 'Profile photo updated successfully');
      };
      img.src = reader.result as string;
    };
    
    reader.onerror = () => {
      showError('Upload Failed', 'Failed to read image file');
      e.target.value = ''; // Reset input
    };
    
    reader.readAsDataURL(file);
  };

  // 2FA Handlers
  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const response = await securityService.enable2FA();
      
      if (response.success) {
        setQrCodeData(response.data.qr_code_svg);
        setTwoFactorSecret(response.data.secret);
        setRecoveryCodes(response.data.recovery_codes);
        setIsEnabling2FA(true);
        setTwoFASuccessMessage('Scan the QR code with Google Authenticator');
      }
    } catch (error: any) {
      setTwoFAErrorMessage(error.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      const response = await securityService.verify2FA(twoFactorCode);
      
      if (response.success) {
        setTwoFactorEnabled(true);
        setIsEnabling2FA(false);
        setShowRecoveryCodes(true);
        setTwoFASuccessMessage('2FA has been successfully enabled!');
        setTwoFactorCode('');
      }
    } catch (error: any) {
      setTwoFAErrorMessage(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      if (!disablePassword) {
        setTwoFAErrorMessage('Please enter your password');
        return;
      }
      
      const response = await securityService.disable2FA(disablePassword);
      
      if (response.success) {
        setTwoFactorEnabled(false);
        setQrCodeData('');
        setTwoFactorSecret('');
        setRecoveryCodes([]);
        setIsEnabling2FA(false);
        setShowRecoveryCodes(false);
        setShowDisable2FAModal(false);
        setDisablePassword('');
        setTwoFASuccessMessage('2FA has been disabled');
      }
    } catch (error: any) {
      setTwoFAErrorMessage(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setPasswordErrorMessage('');
      setPasswordSuccessMessage('');
      
      if (newPassword !== confirmPassword) {
        setPasswordErrorMessage('New passwords do not match');
        return;
      }
      
      const response = await securityService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      
      if (response.success) {
        setPasswordSuccessMessage(response.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      setPasswordErrorMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const sidebarSections = [
    { id: 'profile' as Section, label: 'Profile Info', icon: User },
    { id: 'personal' as Section, label: 'Personal', icon: Settings },
    { id: 'social' as Section, label: 'Social Media', icon: Globe },
    { id: 'security' as Section, label: 'Security', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop with Blur Effect */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-fade-in"
      />

      {/* Modal Container - Modern Glass Morphism Design */}
      <div className="
        relative w-full h-[95vh] sm:h-[85vh] flex flex-col md:flex-row
        max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-5xl
        rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden
        bg-slate-950
        border border-slate-700/50
        animate-scale-in z-20
      ">
        {/* Decorative Background - Inside Modal */}
        <DecorativeBackground />
        
        {/* Modern Mobile Header */}
        <div className="
          relative z-10 md:hidden flex items-center justify-between p-4 border-b
          bg-slate-800/50 border-slate-700/50 backdrop-blur-sm
        ">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              p-2 rounded-xl transition-all duration-300
              hover:bg-slate-700/50 text-slate-400 hover:text-white
              border border-transparent hover:border-slate-600/50
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modern Mobile Tabs Navigation */}
        <div className="
          relative z-10 md:hidden overflow-x-auto border-b scrollbar-hide
          bg-slate-800/30 border-slate-700/50
        ">
          <div className="flex p-2 gap-2 min-w-max">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
                    transition-all duration-300 text-sm font-medium
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white border border-transparent'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modern Desktop Sidebar - Glass Morphism */}
        <div className="
          relative z-10 hidden md:block w-64 flex-shrink-0 border-r p-6
          bg-slate-800/30 border-slate-700/50 backdrop-blur-xl
        ">
          {/* Close Button - Modern Gradient */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              w-full mb-6 p-3 rounded-xl transition-all duration-300 flex items-center justify-center
              bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-white
              border border-slate-600/30 hover:border-slate-500/50
              group
            "
          >
            <X className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium">Close</span>
          </button>

          {/* User Info Section */}
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-slate-700/50">
            <div className="
              w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl
              bg-gradient-to-br from-blue-500 to-cyan-500 text-white
              border-2 border-blue-400/20
            ">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                (profile.name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            
            <h3 className="text-white font-medium mt-3 text-center">{profile.name || 'User'}</h3>
            <p className="text-xs text-slate-400 text-center">{profile.email || ''}</p>
          </div>

          {/* Navigation Sections - Modern Gradient Active State */}
          <nav className="space-y-2">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-300 text-left group
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white border border-transparent hover:border-slate-600/30'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`
            border-b p-6
            ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/50 border-stone-200'}
          `}>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              {sidebarSections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-stone-600'
            }`}>
              Update your {sidebarSections.find(s => s.id === activeSection)?.label.toLowerCase()}
            </p>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="relative z-10 flex-1 overflow-y-auto scrollbar-hide p-6">
            <div className="space-y-6 max-w-2xl">
              {/* Profile Info Section */}
              {activeSection === 'profile' && (
                <>
                  {/* Profile Photo Section */}
                  <div className={`
                    p-6 rounded-2xl border
                    ${isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/50 border-stone-200'}
                  `}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      Profile Photo
                    </h3>
                    <div className="flex items-center gap-6">
                      {/* Avatar Preview */}
                      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="
                          w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-3xl
                          bg-gradient-to-br from-blue-500 to-cyan-500 text-white
                          transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl
                          border-4 border-blue-400/20
                        ">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                          ) : (
                            (profile.name || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        
                        <div className="
                          absolute inset-0 rounded-2xl flex items-center justify-center
                          bg-gradient-to-br from-blue-600/90 to-cyan-600/90 backdrop-blur-sm
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-300
                        ">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Upload Instructions */}
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className={`
                            px-4 py-2 rounded-lg font-medium transition-all duration-300
                            ${isDark 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'}
                          `}
                        >
                          Upload Photo
                        </button>
                        <p className={`text-sm mt-2 ${
                          isDark ? 'text-gray-400' : 'text-stone-600'
                        }`}>
                          JPG, PNG or WebP • Max 5MB • Will be auto-resized to 800x800px
                        </p>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className={`
                    p-6 rounded-2xl border
                    ${isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/50 border-stone-200'}
                  `}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      Basic Information
                    </h3>
                    
                    <div className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <User className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            value={profile.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="John Doe"
                            required
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-500' : 'text-stone-500'
                        }`}>
                          Your first and last name
                        </p>
                      </div>

                      {/* Username */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-600' : 'text-stone-500'
                          }`}>
                            <User className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            value={profile.username || ''}
                            readOnly
                            disabled
                            placeholder="johndoe"
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 cursor-not-allowed
                              ${isDark 
                                ? 'bg-gray-900/50 border border-gray-700/30 text-gray-500 placeholder-gray-600' 
                                : 'bg-stone-100/50 border border-stone-200 text-stone-600 placeholder-stone-500'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${
                          isDark ? 'text-gray-600' : 'text-stone-500'
                        }`}>
                          <Lock className="w-3 h-3" />
                          Username cannot be changed
                        </p>
                      </div>

                      {/* Email */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-600' : 'text-stone-500'
                          }`}>
                            <Mail className="w-5 h-5" />
                          </div>
                          <input
                            type="email"
                            value={profile.email || ''}
                            readOnly
                            disabled
                            placeholder="john.doe@example.com"
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 cursor-not-allowed
                              ${isDark 
                                ? 'bg-gray-900/50 border border-gray-700/30 text-gray-500 placeholder-gray-600' 
                                : 'bg-stone-100/50 border border-stone-200 text-stone-600 placeholder-stone-500'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${
                          isDark ? 'text-gray-600' : 'text-stone-500'
                        }`}>
                          <Lock className="w-3 h-3" />
                          Email cannot be changed for security reasons
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <Phone className="w-5 h-5" />
                          </div>
                          <input
                            type="tel"
                            value={profile.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="+62 812-3456-7890"
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-500' : 'text-stone-500'
                        }`}>
                          Include country code (e.g., +62 for Indonesia)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* About & Bio */}
                  <div className={`
                    p-6 rounded-2xl border
                    ${isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/50 border-stone-200'}
                  `}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      About & Bio
                    </h3>
                    
                    <div className="space-y-5">
                      {/* Bio */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className={`block text-sm font-medium ${
                            isDark ? 'text-gray-300' : 'text-stone-700'
                          }`}>
                            Bio / About Yourself
                          </label>
                          <span className={`text-xs ${
                            (profile.bio?.length || 0) > 500 
                              ? 'text-red-500' 
                              : isDark ? 'text-gray-500' : 'text-stone-500'
                          }`}>
                            {profile.bio?.length || 0}/500
                          </span>
                        </div>
                        <div className="relative">
                          <div className={`absolute left-4 top-4 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <textarea
                            value={profile.bio || ''}
                            onChange={(e) => {
                              if (e.target.value.length <= 500) {
                                handleChange('bio', e.target.value);
                              }
                            }}
                            placeholder="Tell us about yourself... What do you do? What are your interests? What makes you unique?"
                            rows={5}
                            maxLength={500}
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 resize-none
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-500' : 'text-stone-500'
                        }`}>
                          Write a brief description about yourself (max 500 characters)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Contact */}
                  <div className={`
                    p-6 rounded-2xl border
                    ${isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/50 border-stone-200'}
                  `}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      Location & Website
                    </h3>
                    
                    <div className="space-y-5">
                      {/* Location */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Location <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            value={profile.location || ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            placeholder="Jakarta, Indonesia"
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-500' : 'text-stone-500'
                        }`}>
                          City, Country or your current location
                        </p>
                      </div>

                      {/* Website */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Website <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <Globe className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            value={profile.website || ''}
                            onChange={(e) => handleChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-500' : 'text-stone-500'
                        }`}>
                          Your personal or professional website URL
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}



              {/* Personal Section */}
              {activeSection === 'personal' && (
                <>
                  {/* Job Title */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      Job Title / Position <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={profile.jobTitle || ''}
                        onChange={(e) => handleChange('jobTitle', e.target.value)}
                        placeholder="e.g. Senior Developer, Designer"
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      Company / Organization <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={profile.company || ''}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Your company name"
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      Birth Date
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={profile.birthDate || ''}
                        onChange={(e) => handleChange('birthDate', e.target.value)}
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      Gender
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <select
                        value={profile.gender || ''}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white focus:border-amber-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 focus:border-stone-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                        `}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Social Media Section */}
              {activeSection === 'social' && (
                <>
                  {/* LinkedIn */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Linkedin className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={profile.linkedin || ''}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      Twitter / X
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Twitter className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={profile.twitter || ''}
                        onChange={(e) => handleChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourhandle"
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                        `}
                      />
                    </div>
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      GitHub
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Github className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={profile.github || ''}
                        onChange={(e) => handleChange('github', e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                        `}
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-stone-700'
                    }`}>
                      Instagram
                    </label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-stone-400'
                      }`}>
                        <Instagram className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={profile.instagram || ''}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                        className={`
                          w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                            : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                          focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                        `}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <>
                  {/* Change Password */}
                  <div className={`p-6 rounded-2xl border ${
                    isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/50 border-stone-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      <Lock className="w-5 h-5" />
                      Change Password
                    </h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                      Update your password to keep your account secure
                    </p>

                    {/* Error Message for Password */}
                    {passwordErrorMessage && (
                      <div className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
                        isDark ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'
                      }`}>
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{passwordErrorMessage}</p>
                      </div>
                    )}

                    {/* Success Message for Password */}
                    {passwordSuccessMessage && (
                      <div className={`mb-4 p-4 rounded-xl ${
                        isDark ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'
                      }`}>
                        <p className="text-sm">✓ {passwordSuccessMessage}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <Lock className="w-5 h-5" />
                          </div>
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                              setErrorMessage('');
                            }}
                            placeholder="Enter your current password"
                            className={`
                              w-full pl-12 pr-12 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-stone-400 hover:text-stone-600'
                            }`}
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <Lock className="w-5 h-5" />
                          </div>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setErrorMessage('');
                            }}
                            placeholder="Enter new password"
                            className={`
                              w-full pl-12 pr-12 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-stone-400 hover:text-stone-600'
                            }`}
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {newPassword && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <div className={`h-1 flex-1 rounded-full overflow-hidden ${
                                isDark ? 'bg-gray-700' : 'bg-stone-200'
                              }`}>
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    newPassword.length < 6 ? 'w-1/3 bg-red-500' :
                                    newPassword.length < 8 ? 'w-2/3 bg-yellow-500' :
                                    'w-full bg-green-500'
                                  }`}
                                />
                              </div>
                              <span className={`font-medium ${
                                newPassword.length < 6 ? 'text-red-500' :
                                newPassword.length < 8 ? 'text-yellow-500' :
                                'text-green-500'
                              }`}>
                                {newPassword.length < 6 ? 'Weak' :
                                 newPassword.length < 8 ? 'Fair' :
                                 'Strong'}
                              </span>
                            </div>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                              Password must be at least 8 characters long
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-stone-700'
                        }`}>
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-stone-400'
                          }`}>
                            <Lock className="w-5 h-5" />
                          </div>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setErrorMessage('');
                            }}
                            placeholder="Confirm your new password"
                            className={`
                              w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                              ${isDark 
                                ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                                : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                              focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                            `}
                          />
                        </div>
                        {confirmPassword && confirmPassword !== newPassword && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Passwords do not match
                          </p>
                        )}
                        {confirmPassword && confirmPassword === newPassword && newPassword.length >= 8 && (
                          <p className="text-xs text-green-500 mt-1">
                            ✓ Passwords match
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
                      className={`
                        w-full mt-6 py-3 px-4 rounded-xl font-medium transition-all duration-300
                        flex items-center justify-center gap-2
                        ${loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8
                          ? isDark 
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : isDark 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}
                      `}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className={`p-6 rounded-xl border ${
                    isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white border-stone-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      <Smartphone className="w-5 h-5" />
                      Two-Factor Authentication
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                      Add an extra layer of security to your account
                    </p>

                    {/* Success/Error Messages for 2FA */}
                    {twoFASuccessMessage && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        isDark ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'
                      }`}>
                        {twoFASuccessMessage}
                      </div>
                    )}
                    {twoFAErrorMessage && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        isDark ? 'bg-red-500/20 border border-red-500/30 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'
                      }`}>
                        {twoFAErrorMessage}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                        Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      {twoFactorEnabled && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowDisable2FAModal(true);
                            setTwoFAErrorMessage('');
                            setTwoFASuccessMessage('');
                          }}
                          disabled={loading}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
                            ${isDark 
                              ? 'bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {loading ? 'Processing...' : 'Disable 2FA'}
                        </button>
                      )}
                    </div>

                    {!twoFactorEnabled && !isEnabling2FA && (
                      <button
                        type="button"
                        onClick={handleEnable2FA}
                        disabled={loading}
                        className={`
                          w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300
                          ${isDark 
                            ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700' 
                            : 'bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200'}
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {loading ? 'Generating QR Code...' : 'Enable 2FA'}
                      </button>
                    )}

                    {isEnabling2FA && qrCodeData && (
                      <div className="mt-4">
                        {/* Auto-refresh countdown */}
                        <div className={`text-xs text-center mb-4 flex items-center justify-center gap-2 ${
                          isDark ? 'text-gray-500' : 'text-stone-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          Auto-refresh in {Math.floor(refreshCountdown / 60)}:{String(refreshCountdown % 60).padStart(2, '0')}
                        </div>

                        {/* Side-by-side layout: QR Code + Manual Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* QR Code Method */}
                          <div className={`p-4 rounded-xl border ${
                            isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-stone-50 border-stone-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="text-2xl">📱</div>
                              <div>
                                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                  Scan QR Code
                                </h4>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                                  Use any TOTP app
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <div className="p-3 rounded-lg bg-white">
                                <div dangerouslySetInnerHTML={{ __html: atob(qrCodeData) }} />
                              </div>
                            </div>
                          </div>

                          {/* Manual Code Method */}
                          <div className={`p-4 rounded-xl border ${
                            isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-stone-50 border-stone-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="text-2xl">🔑</div>
                              <div>
                                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                  Manual Entry
                                </h4>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                                  Copy secret key
                                </p>
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg ${
                              isDark ? 'bg-gray-900/50' : 'bg-white'
                            }`}>
                              <p className={`text-xs mb-2 text-center ${
                                isDark ? 'text-gray-500' : 'text-stone-500'
                              }`}>
                                Secret Key:
                              </p>
                              <code className={`block text-center font-mono text-sm tracking-wider mb-3 break-all ${
                                isDark ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                {twoFactorSecret}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(twoFactorSecret);
                                  showSuccess('Copied!', 'Secret key copied to clipboard');
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                  isDark
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy to Clipboard
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className={`text-sm mb-3 text-center ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                          Enter the 6-digit code from your authenticator app:
                        </p>

                        {/* Verification Input */}
                        <input
                          type="text"
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit code from app"
                          maxLength={6}
                          className={`
                            w-full px-4 py-3 rounded-xl text-center text-lg tracking-widest transition-all duration-300 mb-3
                            ${isDark 
                              ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-400/50' 
                              : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-blue-400'}
                            focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/20' : 'focus:ring-blue-400/20'}
                          `}
                        />
                        <button
                          type="button"
                          onClick={handleVerify2FA}
                          disabled={loading || twoFactorCode.length !== 6}
                          className={`
                            w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2
                            ${isDark 
                              ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Shield className="w-5 h-5" />
                              Verify & Enable 2FA
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {showRecoveryCodes && recoveryCodes.length > 0 && (
                      <div className={`mt-4 p-4 rounded-xl border ${
                        isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-900'}`}>
                          Recovery Codes
                        </h4>
                        <p className={`text-sm mb-3 ${isDark ? 'text-yellow-200/80' : 'text-yellow-800'}`}>
                          Save these codes in a safe place. You can use them to access your account if you lose your device.
                        </p>
                        <div className={`grid grid-cols-2 gap-2 mb-3 p-3 rounded-lg font-mono text-sm ${
                          isDark ? 'bg-gray-900/50' : 'bg-white'
                        }`}>
                          {recoveryCodes.map((code, index) => (
                            <div key={index} className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                              {code}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowRecoveryCodes(false)}
                          className={`
                            w-full py-2 px-4 rounded-lg font-medium transition-all duration-300
                            ${isDark 
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}
                          `}
                        >
                          I've Saved My Codes
                        </button>
                      </div>
                    )}

                    {/* Recovery Codes Display */}
                    {showRecoveryCodes && recoveryCodes.length > 0 && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                          Recovery Codes (Save these!)
                        </h4>
                        <p className={`text-xs mb-2 ${isDark ? 'text-amber-200/70' : 'text-amber-800/70'}`}>
                          Store these codes in a safe place. You can use them to access your account if you lose your device.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {recoveryCodes.map((code, index) => (
                            <code key={index} className={`text-xs p-2 rounded ${
                              isDark ? 'bg-gray-900/50 text-amber-300' : 'bg-white text-amber-900'
                            }`}>
                              {code}
                            </code>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowRecoveryCodes(false)}
                          className={`mt-3 w-full py-2 text-sm rounded-lg ${
                            isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          I've saved my codes
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Login History */}
                  <div className={`p-6 rounded-xl border ${
                    isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white border-stone-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      <Clock className="w-5 h-5" />
                      Recent Login Activity
                    </h3>
                    <div className="space-y-3">
                      {loadingHistory ? (
                        // Loading skeleton
                        [1, 2, 3].map((item) => (
                          <div key={item} className={`p-3 rounded-lg animate-pulse ${
                            isDark ? 'bg-gray-900/50' : 'bg-stone-50'
                          }`}>
                            <div className={`h-5 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-stone-200'}`} />
                            <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-stone-200'}`} />
                          </div>
                        ))
                      ) : loginHistory.length === 0 ? (
                        // Empty state
                        <div className={`p-6 text-center rounded-lg ${
                          isDark ? 'bg-gray-900/30' : 'bg-stone-50'
                        }`}>
                          <Clock className={`w-12 h-12 mx-auto mb-2 ${
                            isDark ? 'text-gray-600' : 'text-stone-400'
                          }`} />
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                            No login history available
                          </p>
                        </div>
                      ) : (
                        // Real data
                        loginHistory.map((history) => (
                          <div key={history.id} className={`p-3 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-stone-50'
                          }`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                {history.platform} · {history.browser}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                history.status === 'success'
                                  ? isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                                  : isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                              }`}>
                                {history.status === 'success' ? 'Success' : 'Failed'}
                              </span>
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                              {history.ip_address} · {history.location || 'Unknown'} · {formatRelativeTime(history.created_at)}
                            </p>
                            {history.failure_reason && (
                              <p className={`text-xs mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                Reason: {history.failure_reason}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className={`p-6 rounded-xl border ${
                    isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white border-stone-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      <Monitor className="w-5 h-5" />
                      Active Sessions
                    </h3>
                    <div className="space-y-3">
                      {loadingSessions ? (
                        // Loading skeleton
                        [1, 2].map((item) => (
                          <div key={item} className={`p-3 rounded-lg animate-pulse ${
                            isDark ? 'bg-gray-900/50' : 'bg-stone-50'
                          }`}>
                            <div className={`h-5 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-stone-200'}`} />
                            <div className={`h-4 w-2/3 rounded ${isDark ? 'bg-gray-700' : 'bg-stone-200'}`} />
                          </div>
                        ))
                      ) : activeSessions.length === 0 ? (
                        // Empty state
                        <div className={`p-6 text-center rounded-lg ${
                          isDark ? 'bg-gray-900/30' : 'bg-stone-50'
                        }`}>
                          <Monitor className={`w-12 h-12 mx-auto mb-2 ${
                            isDark ? 'text-gray-600' : 'text-stone-400'
                          }`} />
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                            No active sessions
                          </p>
                        </div>
                      ) : (
                        // Real data
                        activeSessions.map((session) => (
                          <div key={session.id} className={`p-3 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-stone-50'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                    {session.platform} · {session.browser}
                                  </span>
                                  {session.is_current && (
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                                  {session.ip_address} · {session.location || 'Unknown'}
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                                  Last active: {formatRelativeTime(session.last_activity)}
                                </p>
                              </div>
                              {!session.is_current && (
                                <button
                                  type="button"
                                  onClick={() => handleRevokeSession(session.id)}
                                  disabled={loadingSessions}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    isDark 
                                      ? 'text-red-400 hover:bg-red-500/20 disabled:opacity-50' 
                                      : 'text-red-600 hover:bg-red-50 disabled:opacity-50'
                                  }`}
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className={`p-6 rounded-2xl border ${
                    isDark ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${
                      isDark ? 'text-red-400' : 'text-red-700'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-red-300/70' : 'text-red-600/70'}`}>
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    
                    <div className={`p-4 rounded-xl mb-4 ${
                      isDark ? 'bg-red-950/30 border border-red-500/20' : 'bg-red-100/50 border border-red-300'
                    }`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`} />
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            isDark ? 'text-red-300' : 'text-red-700'
                          }`}>
                            Warning: This action cannot be undone
                          </h4>
                          <ul className={`text-sm space-y-1 ${
                            isDark ? 'text-red-300/80' : 'text-red-600/80'
                          }`}>
                            <li>• All your data will be permanently deleted</li>
                            <li>• Your profile and content will be removed</li>
                            <li>• You will lose access to all services</li>
                            <li>• This action is irreversible</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDeleteAccountModal(true)}
                      className={`
                        w-full px-4 py-3 rounded-xl font-medium transition-all duration-300
                        flex items-center justify-center gap-2
                        ${isDark 
                          ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500/30 shadow-lg shadow-red-500/20' 
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'}
                      `}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Delete My Account
                    </button>
                  </div>
                </>
              )}
              
              {/* Success/Error Messages */}
              {(successMessage || errorMessage) && (
                <div className="space-y-3">
                  {successMessage && (
                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-green-50 border-green-200 text-green-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {successMessage}
                      </div>
                    </div>
                  )}
                  {errorMessage && (
                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {errorMessage}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Submit Button - Only show for non-security sections */}
              {activeSection !== 'security' && (
                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${loading
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      }
                      text-white shadow-lg hover:shadow-xl
                      flex items-center justify-center gap-2
                    `}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className={`
                      px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                      ${isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                    `}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Disable 2FA Confirmation Modal */}
      {showDisable2FAModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDisable2FAModal(false);
              setDisablePassword('');
              setErrorMessage('');
            }}
          />
          
          {/* Modal */}
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-stone-200'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    Disable Two-Factor Authentication
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                    This will reduce your account security
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Warning */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDark ? 'text-red-300' : 'text-red-900'}`}>
                      Security Warning
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-red-200/80' : 'text-red-800'}`}>
                      Disabling 2FA will make your account more vulnerable to unauthorized access. 
                      Your recovery codes will also be deleted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className={`p-3 rounded-lg border ${
                  isDark ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {errorMessage}
                </div>
              )}

              {/* Password Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-stone-700'
                }`}>
                  Confirm Your Password
                </label>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`
                    w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDark 
                      ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-red-400/50' 
                      : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-red-400'}
                    focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-red-400/20' : 'focus:ring-red-400/20'}
                  `}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && disablePassword) {
                      handleDisable2FA();
                    }
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'} flex gap-3`}>
              <button
                type="button"
                onClick={() => {
                  setShowDisable2FAModal(false);
                  setDisablePassword('');
                  setErrorMessage('');
                }}
                disabled={loading}
                className={`
                  flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-300
                  ${isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisable2FA}
                disabled={loading || !disablePassword}
                className={`
                  flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-300
                  ${isDark 
                    ? 'bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30' 
                    : 'bg-red-600 text-white hover:bg-red-700'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {loading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteAccountModal(false);
              setDeleteConfirmText('');
              setDeleteAccountPassword('');
              setErrorMessage('');
            }}
          />

          {/* Modal */}
          <div className={`
            relative w-full max-w-md rounded-2xl overflow-hidden animate-scale-in
            ${isDark ? 'bg-gray-900' : 'bg-white'}
            shadow-2xl
          `}>
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-stone-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  Delete Account
                </h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                This action cannot be undone
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Warning List */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-red-500/5 border border-red-500/20' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-red-400' : 'text-red-700'
                }`}>
                  The following will be permanently deleted:
                </p>
                <ul className={`text-sm space-y-2 ${
                  isDark ? 'text-gray-400' : 'text-stone-600'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>All personal data and content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Profile and portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Access to all services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Active subscriptions</span>
                  </li>
                </ul>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                  isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-700'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Confirmation Text */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-stone-700'
                }`}>
                  Type <span className={`font-mono px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-gray-800 text-red-400' : 'bg-stone-100 text-red-600'
                  }`}>DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => {
                    setDeleteConfirmText(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Type DELETE"
                  className={`
                    w-full px-4 py-2.5 rounded-lg transition-all font-mono text-sm
                    ${isDark 
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500' 
                      : 'bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:border-red-500'}
                    focus:outline-none focus:ring-2 focus:ring-red-500/20
                  `}
                  autoFocus
                />
              </div>

              {/* Password Confirmation */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-stone-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deleteAccountPassword}
                    onChange={(e) => {
                      setDeleteAccountPassword(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Enter your password"
                    className={`
                      w-full pl-4 pr-10 py-2.5 rounded-lg transition-all text-sm
                      ${isDark 
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500' 
                        : 'bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:border-red-500'}
                      focus:outline-none focus:ring-2 focus:ring-red-500/20
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-gray-500 hover:text-gray-300' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDark ? 'border-gray-800' : 'border-stone-200'} flex gap-3`}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmText('');
                  setDeleteAccountPassword('');
                  setErrorMessage('');
                }}
                disabled={loading}
                className={`
                  flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm
                  ${isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmText !== 'DELETE') {
                    setErrorMessage('Please type DELETE to confirm');
                    return;
                  }
                  if (!deleteAccountPassword) {
                    setErrorMessage('Please enter your password');
                    return;
                  }
                  // Handle delete account here
                  showError('Account Deletion', 'This feature will be implemented soon');
                }}
                disabled={loading || deleteConfirmText !== 'DELETE' || !deleteAccountPassword}
                className={`
                  flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm
                  flex items-center justify-center gap-2
                  ${loading || deleteConfirmText !== 'DELETE' || !deleteAccountPassword
                    ? isDark
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        /* Hide scrollbar for mobile tabs */}
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

