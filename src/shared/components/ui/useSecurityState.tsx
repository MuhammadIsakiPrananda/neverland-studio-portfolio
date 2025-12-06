import React, { useState, useCallback, useEffect } from 'react'; // NOSONAR
import { useNotification } from './useNotification';
import * as OTPAuth from 'otpauth';

// This data should ideally be fetched or live outside the component
const initialSessions = [
  { id: 1, isCurrent: true, device: 'Windows', browser: 'Chrome', location: 'Malang, Indonesia', lastActive: new Date(), icon: <div className="w-6 h-6" /> },
  { id: 2, isCurrent: false, device: 'iPhone 14 Pro', browser: 'Safari', location: 'Surabaya, Indonesia', lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), icon: <div className="w-6 h-6" /> }, // 2 hours ago
];
const loginHistory = [
  { id: 1, status: 'success', device: 'Windows, Chrome', ip: '103.22.11.5', time: 'May 20, 2024, 10:30 PM' },
  { id: 2, status: 'failed', device: 'Unknown, Firefox', ip: '114.10.99.1', time: 'May 20, 2024, 10:28 PM' },
];

export const useSecurityState = () => {
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors] = useState<Record<string, string>>({});
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false); // This would be loaded from user data
  const [sessions, setSessions] = useState(initialSessions);
  const [totp, setTotp] = useState<OTPAuth.TOTP | null>(null);
  const { addNotification } = useNotification();
  const [, setTimeNow] = useState(Date.now());

  useEffect(() => {
    // This interval will trigger a re-render every 30 seconds
    // causing the 'lastActive' time to be recalculated and updated in the UI.
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock handlers for demonstration
  const handlePasswordChangeSubmit = (e: React.FormEvent) => e.preventDefault();
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnable2FA = useCallback(() => {
    // Generate a new TOTP object. In a real app, the secret would be saved to the user's database.
    const newTotp = new OTPAuth.TOTP({
      issuer: 'NeverlandStudio',
      label: 'Neverland',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      // The secret is the key part. It should be unique per user.
      secret: new OTPAuth.Secret(),
    });
    setTotp(newTotp);
    setIsSettingUp2FA(true);
  }, []);

  const handleDisable2FA = useCallback(() => {
    // In a real app, this would make an API call to disable 2FA in the database.
    setIs2faEnabled(false);
    setTotp(null);
    addNotification('2FA Disabled', 'Two-factor authentication has been disabled.', 'warning');
  }, [addNotification]);

  const handleVerify2FA = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!totp || !twoFactorCode) return;

    const delta = totp.validate({ token: twoFactorCode, window: 1 });

    if (delta === null) {
      addNotification('Verification Failed', 'The code is invalid. Please try again.', 'error');
    } else {
      // Verification successful
      addNotification('2FA Enabled', 'Two-factor authentication has been successfully enabled.', 'success');
      setIs2faEnabled(true);
      setIsSettingUp2FA(false);
      setTwoFactorCode('');
    }
  }, [totp, twoFactorCode, addNotification]);

  // isLoading state for password change operations
  const isLoading = false; // Can be set to true when password change is in progress

  const handleSignOutSession = (id: number) => setSessions(s => s.filter(i => i.id !== id));
  const handleSignOutAllOtherSessions = () => setSessions(s => s.filter(i => i.isCurrent));

  return {
    passwordData, handlePasswordInputChange, handlePasswordChangeSubmit, passwordErrors,
    isSettingUp2FA, setIsSettingUp2FA, twoFactorCode, setTwoFactorCode, is2faEnabled, totp,
    handleEnable2FA, handleDisable2FA, handleVerify2FA,
    sessions, handleSignOutSession, handleSignOutAllOtherSessions, loginHistory,
    isLoading
  };
};