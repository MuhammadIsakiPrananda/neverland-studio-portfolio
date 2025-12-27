import { Mail, KeyRound } from 'lucide-react';
import type { Theme } from '../../../types';
import InputField from '../shared/InputField';

interface LoginFormProps {
  theme: Theme;
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  emailError?: string;
  passwordError?: string;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  isLoading?: boolean;
  onSocialLogin?: (provider: 'google' | 'github') => void;
}

export default function LoginForm({ 
  theme, 
  email, 
  password, 
  onEmailChange, 
  onPasswordChange, 
  onSubmit,
  emailError,
  passwordError,
  onForgotPassword,
  onSignUp,
  isLoading = false,
  onSocialLogin
}: LoginFormProps) {

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Welcome Message - Clean */}
      <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
        <p className="text-sm text-slate-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Enter your email or username and password to access your account</span>
        </p>
      </div>

      <InputField
        theme={theme}
        type="text"
        label="Email or Username"
        value={email}
        onChange={onEmailChange}
        icon={<Mail className="w-5 h-5" />}
        error={emailError}
        required
      />

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
        
        {onForgotPassword && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors relative group inline-flex items-center gap-1"
            >
              <span className="relative">
                Forgot password?
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-300 group-hover:w-full"></span>
              </span>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Remember Me - Clean */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-2 border-slate-600 bg-slate-800 checked:bg-blue-500 checked:border-blue-500 transition-colors"
        />
        <span className="text-sm text-slate-400">Keep me signed in</span>
      </label>

      {/* Sign In Button - Clean */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Signing in...</span>
          </span>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs text-slate-500 bg-slate-900">Or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons - Clean */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => onSocialLogin?.('google')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-slate-300">Google</span>
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => onSocialLogin?.('github')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-medium text-slate-300">GitHub</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-4 border-t border-slate-800">
        <p className="text-sm text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSignUp}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors relative group inline-flex items-center gap-1"
          >
            <span className="relative">
              Sign up now
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
