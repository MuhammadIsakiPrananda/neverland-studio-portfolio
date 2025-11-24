import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Save, Smartphone, Trash2, Monitor, Globe, LogOut, Copy, Check } from 'lucide-react';
import QRCode from "react-qr-code";
import { SettingsCard } from './SettingsCard';
import { DeleteAccountModal } from './DeleteAccountModal'; // Impor modal
import { useNotification } from './useNotification'; // Impor notifikasi

export const SecurityTabContent: React.FC<any> = ({
  handlePasswordChangeSubmit,
  passwordData,
  handlePasswordInputChange,
  passwordErrors,
  isLoading,
  is2faEnabled,
  isSettingUp2FA,
  setIsSettingUp2FA,
  handleEnable2FA,
  handleDisable2FA,
  totp,
  twoFactorCode,
  setTwoFactorCode,
  handleVerify2FA,
  // Props baru untuk sesi
  sessions,
  handleSignOutSession,
  handleSignOutAllOtherSessions,
}) => {
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  // State untuk modal dan proses penghapusan
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fungsi untuk menangani konfirmasi penghapusan
  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    // Simulasi panggilan API
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      addNotification('Account Deleted', 'Your account has been permanently deleted.', 'error');
    }, 2000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++; // Uppercase
    if (/[0-9]/.test(password)) score++; // Number
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special character
    return score;
  };

  const strength = getPasswordStrength(passwordData.newPassword);
  const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Excellent'][strength];
  const strengthColor = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-500'][strength];

  return (
    <>
      <form onSubmit={handlePasswordChangeSubmit} className="space-y-8">
      <SettingsCard
        title="Change Password"
        description="Update your password for enhanced security. Use a strong, unique password."
        footer={
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span className="font-semibold">{isLoading ? 'Saving...' : 'Update Password'}</span>
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">Current Password</label>
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} className={`w-full bg-slate-800/60 border rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors ${passwordErrors.currentPassword ? 'border-red-500/50' : 'border-slate-700'}`} />
            {passwordErrors.currentPassword && <p className="text-xs text-red-400 mt-1.5">{passwordErrors.currentPassword}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">New Password</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} className={`w-full bg-slate-800/60 border rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors ${passwordErrors.newPassword ? 'border-red-500/50' : 'border-slate-700'}`} />
            {passwordErrors.newPassword && <p className="text-xs text-red-400 mt-1.5">{passwordErrors.newPassword}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} className={`w-full bg-slate-800/60 border rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors ${passwordErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-700'}`} />
            {passwordErrors.confirmPassword && <p className="text-xs text-red-400 mt-1.5">{passwordErrors.confirmPassword}</p>}
          </div>
          {passwordData.newPassword && (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${strengthColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(strength / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs text-slate-400 w-24 text-right font-medium">{strengthText}</span>
            </div>
          )}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account during login."
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Authenticator App</p>
            <p className={`text-sm ${is2faEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
              {is2faEnabled ? 'Enabled' : 'Not configured'}
            </p>
          </div>
          <button 
            type="button" 
            onClick={is2faEnabled ? handleDisable2FA : handleEnable2FA} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${is2faEnabled ? 'bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'}`}
          >
            {is2faEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
        <AnimatePresence>
          {isSettingUp2FA && totp && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-slate-800 pt-6"
            >
              <p className="text-sm text-slate-300 mb-4">1. Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-white rounded-lg">
                  <QRCode value={totp.toString()} size={160} />
                </div>
                <div className="w-full space-y-4">
                  <p className="text-sm text-slate-300">Or manually enter this setup key:</p>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={totp.secret.base32}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-slate-300 font-mono text-sm"
                    />
                    <button type="button" onClick={() => copyToClipboard(totp.secret.base32)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white">
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-slate-300">2. Enter the 6-digit code from your app to verify.</p>
                  <form onSubmit={handleVerify2FA} className="space-y-4">
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        maxLength={6}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white tracking-[0.5em] text-center focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-lg font-semibold text-sm">Verify & Enable</button>
                      <button type="button" onClick={() => setIsSettingUp2FA(false)} className="w-full bg-slate-700 text-slate-300 py-2 rounded-lg font-semibold hover:bg-slate-600 text-sm">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SettingsCard>

      <SettingsCard
        title="Active Sessions"
        description="This is a list of devices that have logged into your account. Revoke any sessions you do not recognize."
        footer={
          sessions.length > 1 && (
            <div className="flex justify-end">
              <button onClick={handleSignOutAllOtherSessions} className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign out all other sessions</span>
              </button>
            </div>
          )
        }
      >
        <ul className="divide-y divide-slate-800 -mx-6">
          <AnimatePresence initial={false}>
            {sessions.map((session: any) => (
              <motion.li 
                key={session.id} 
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, x: -300, transition: { duration: 0.3 } }}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  {session.device.includes('Windows') ? <Monitor className="w-6 h-6 text-slate-400" /> : <Smartphone className="w-6 h-6 text-slate-400" />}
                  <div>
                    <p className="font-semibold text-white">{session.device} &middot; <span className="font-normal text-slate-300">{session.browser}</span></p>
                    <p className="text-sm text-slate-400 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> {session.location} &middot; {session.isCurrent ? <span className="text-emerald-400 font-semibold">Active now</span> : formatTimeAgo(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button onClick={() => handleSignOutSession(session.id)} className="text-sm text-red-400 hover:text-red-300 hover:underline">Sign out</button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </SettingsCard>

      <SettingsCard
        title="Danger Zone"
        description="Permanently delete your account and all of its content. This action is irreversible."
        border="border-red-500/30"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-white">Delete Account</p>
            <p className="text-sm text-slate-400 mt-1">Once you delete your account, there is no going back.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Delete my account
          </button>
        </div>
      </SettingsCard>
      </form>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};