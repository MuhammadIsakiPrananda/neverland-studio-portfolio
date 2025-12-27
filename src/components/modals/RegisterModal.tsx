import { useState, useMemo } from 'react';
import type { Theme } from '../../types';
import BaseModal from './shared/BaseModal';
import RegisterForm from './register/RegisterForm';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../common/ModernNotification';

interface RegisterModalProps {
  theme: Theme;
  onClose: () => void;
  onRegister: () => void;
  onSignIn?: () => void;
  onShowTerms?: () => void;
  onShowPrivacy?: () => void;
}

export default function RegisterModal({ theme, onClose, onRegister, onSignIn, onShowTerms, onShowPrivacy }: RegisterModalProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordErrorState, setPasswordErrorState] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();

  // Real-time password matching validation
  const passwordError = useMemo(() => {
    if (confirmPassword && password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return undefined;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError(undefined);
    setUsernameError(undefined);
    setEmailError(undefined);
    setPasswordErrorState(undefined);
    setConfirmPasswordError(undefined);
    
    // Validate
    let hasError = false;
    
    if (!name.trim()) {
      setNameError('Full name is required');
      hasError = true;
    }
    
    if (!username.trim()) {
      setUsernameError('Username is required');
      hasError = true;
    }
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    
    if (!password) {
      setPasswordErrorState('Password is required');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordErrorState('Password must be at least 8 characters');
      hasError = true;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }
    
    if (hasError) return;
    
    // Register with backend
    setIsLoading(true);
    try {
      const response = await authService.register(name, username, email, password, confirmPassword);
      
      if (response.success) {
        // Show success toast with user details
        showSuccess(
          `Welcome, ${name}! 🎉`,
          'Your account has been created successfully.'
        );
        
        // Call onRegister to update app state
        onRegister();
        onClose();
        // Redirect to home page
        navigate('/');
      } else {
        // Handle validation errors from backend
        if (response.errors) {
          // Check for duplicate username error
          if (response.errors.username) {
            const usernameError = response.errors.username[0];
            setUsernameError(usernameError);
            if (usernameError.toLowerCase().includes('already') || usernameError.toLowerCase().includes('taken')) {
              showError(
                'Username Already Taken!',
                'This username is already in use. Please choose a different one.'
              );
            }
          }
          // Check for duplicate email error
          if (response.errors.email) {
            const emailError = response.errors.email[0];
            setEmailError(emailError);
            if (emailError.toLowerCase().includes('already') || emailError.toLowerCase().includes('taken')) {
              showError(
                'Email Already Registered!',
                'This email is already in use. Please use a different email or try logging in.'
              );
            }
          }
          if (response.errors.name) {
            setNameError(response.errors.name[0]);
            showError('Name Error', response.errors.name[0]);
          }
          if (response.errors.password) {
            setPasswordErrorState(response.errors.password[0]);
            showError('Password Error', response.errors.password[0]);
          }
        } else {
          setEmailError(response.message || 'Registration failed');
          showError(
            'Registration Failed',
            response.message || 'Please try again.'
          );
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setEmailError(errorMessage);
      
      // Show detailed error toast
      showError(
        'Registration Failed!',
        errorMessage
      );
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
      title="Create Account"
      subtitle="Join us today and get started"
    >
      <RegisterForm 
        theme={theme}
        name={name}
        username={username}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        onNameChange={setName}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleSubmit}
        nameError={nameError}
        usernameError={usernameError}
        emailError={emailError}
        passwordError={passwordErrorState || passwordError}
        confirmPasswordError={confirmPasswordError}
        onSignIn={onSignIn}
        onShowTerms={onShowTerms}
        onShowPrivacy={onShowPrivacy}
        isLoading={isLoading}
        onSocialLogin={handleSocialLogin}
      />
    </BaseModal>
  );
}
