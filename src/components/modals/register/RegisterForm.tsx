import { useState } from 'react';
import { Mail, KeyRound, ShieldCheck, UserCircle, AtSign } from 'lucide-react';
import type { Theme } from '../../../types';
import InputField from '../shared/InputField';

interface RegisterFormProps {
  theme: Theme;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  onNameChange: (name: string) => void;
  onUsernameChange: (username: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  nameError?: string;
  usernameError?: string;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  onSignIn?: () => void;
  onShowTerms?: () => void;
  onShowPrivacy?: () => void;
  isLoading?: boolean;
  onSocialLogin?: (provider: 'google' | 'github') => void;
}

export default function RegisterForm({ 
  theme, 
  name,
  username,
  email, 
  password,
  confirmPassword,
  onNameChange,
  onUsernameChange,
  onEmailChange, 
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  nameError,
  usernameError,
  emailError,
  passwordError,
  confirmPasswordError,
  onSignIn,
  onShowTerms,
  onShowPrivacy,
  isLoading = false,
  onSocialLogin
}: RegisterFormProps) {
  const isDark = theme === 'dark';
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 1) return { strength: 20, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 50, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = password ? calculatePasswordStrength(password) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <InputField
        theme={theme}
        type="text"
        label="Full Name"
        value={name}
        onChange={onNameChange}
        icon={<UserCircle className="w-5 h-5" />}
        error={nameError}
        required
      />

      {/* 2 Column Layout for Username and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          theme={theme}
          type="text"
          label="Username"
          value={username}
          onChange={onUsernameChange}
          icon={<AtSign className="w-5 h-5" />}
          error={usernameError}
          required
        />

        <InputField
          theme={theme}
          type="email"
          label="Email Address"
          value={email}
          onChange={onEmailChange}
          icon={<Mail className="w-5 h-5" />}
          error={emailError}
          required
        />
      </div>

      <div className="space-y-2">
        <InputField
          theme={theme}
          type="password"
          label="Password"
          value={password}
          onChange={onPasswordChange}
          icon={<KeyRound className="w-5 h-5" />}
          error={passwordError}
          required
          minLength={8}
        />
        
        {/* Password Strength Indicator */}
        {passwordStrength && (
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div 
                className={`h-full ${passwordStrength.color} transition-all duration-500 ease-out`}
                style={{ width: `${passwordStrength.strength}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              Password strength: <span className="font-medium">{passwordStrength.label}</span>
            </p>
          </div>
        )}
      </div>

      <InputField
        theme={theme}
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        icon={<ShieldCheck className="w-5 h-5" />}
        error={confirmPasswordError}
        required
        minLength={8}
      />

      {/* Terms & Conditions */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
          className="
            mt-1 w-4 h-4 rounded
            bg-slate-800 border-slate-700 checked:bg-blue-500
            transition-all duration-300
            cursor-pointer
          "
        />
        <span className="text-sm text-slate-400 group-hover:text-opacity-80 transition-opacity">
          I agree to the{' '}
          <button
            type="button"
            onClick={onShowTerms}
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Terms & Conditions
          </button>
          {' '}and{' '}
          <button
            type="button"
            onClick={onShowPrivacy}
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Privacy Policy
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={!acceptTerms || isLoading}
        className="w-full py-3.5 px-6 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs font-medium text-slate-500 bg-slate-900">Or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => onSocialLogin?.('google')}
          disabled={isLoading}
          className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Google</span>
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => onSocialLogin?.('github')}
          disabled={isLoading}
          className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* GitHub Icon */}
          <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">GitHub</span>
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-6 border-t border-slate-800">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSignIn}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors relative group inline-flex items-center gap-1"
          >
            <span className="relative">
              Sign in
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </p>
      </div>
    </form>
  );
}
