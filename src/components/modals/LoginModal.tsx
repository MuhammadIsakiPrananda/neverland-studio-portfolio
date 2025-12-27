import { useState } from 'react';
import type { Theme } from '../../types';
import BaseModal from './shared/BaseModal';
import LoginForm from './login/LoginForm';
import { authService } from '../../services/authService';
import { showError } from '../common/ModernNotification';

interface LoginModalProps {
  theme: Theme;
  onClose: () => void;
  onLogin: (email: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export default function LoginModal({ theme, onClose, onLogin, onForgotPassword, onSignUp }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError(undefined);
    setPasswordError(undefined);
    
    // Validate
    let hasError = false;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }
    
    if (hasError) return;
    
    // Real backend authentication
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        onLogin(email);
      } else {
        setPasswordError(response.message || 'Login failed');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setPasswordError('Invalid email or password');
      } else {
        setPasswordError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      const redirectUrl = await authService.socialLogin(provider);
      // Redirect to OAuth provider
      window.location.href = redirectUrl;
    } catch (error: any) {
      showError('Social Login Failed', error.message || `Failed to initialize ${provider} login`);
      setIsLoading(false);
    }
  };



  return (
    <BaseModal
      theme={theme}
      onClose={onClose}
      title="Welcome Back"
      subtitle="Sign in to access your account"
    >
      <LoginForm 
        theme={theme}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        emailError={emailError}
        passwordError={passwordError}
        onForgotPassword={onForgotPassword}
        onSignUp={onSignUp}
        isLoading={isLoading}
        onSocialLogin={handleSocialLogin}
      />
    </BaseModal>
  );
}
