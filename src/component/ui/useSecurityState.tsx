import React, { useState } from 'react'; // NOSONAR

// This data should ideally be fetched or live outside the component
const initialSessions = [
  { id: 1, isCurrent: true, device: 'Windows', browser: 'Chrome', location: 'Malang, Indonesia', lastActive: 'Active now', icon: <div className="w-6 h-6" /> },
  { id: 2, isCurrent: false, device: 'iPhone 14 Pro', browser: 'Safari', location: 'Surabaya, Indonesia', lastActive: '2 hours ago', icon: <div className="w-6 h-6" /> },
];
const loginHistory = [
  { id: 1, status: 'success', device: 'Windows, Chrome', ip: '103.22.11.5', time: 'May 20, 2024, 10:30 PM' },
  { id: 2, status: 'failed', device: 'Unknown, Firefox', ip: '114.10.99.1', time: 'May 20, 2024, 10:28 PM' },
];

export const useSecurityState = () => {
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);
  
  // Mock handlers for demonstration
  const handlePasswordChangeSubmit = (e: React.FormEvent) => e.preventDefault();
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  const handleEnable2FA = () => setIsSettingUp2FA(true);
  const handleDisable2FA = () => setIs2faEnabled(false);
  const handleVerify2FA = (e: React.FormEvent) => e.preventDefault();
  const handleSignOutSession = (id: number) => setSessions(s => s.filter(i => i.id !== id));
  const handleSignOutAllOtherSessions = () => setSessions(s => s.filter(i => i.isCurrent));

  return {
    passwordData, handlePasswordInputChange, handlePasswordChangeSubmit, passwordErrors,
    isSettingUp2FA, setIsSettingUp2FA, twoFactorCode, setTwoFactorCode, is2faEnabled,
    handleEnable2FA, handleDisable2FA, handleVerify2FA,
    sessions, handleSignOutSession, handleSignOutAllOtherSessions, loginHistory
  };
};