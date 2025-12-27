import { useState } from 'react';
import type { Theme } from '../../types';
import BaseModal from './shared/BaseModal';
import ForgotPasswordForm from './forgot-password/ForgotPasswordForm';

interface ForgotPasswordModalProps {
  theme: Theme;
  onClose: () => void;
  onResetPassword: (email: string) => void;
  onBackToLogin?: () => void;
}

export default function ForgotPasswordModal({ 
  theme, 
  onClose, 
  onResetPassword,
  onBackToLogin 
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResetPassword(email);
  };

  return (
    <BaseModal
      theme={theme}
      onClose={onClose}
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm 
        theme={theme}
        email={email}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
        onBackToLogin={onBackToLogin}
      />
    </BaseModal>
  );
}
