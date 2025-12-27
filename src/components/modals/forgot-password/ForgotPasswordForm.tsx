import { Mail } from 'lucide-react';
import type { Theme } from '../../../types';
import InputField from '../shared/InputField';

interface ForgotPasswordFormProps {
  theme: Theme;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin?: () => void;
}

export default function ForgotPasswordForm({ 
  theme, 
  email, 
  onEmailChange, 
  onSubmit,
  onBackToLogin
}: ForgotPasswordFormProps) {

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Information Message - Clean */}
      <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
        <p className="text-sm text-slate-400 flex items-start gap-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            Enter your email address and we'll send you a link to reset your password. The link will be valid for 24 hours.
          </span>
        </p>
      </div>

      {/* Email Input */}
      <InputField
        theme={theme}
        type="email"
        label="Email Address"
        value={email}
        onChange={onEmailChange}
        icon={<Mail className="w-5 h-5" />}
        required
      />

      {/* Submit Button - Clean */}
      <button
        type="submit"
        className="w-full py-3.5 px-6 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
      >
        Send Reset Link
      </button>

      {/* Back to Login Link */}
      <div className="text-center pt-4 border-t border-slate-800">
        <p className="text-sm text-slate-400">
          Remember your password?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors relative group inline-flex items-center gap-1"
          >
            <span className="relative">
              Back to Login
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
