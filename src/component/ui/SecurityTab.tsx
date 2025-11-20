import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ShieldCheck, Smartphone, QrCode, LogOut, Globe, Trash2 } from 'lucide-react';

export const SecurityTabContent: React.FC<any> = ({
  handlePasswordChangeSubmit, passwordData, handlePasswordInputChange, passwordErrors, isLoading, setIsSettingUp2FA,
  isSettingUp2FA, is2faEnabled, handleDisable2FA, handleEnable2FA, handleVerify2FA, twoFactorCode, setTwoFactorCode,
  sessions, handleSignOutAllOtherSessions, handleSignOutSession,
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
    <div className="divide-y divide-gray-800">
      {/* Change Password Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          <p className="mt-1 text-sm text-slate-400">Update your password for enhanced security. Use a strong, unique password.</p>
        </div>
        <div className="md:col-span-2">
          <form id="password-change-form" onSubmit={handlePasswordChangeSubmit} className="space-y-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div>
              <label className="text-sm font-medium text-slate-400">Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} className={`w-full bg-gray-800 border rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/50 outline-none ${passwordErrors.currentPassword ? 'border-red-500/50' : 'border-gray-700'}`} />
              {passwordErrors.currentPassword && <p className="text-xs text-red-400 mt-1">{passwordErrors.currentPassword}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} className={`w-full bg-gray-800 border rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/50 outline-none ${passwordErrors.newPassword ? 'border-red-500/50' : 'border-gray-700'}`} />
              {passwordErrors.newPassword && <p className="text-xs text-red-400 mt-1">{passwordErrors.newPassword}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} className={`w-full bg-gray-800 border rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/50 outline-none ${passwordErrors.confirmPassword ? 'border-red-500/50' : 'border-gray-700'}`} />
              {passwordErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{passwordErrors.confirmPassword}</p>}
            </div>
            {passwordData.newPassword && (
              <div className="flex items-center gap-2 pt-1">
                <div className="w-full bg-gray-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${strengthColor}`} style={{ width: `${(strength / 5) * 100}%` }}></div></div>
                <span className="text-xs text-slate-400 w-24 text-right">{strengthText}</span>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button type="submit" form="password-change-form" disabled={isLoading} className="flex items-center justify-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                <span className="font-semibold">{isLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
          <p className="mt-1 text-sm text-slate-400">Add an extra layer of security to your account during login.</p>
        </div>
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          {!isSettingUp2FA ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Status: <span className={is2faEnabled ? 'text-green-400' : 'text-slate-400'}>{is2faEnabled ? 'Enabled' : 'Disabled'}</span></p>
              </div>
              {is2faEnabled ? (
                <button onClick={handleDisable2FA} className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors">Disable</button>
              ) : (
                <button onClick={handleEnable2FA} className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-colors">Enable</button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-3 bg-white rounded-lg"><QrCode className="w-32 h-32 text-black" /></div>
                  <form onSubmit={handleVerify2FA} className="space-y-4 w-full">
                    <p className="text-sm text-slate-300">Scan the QR code, then enter the 6-digit code from your authenticator app.</p>
                    <div className="relative"><Smartphone className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" /><input type="text" placeholder="6-digit code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} maxLength={6} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white tracking-[0.5em] text-center focus:border-blue-500 focus:ring-blue-500/50 focus:outline-none transition-colors" /></div>
                    <div className="flex gap-2">
                      <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-2 rounded-lg font-semibold">Verify</button>
                      <button type="button" onClick={() => setIsSettingUp2FA(false)} className="w-full bg-gray-700 text-slate-300 py-2 rounded-lg font-semibold hover:bg-gray-600">Cancel</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
          <p className="mt-1 text-sm text-slate-400">This is a list of devices that have logged into your account. Revoke any sessions you do not recognize.</p>
        </div>
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl">
          {sessions.length > 1 && (
            <div className="p-4 flex justify-end border-b border-gray-800">
              <button onClick={handleSignOutAllOtherSessions} className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign out all other sessions</span>
              </button>
            </div>
          )}
          <ul className="divide-y divide-gray-800">
            <AnimatePresence>
              {sessions.map((session: any) => (
                <motion.li key={session.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }} className="flex items-center justify-between p-4">
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
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
          <p className="mt-1 text-sm text-slate-400">Irreversible and destructive actions.</p>
        </div>
        <div className="md:col-span-2 bg-gray-900 border border-red-500/30 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-white">Delete Account</p>
            <p className="text-sm text-slate-400 mt-1 max-w-lg">Once you delete your account, all of your data will be permanently lost. This action is irreversible.</p>
          </div>
          <button onClick={() => setIsDeleteModalOpen(true)} className="flex-shrink-0 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
};