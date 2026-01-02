import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, User, Chrome, Github, UserPlus, Shield } from 'lucide-react';
import { dashboardAuth } from '../../services/dashboardAuth';
import { showSuccess, showError, showInfo } from '../common/ModernNotification';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api.config';

// For admin registration endpoint, we need base URL without /api suffix
// If API_BASE_URL is relative path like '/api', use empty string
// If it's full URL like 'http://localhost:8000/api', remove /api
const API_URL = API_BASE_URL.startsWith('/') ? '' : API_BASE_URL.replace('/api', '');

export default function DashboardLogin() {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'superadmin' | 'admin'>('admin');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Load remembered username on mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('dashboard_remember_username');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSocialLogin = (provider: 'google' | 'github') => {
    showInfo(
      'Coming Soon',
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not yet implemented. Please use username and password.`
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showError('Validation Error', 'Please enter username and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Attempting backend authentication...');

      // PRIMARY: Login to backend database
      const { authService } = await import('../../services/authService');
      const backendResult = await authService.login(username, password);

      if (backendResult.success && backendResult.data) {
        console.log('✅ Backend authentication successful');

        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem('dashboard_remember_username', username);
        } else {
          localStorage.removeItem('dashboard_remember_username');
        }

        // Also set dashboard session for compatibility
        dashboardAuth.setSession(backendResult.data.user.name, username, backendResult.data.user.email);

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        console.log('❌ Backend authentication failed:', backendResult.message);
        showError('Login Failed', backendResult.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);

      // FALLBACK: Try hardcoded credentials if backend fails
      console.log('⚠️ Attempting fallback hardcoded authentication...');
      const fallbackResult = dashboardAuth.login(username, password);

      if (fallbackResult.success) {
        console.log('✅ Fallback authentication successful');

        if (rememberMe) {
          localStorage.setItem('dashboard_remember_username', username);
        } else {
          localStorage.removeItem('dashboard_remember_username');
        }

        showSuccess('Login Successful', `Welcome back, ${fallbackResult.user?.name}!`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        showError('Login Failed', error.response?.data?.message || error.message || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!regUsername || !regPassword || !regConfirmPassword) {
      showError('Validation Error', 'Please fill all fields');
      return;
    }

    if (regPassword.length < 6) {
      showError('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showError('Validation Error', 'Passwords do not match');
      return;
    }

    setIsRegistering(true);

    try {
      console.log('📝 Registering new admin...');

      const response = await axios.post(`${API_URL}/api/admin/register`, {
        username: regUsername,
        password: regPassword,
        role: regRole,
      });

      if (response.data.success) {
        console.log('✅ Registration successful');
        showSuccess('Registration Successful!', 'You can now login with your credentials.');

        // Auto-switch to login tab and fill username
        setActiveTab('login');
        setUsername(regUsername);

        // Clear register form
        setRegUsername('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegRole('admin');
      } else {
        showError('Registration Failed', response.data.message || 'Please try again');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      showError(
        'Registration Failed',
        error.response?.data?.message || error.message || 'An error occurred during registration'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-500" />
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-4 shadow-lg shadow-blue-500/50">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Neverland Studio
          </h1>
          <p className="text-slate-400 text-sm">
            Dashboard Admin {activeTab === 'login' ? 'Login' : 'Registration'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 px-4 rounded-xl font-medium transition-all duration-300 ${activeTab === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 px-4 rounded-xl font-medium transition-all duration-300 ${activeTab === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {activeTab === 'login' ? (
            // LOGIN FORM
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or email"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login to Dashboard
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-slate-900/50 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="py-3 px-4 rounded-xl font-medium text-white bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Chrome className="w-5 h-5" />
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="py-3 px-4 rounded-xl font-medium text-white bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
              </div>
            </form>
          ) : (
            // REGISTER FORM
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as 'superadmin' | 'admin')}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                  >
                    {showRegConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {isRegistering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Admin Account
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-500">
                Email will be auto-verified for admin users
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} Neverland Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
