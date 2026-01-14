import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Shield, Mail } from 'lucide-react';
import { authService } from '../../services/authService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'validating'>('validating');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate token and email on mount
    const validateResetLink = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid or missing reset link. Please request a new password reset.');
        return;
      }
      
      // Set status to idle after validation
      setTimeout(() => {
        setStatus('idle');
      }, 500);
    };

    validateResetLink();
  }, [token, email]);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    if (password.length === 0) {
      setPasswordStrength('weak');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 3) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid reset link. Please request a new password reset.');
      return;
    }

    // Validation
    if (formData.password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setStatus('error');
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    if (passwordStrength === 'weak') {
      setStatus('error');
      setMessage('Password is too weak. Please use a stronger password with mixed characters.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await authService.resetPassword(
        token,
        email,
        formData.password,
        formData.password_confirmation
      );

      if (response.success) {
        setStatus('success');
        setMessage('Your password has been reset successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/home', { state: { openLogin: true } });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (error: any) {
      setStatus('error');
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setMessage('Invalid or expired reset token. Please request a new password reset.');
      } else {
        setMessage('An error occurred. Please try again or request a new reset link.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/3';
      case 'medium': return 'w-2/3';
      case 'strong': return 'w-full';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create a new secure password for your account
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Email Info Banner */}
          {status !== 'success' && email && status !== 'error' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Resetting password for:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-mono">
                  {email}
                </p>
              </div>
            </div>
          )}

          {/* Validating State */}
          {status === 'validating' && (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Validating Reset Link
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we verify your request...
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full animate-bounce-subtle">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {message}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting to login...</span>
                </div>
              </div>
            </div>
          )}
          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full animate-bounce-subtle">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {message}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting to login...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State - Token Invalid */}
          {status === 'error' && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Unable to Reset Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/home', { state: { openForgotPassword: true } })}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Mail className="w-5 h-5" />
                  Request New Reset Link
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Reset Form */}
          {status !== 'success' && status !== 'error' && status !== 'validating' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Security Notice */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">
                    Security Tips
                  </p>
                  <ul className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                    <li>• Use at least 8 characters</li>
                    <li>• Mix uppercase and lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                  </ul>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Password Strength:
                      </span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength === 'weak' ? 'text-red-600 dark:text-red-400' :
                        passwordStrength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.password_confirmation.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.password === formData.password_confirmation ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                          Passwords don't match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {message && status === 'idle' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !token || !email || formData.password.length < 8 || formData.password !== formData.password_confirmation}
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Back to Home Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Info */}
        {status !== 'success' && status !== 'error' && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              This password reset link will expire in 60 minutes
            </p>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
      `}</style>
    </div>
  );
}
