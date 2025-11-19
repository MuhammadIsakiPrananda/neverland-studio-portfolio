import { useState, useRef, useEffect, useCallback } from 'react';
import { Edit, Save, Camera, Loader, ShieldCheck, Moon, Sun, Smartphone, QrCode, Monitor, Globe, LogIn, ShieldAlert, LogOut, ArrowLeft, Trash2, AlertTriangle, User, Palette, Github, Linkedin, Twitter, Download, CreditCard, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from './useNotification';

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

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; id: string; }> = ({ checked, onChange, name, id }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" id={id} name={name} className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
  </label>
);

const ProfileEdit: React.FC<{ formData: UserData; onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; }> = ({ formData, onInputChange }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-slate-400">Full Name</label>
      <input type="text" name="name" value={formData.name} onChange={onInputChange} className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" />
    </div>
    <div>
      <label className="text-sm font-medium text-slate-400">Username</label>
      <input type="text" name="username" value={formData.username} onChange={onInputChange} className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" />
    </div>
    <div>
      <label className="text-sm font-medium text-slate-400">Email Address</label>
      <input type="email" name="email" value={formData.email} onChange={onInputChange} className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" />
    </div>
    <div>
      <label className="text-sm font-medium text-slate-400">Bio</label>
      <textarea name="bio" value={formData.bio || ''} onChange={onInputChange} rows={3} className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" placeholder="Tell us a little about yourself..."/>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">Social Links</label>
      <div className="relative"><Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" name="socials.github" value={formData.socials?.github || ''} onChange={onInputChange} placeholder="github.com/username" className="w-full bg-slate-900/70 border border-slate-600 rounded-lg pl-9 pr-3 py-2 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" /></div>
      <div className="relative"><Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" name="socials.linkedin" value={formData.socials?.linkedin || ''} onChange={onInputChange} placeholder="linkedin.com/in/username" className="w-full bg-slate-900/70 border border-slate-600 rounded-lg pl-9 pr-3 py-2 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" /></div>
      <div className="relative"><Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" name="socials.twitter" value={formData.socials?.twitter || ''} onChange={onInputChange} placeholder="twitter.com/username" className="w-full bg-slate-900/70 border border-slate-600 rounded-lg pl-9 pr-3 py-2 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none transition-colors" /></div>
    </div>
  </div>
);

interface AppSettings {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const SettingsCard: React.FC<{ 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  footer?: React.ReactNode;
}> = ({ title, description, children, footer }) => (
  <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl shadow-sm">
    <div className="p-6 border-b border-slate-700/80">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
    <div className="p-6">{children}</div>
    {footer && <div className="bg-slate-800/70 px-6 py-4 border-t border-slate-700/80 rounded-b-xl">{footer}</div>}
  </div>
);

const ProfileTabContent: React.FC<{
  appSettings: AppSettings;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ appSettings, onThemeChange, onSettingsChange }) => (
  <div className="space-y-6">
    <SettingsCard title="Appearance" description="Customize how the application looks and feels.">
        <div className="flex items-center gap-4">
            <button onClick={() => onThemeChange('light')} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors w-full justify-center ${appSettings.theme === 'light' ? 'border-cyan-500 bg-slate-700/50' : 'border-slate-700 hover:border-slate-600'}`}>
                <Sun className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Light</span>
            </button>
            <button onClick={() => onThemeChange('dark')} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors w-full justify-center ${appSettings.theme === 'dark' ? 'border-cyan-500 bg-slate-700/50' : 'border-slate-700 hover:border-slate-600'}`}>
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">Dark</span>
            </button>
        </div>
    </SettingsCard>

    <SettingsCard title="Notifications" description="Manage how you receive notifications.">
        <div className="space-y-5">
            <label htmlFor="emailNotifications" className="flex items-center justify-between cursor-pointer">
                <div>
                    <p className="font-medium text-slate-200">Email Notifications</p>
                    <p className="text-sm text-slate-400">Receive updates in your inbox.</p>
                </div>
                <ToggleSwitch id="emailNotifications" name="emailNotifications" checked={appSettings.emailNotifications} onChange={onSettingsChange} />
            </label>
            <div className="border-t border-slate-700/60"></div>
            <label htmlFor="pushNotifications" className="flex items-center justify-between cursor-pointer">
                <div>
                    <p className="font-medium text-slate-200">Push Notifications</p>
                    <p className="text-sm text-slate-400">Get real-time alerts on your device.</p>
                </div>
                <ToggleSwitch id="pushNotifications" name="pushNotifications" checked={appSettings.pushNotifications} onChange={onSettingsChange} />
            </label>
        </div>
    </SettingsCard>
  </div>
);

const AccountTabContent: React.FC = () => {
  const invoices = [
    { id: 'INV-2024-003', date: 'May 1, 2024', amount: '$25.00', status: 'Paid' },
    { id: 'INV-2024-002', date: 'April 1, 2024', amount: '$25.00', status: 'Paid' },
    { id: 'INV-2024-001', date: 'March 1, 2024', amount: '$25.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Current Plan" description="You are currently on the Pro Plan.">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-2xl font-bold text-white">$25 <span className="text-base font-normal text-slate-400">/ month</span></h4>
            <p className="text-sm text-slate-400 mt-1">Your next billing date is June 1, 2024.</p>
          </div>
          <button className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors">Manage Subscription</button>
        </div>
      </SettingsCard>
      <SettingsCard title="Billing History" description="Download your past invoices.">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-sm text-slate-400">
              <th className="py-2 font-medium">Invoice</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-b border-slate-800 text-sm">
                <td className="py-3 text-slate-200 font-medium">{invoice.id}</td>
                <td className="py-3">{invoice.date}</td>
                <td className="py-3">{invoice.amount}</td>
                <td className="py-3 text-right"><button className="p-2 text-slate-400 hover:text-cyan-400"><Download className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsCard>
    </div>
  );
};

const SecurityTabContent: React.FC<any> = ({
  handlePasswordChangeSubmit, passwordData, handlePasswordInputChange, passwordErrors, isLoading, setIsSettingUp2FA,
  isSettingUp2FA, is2faEnabled, handleDisable2FA, handleEnable2FA, handleVerify2FA, twoFactorCode, setTwoFactorCode,
  sessions, handleSignOutAllOtherSessions, handleSignOutSession,
  loginHistory,
  setIsDeleteModalOpen
}) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(passwordData.newPassword);
  const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Excellent'][strength];
  const strengthColor = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'][strength];

  return (
    <div className="space-y-6">
    <SettingsCard 
      title="Change Password" 
      description="For your security, we recommend choosing a password that you don't use for any other online account."
      footer={
        <div className="flex justify-end">
          <button type="submit" form="password-change-form" disabled={isLoading} className="flex items-center justify-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            <span className="font-semibold">{isLoading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      }
    >
      <form id="password-change-form" onSubmit={handlePasswordChangeSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-400">Current Password</label>
          <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} className={`w-full bg-slate-900/70 border rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none ${passwordErrors.currentPassword ? 'border-red-500/50' : 'border-slate-600'}`} />
          {passwordErrors.currentPassword && <p className="text-xs text-red-400 mt-1">{passwordErrors.currentPassword}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-400">New Password</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} className={`w-full bg-slate-900/70 border rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none ${passwordErrors.newPassword ? 'border-red-500/50' : 'border-slate-600'}`} />
          {passwordErrors.newPassword && <p className="text-xs text-red-400 mt-1">{passwordErrors.newPassword}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} className={`w-full bg-slate-900/70 border rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-cyan-500/50 outline-none ${passwordErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-600'}`} />
          {passwordErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{passwordErrors.confirmPassword}</p>}
        </div>
        {passwordData.newPassword && (
          <div className="flex items-center gap-2 pt-1">
            <div className="w-full bg-slate-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${strengthColor}`} style={{ width: `${(strength / 5) * 100}%` }}></div></div>
            <span className="text-xs text-slate-400 w-24 text-right">{strengthText}</span>
          </div>
        )}
      </form>
    </SettingsCard>

    <SettingsCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
      {!isSettingUp2FA ? (
        <div className="flex items-center justify-between">
          <p className="font-medium text-white">Status: <span className={is2faEnabled ? 'text-green-400' : 'text-slate-400'}>{is2faEnabled ? 'Enabled' : 'Disabled'}</span></p>
          {is2faEnabled ? (
            <button onClick={handleDisable2FA} className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors">Disable</button>
          ) : (
            <button onClick={handleEnable2FA} className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-500/30 transition-colors">Enable</button>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="p-3 bg-white rounded-lg"><QrCode className="w-32 h-32 text-black" /></div>
              <form onSubmit={handleVerify2FA} className="space-y-4 w-full">
                <p className="text-sm text-slate-300">Scan the QR code, then enter the 6-digit code from your authenticator app.</p>
                <div className="relative"><Smartphone className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" /><input type="text" placeholder="6-digit code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} maxLength={6} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white tracking-[0.5em] text-center focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors" /></div>
                <div className="flex gap-2">
                  <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-lg font-semibold">Verify</button>
                  <button type="button" onClick={() => setIsSettingUp2FA(false)} className="w-full bg-slate-700 text-slate-300 py-2 rounded-lg font-semibold hover:bg-slate-600">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </SettingsCard>

    <SettingsCard title="Active Sessions" description="This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.">
      {sessions.length > 1 && (
        <div className="flex justify-end mb-4">
          <button onClick={handleSignOutAllOtherSessions} className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sign out all other sessions</span>
          </button>
        </div>
      )}
      <ul className="space-y-3">
        <AnimatePresence>
          {sessions.map((session: any) => (
            <motion.li key={session.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                {session.icon}
                <div>
                  <p className="font-semibold text-white">{session.device} &middot; <span className="font-normal">{session.browser}</span></p>
                  <p className="text-sm text-slate-400 flex items-center gap-1.5"><Globe className="w-3 h-3" /> {session.location} &middot; {session.isCurrent ? <span className="text-green-400 font-semibold">{session.lastActive}</span> : session.lastActive}</p>
                </div>
              </div>
              {!session.isCurrent && <button onClick={() => handleSignOutSession(session.id)} className="text-sm text-red-400 hover:text-red-300 hover:underline">Sign out</button>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </SettingsCard>

    <SettingsCard title="Login History" description="A record of recent login activity on your account.">
      <ul className="space-y-3">
        {loginHistory.map((entry: any) => (
          <motion.li key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: entry.id * 0.05 }} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-4">
              {entry.status === 'success' ? <LogIn className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
              <div>
                <p className={`font-semibold text-white`}>{entry.status === 'success' ? 'Successful login' : 'Failed login attempt'}</p>
                <p className="text-sm text-slate-400">{entry.device} &middot; IP: {entry.ip}</p>
              </div>
            </div>
            <span className="text-sm text-slate-500 flex-shrink-0 ml-4">{entry.time}</span>
          </motion.li>
        ))}
      </ul>
    </SettingsCard>

    <div className="border-t border-red-500/20 pt-6">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <div className="p-6 bg-red-900/20 rounded-lg border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <p className="font-medium text-slate-200">Delete Account</p>
                <p className="text-sm text-slate-400 mt-1">Once you delete your account, all of your data will be permanently lost. This action is irreversible.</p>
            </div>
            <button onClick={() => setIsDeleteModalOpen(true)} className="flex-shrink-0 flex items-center gap-2 bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete my account
            </button>
        </div>
    </div>
  </div>
  );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateProfile, onClose, onDeleteAccount }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  
  const initialSessions = [
    { id: 1, isCurrent: true, device: 'Windows', browser: 'Chrome', location: 'Malang, Indonesia', lastActive: 'Active now', icon: <Monitor className="w-6 h-6 text-slate-400" /> },
    { id: 2, isCurrent: false, device: 'iPhone 14 Pro', browser: 'Safari', location: 'Surabaya, Indonesia', lastActive: '2 hours ago', icon: <Smartphone className="w-6 h-6 text-slate-400" /> },
    { id: 3, isCurrent: false, device: 'Macbook Pro', browser: 'Arc', location: 'Jakarta, Indonesia', lastActive: '1 day ago', icon: <Monitor className="w-6 h-6 text-slate-400" /> },
  ];

  const [sessions, setSessions] = useState(initialSessions);

  const loginHistory = [
    { id: 1, status: 'success', device: 'Windows, Chrome', ip: '103.22.11.5', time: 'May 20, 2024, 10:30 PM' },
    { id: 2, status: 'failed', device: 'Unknown, Firefox', ip: '114.10.99.1', time: 'May 20, 2024, 10:28 PM' },
    { id: 3, status: 'success', device: 'iPhone 14 Pro, Safari', ip: '182.1.20.44', time: 'May 20, 2024, 8:15 PM' },
    { id: 4, status: 'success', device: 'Macbook Pro, Arc', ip: '125.166.3.21', time: 'May 19, 2024, 11:05 AM' },
  ];

  const handleSignOutSession = (sessionId: number) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    addNotification('Session Signed Out', 'The selected session has been signed out.', 'info');
  };

  const handleSignOutAllOtherSessions = () => {
    setSessions(prev => prev.filter(session => session.isCurrent));
    addNotification('Signed Out Everywhere Else', 'You have been signed out from all other devices.', 'success');
  };

  useEffect(() => {
    setSessions(initialSessions);
  }, [user]);

  const [appSettings, setAppSettings] = useState({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
    emailNotifications: true,
    pushNotifications: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(user);
    setAvatarPreview(null);
    setActiveSection('profile');
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(appSettings.theme === 'dark' ? 'light' : 'dark');
    root.classList.add(appSettings.theme);
    localStorage.setItem('theme', appSettings.theme);
  }, [appSettings.theme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setCoverPhotoPreview(previewUrl);
    }
  };

  const handleSaveChanges = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...formData,
        avatar: avatarPreview || user.avatar,
        coverPhoto: coverPhotoPreview || user.coverPhoto,
      };
      onUpdateProfile(updatedUser);
      setIsLoading(false);
      setIsEditing(false);
      addNotification('Profile Updated', 'Your profile has been successfully updated.', 'success');
    }, 1500);
  }, [formData, avatarPreview, coverPhotoPreview, user.avatar, user.coverPhoto, onUpdateProfile, addNotification]);
  
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormData(user);
    setAvatarPreview(null);
    setCoverPhotoPreview(null);
  }, [user]);

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required.';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required.';
    else if (passwordData.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters.';
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData]);

  const validUsers = [
    { name: 'Admin', username: 'admin', email: 'admin@example.com', password: 'admin', avatar: null },
    { name: 'Test User', username: 'testuser', email: 'test@example.com', password: 'password', avatar: null },
    { name: 'Jane Doe', username: 'janedoe', email: 'user@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=user@example.com' },
  ];

  const handlePasswordChangeSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const currentUserInDb = validUsers.find(u => u.username === user.username);

      if (currentUserInDb && currentUserInDb.password === passwordData.currentPassword) {
        addNotification('Password Updated', 'Your password has been changed successfully.', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
      } else {
        setPasswordErrors({ currentPassword: 'Your current password is not correct.' });
        addNotification('Update Failed', 'Please check your current password and try again.', 'error');
      }
      setIsLoading(false);
    }, 1500);
  }, [validatePasswordForm, user.username, passwordData, addNotification]);

  const handleEnable2FA = () => {
    setIsSettingUp2FA(true);
  };

  const handleDisable2FA = () => {
    setIs2faEnabled(false);
    addNotification('2FA Disabled', 'Two-factor authentication has been disabled.', 'warning');
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length === 6 && /^\d+$/.test(twoFactorCode)) {
      addNotification('2FA Enabled', 'Two-factor authentication has been successfully enabled.', 'success');
      setIs2faEnabled(true);
      setIsSettingUp2FA(false);
      setTwoFactorCode('');
    } else {
      addNotification('Verification Failed', 'Please enter a valid 6-digit code.', 'error');
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAppSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setAppSettings(p => ({...p, theme}));
  };

  const handleAccountDeletion = useCallback(() => {
    if (deleteConfirmationInput !== user.username) {
      addNotification('Confirmation Failed', 'The username you entered is incorrect.', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      addNotification('Account Deleted', 'Your account has been permanently deleted.', 'success');
      setIsLoading(false);
      onDeleteAccount();
    }, 2000);
  }, [deleteConfirmationInput, user.username, addNotification, onDeleteAccount]);

  const calculateProfileCompletion = useCallback(() => {
    let score = 0;
    const total = 5;
    if (user.avatar || avatarPreview) score++;
    if (user.bio) score++;
    if (user.coverPhoto || coverPhotoPreview) score++;
    if (user.socials && (user.socials.github || user.socials.linkedin || user.socials.twitter)) score++;
    score++;
    return (score / total) * 100;
  }, [user, avatarPreview, coverPhotoPreview]);

  const profileCompletion = calculateProfileCompletion();

  const currentAvatar = avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=0d9488&color=fff&size=128`;
  const currentCover = coverPhotoPreview || user.coverPhoto || 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2070&auto=format&fit=crop';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-5xl h-[80vh] mx-auto bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-700 text-white flex overflow-hidden"
      >
        <aside className="w-1/4 min-w-[240px] bg-slate-900/30 border-r border-slate-700/80 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <img src={currentAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-slate-100">{user.name}</h2>
              <p className="text-sm text-slate-400">@{user.username}</p>
            </div>
          </div>
          <nav className="flex-grow space-y-2">
            <button onClick={() => setActiveSection('profile')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'profile' ? 'bg-slate-700/50 text-slate-100' : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'}`}>
              <User className="w-5 h-5" /> Profile
            </button>
            <button onClick={() => setActiveSection('security')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'security' ? 'bg-slate-700/50 text-slate-100' : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'}`}>
              <ShieldCheck className="w-5 h-5" /> Security
            </button>
            <button onClick={() => setActiveSection('account')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'account' ? 'bg-slate-700/50 text-slate-100' : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'}`}>
              <CreditCard className="w-5 h-5" /> Account & Billing
            </button>
            <button onClick={() => setActiveSection('appearance')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'appearance' ? 'bg-slate-700/50 text-slate-100' : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'}`}>
              <Palette className="w-5 h-5" /> Appearance
            </button>
          </nav>
          <button onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2 mt-auto rounded-md text-sm font-medium text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Close
          </button>
        </aside>

        <main className="w-3/4 flex-1 p-8 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div className="relative">
                    <img src={currentCover} alt="Cover" className="h-48 w-full object-cover rounded-xl" />
                    {isEditing && (
                      <button onClick={() => coverPhotoInputRef.current?.click()} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors">
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    )}
                    <input type="file" ref={coverPhotoInputRef} onChange={handleCoverPhotoChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                    <div className="absolute -bottom-12 left-8">
                      <div className="relative group">
                        <img className="w-28 h-28 rounded-full object-cover border-4 border-slate-800" src={currentAvatar} alt="User avatar" />
                        {isEditing && (
                          <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera className="w-8 h-8 text-white" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                  <div className="pt-14 px-8 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                      <p className="text-slate-400">@{user.username}</p>
                      {user.bio && !isEditing && <p className="text-slate-300 mt-2 max-w-lg">{user.bio}</p>}
                      {!isEditing && user.socials && (
                        <div className="flex gap-4 mt-3">
                          {user.socials.github && <a href={`https://${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><Github /></a>}
                          {user.socials.linkedin && <a href={`https://${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><Linkedin /></a>}
                          {user.socials.twitter && <a href={`https://${user.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white"><Twitter /></a>}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-semibold">
                        <Edit className="w-4 h-4" /> Edit Profile
                      </button>
                    )}
                  </div>
                  <div className="px-8">
                    <SettingsCard 
                      title={isEditing ? "Edit Profile Details" : "Profile Completion"}
                      description={isEditing ? "This information will be displayed publicly on your profile." : "Complete your profile to get the most out of our platform."}
                      footer={isEditing && (
                        <div className="flex justify-end gap-3">
                          <button onClick={handleCancel} disabled={isLoading} className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-semibold disabled:opacity-50">Cancel</button>
                          <button onClick={handleSaveChanges} disabled={isLoading} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50">
                            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="font-semibold">{isLoading ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      )}
                    >
                      {isEditing ? (
                        <ProfileEdit formData={formData} onInputChange={handleInputChange} />
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-300">Profile Progress</span>
                            <span className="text-sm font-bold text-cyan-400">{Math.round(profileCompletion)}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                          </div>
                        </div>
                      )}
                    </SettingsCard>
                  </div>
                </div>
              )}
              {activeSection === 'account' && (
                <AccountTabContent />
              )}
              {activeSection === 'security' && (
                <SecurityTabContent 
                  handlePasswordChangeSubmit={handlePasswordChangeSubmit}
                  passwordData={passwordData}
                  handlePasswordInputChange={handlePasswordInputChange}
                  setIsSettingUp2FA={setIsSettingUp2FA}
                  passwordErrors={passwordErrors}
                  isLoading={isLoading}
                  isSettingUp2FA={isSettingUp2FA}
                  is2faEnabled={is2faEnabled}
                  handleDisable2FA={handleDisable2FA}
                  handleEnable2FA={handleEnable2FA}
                  handleVerify2FA={handleVerify2FA}
                  twoFactorCode={twoFactorCode}
                  setTwoFactorCode={setTwoFactorCode}
                  sessions={sessions}
                  handleSignOutAllOtherSessions={handleSignOutAllOtherSessions}
                  handleSignOutSession={handleSignOutSession}
                  loginHistory={loginHistory}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                />
              )}
              {activeSection === 'appearance' && (
                <ProfileTabContent 
                  appSettings={appSettings} 
                  onThemeChange={handleThemeChange} 
                  onSettingsChange={handleSettingsChange} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Are you absolutely sure?</h2>
                  <p className="text-slate-400 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-slate-300 my-4">
                To confirm, please type your username <strong className="text-cyan-400">{user.username}</strong> in the box below.
              </p>
              <input 
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 text-center focus:border-red-500 focus:ring-red-500/50 outline-none"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading} className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-semibold disabled:opacity-50">
                  Cancel
                </button>
                <button 
                  onClick={handleAccountDeletion} 
                  disabled={deleteConfirmationInput !== user.username || isLoading}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 transition-colors text-sm font-semibold text-white disabled:opacity-50 disabled:bg-red-600/50"
                >
                  {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDashboard;