import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, User, Chrome, Github, UserPlus, Shield, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { dashboardAuth } from '../../services/dashboardAuth';
import { showSuccess, showError, showInfo } from '../common/ModernNotification';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';

// For admin registration endpoint, we need base URL without /api suffix
const API_URL = API_BASE_URL.startsWith('/') ? '' : API_BASE_URL.replace('/api', '');

export default function DashboardLogin() {
  const navigate = useNavigate();

  // Typewriter animation state
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = 'Neverland Studio';

  // Infinite typewriter effect with delete
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && typedText.length < fullText.length) {
      // Typing phase - variable delay untuk natural effect
      const typingDelay = Math.random() * 70 + 80; // 80-150ms
      timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, typingDelay);
    } else if (!isDeleting && typedText.length === fullText.length) {
      // Pause setelah selesai mengetik
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000); // Pause 2 detik
    } else if (isDeleting && typedText.length > 0) {
      // Deleting phase - lebih cepat dari typing
      const deletingDelay = Math.random() * 30 + 50; // 50-80ms
      timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length - 1));
      }, deletingDelay);
    } else if (isDeleting && typedText.length === 0) {
      // Mulai mengetik lagi
      setIsDeleting(false);
      timeout = setTimeout(() => {
        setTypedText('');
      }, 500); // Pause singkat sebelum mulai lagi
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, fullText]);

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

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);

    try {
      const { authService } = await import('../../services/authService');
      const redirectUrl = await authService.socialLogin(provider);
      // Redirect to OAuth provider
      window.location.href = redirectUrl;
    } catch (error: any) {
      showError('Social Login Failed', error.message || `Failed to initialize ${provider} login`);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showError('Validation Error', 'Please enter username and password');
      return;
    }

    setIsLoading(true);

    try {
      const { authApi } = await import('../../services/api');
      const response = await authApi.login({ email: username, password, remember: false });

      console.log('✅ Backend authentication successful');

      if (rememberMe) {
        localStorage.setItem('dashboard_remember_username', username);
      } else {
        localStorage.removeItem('dashboard_remember_username');
      }

      dashboardAuth.setSession(response.user.name, username, response.user.email);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('❌ Login error:', error);

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

        setActiveTab('login');
        setUsername(regUsername);

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0">
        {/* Refined Gradient Orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>

        {/* Subtle Grid - More Refined */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-start my-8">

          {/* Left Side - Static Branding (Never Changes) - Sticky Position */}
          <div className="hidden lg:flex flex-col justify-center space-y-12 animate-fade-in-left sticky top-8 self-start" key="static-branding">
            <div className="space-y-8">
              {/* Badge - Always Visible */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-xl">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
                </div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Admin Portal</span>
              </div>

              {/* Hero Title - With Typewriter Animation */}
              <div className="space-y-6">
                <h1 className="text-6xl font-bold leading-[1.1] tracking-tight">
                  <span className="block text-white/90">
                    Welcome to
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent inline-flex items-center gap-3">
                    {typedText}
                    <span className="inline-block w-1 h-14 bg-gradient-to-b from-primary to-cyan-400 animate-pulse"></span>
                  </span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed max-w-lg font-light">
                  Your powerful command center for managing projects, analytics, and content with elegance and precision.
                </p>
              </div>
            </div>

            {/* Clean Feature List - Always Visible */}
            <div className="space-y-4 pt-4">
              {[
                { icon: Shield, label: 'Enterprise Security', color: 'text-primary' },
                { icon: Sparkles, label: 'AI-Powered Insights', color: 'text-cyan-400' },
                { icon: Lock, label: 'End-to-End Encryption', color: 'text-blue-400' },
              ].map((feature, i) => (
                <div
                  key={`feature-${i}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Clean Auth Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-up">
            {/* Mobile Logo - Minimalist */}
            <div className="lg:hidden text-center mb-10 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 border border-primary/30 backdrop-blur-xl mb-3">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Neverland Studio
              </h2>
              <p className="text-sm text-slate-500 font-medium">Admin Portal</p>
            </div>

            {/* Ultra Clean Auth Card */}
            <Card className="border-0 shadow-2xl backdrop-blur-2xl bg-slate-900/40 overflow-hidden relative">
              {/* Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-cyan-500/[0.03]" />

              <CardContent className="p-0 relative">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
                  {/* Minimal Tabs */}
                  <div className="border-b border-white/5 px-8 pt-8 pb-4">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/30 backdrop-blur-sm p-1 rounded-xl border border-white/5">
                      <TabsTrigger
                        value="login"
                        className="rounded-lg 
                                 data-[state=active]:bg-white/10
                                 data-[state=active]:text-white 
                                 data-[state=active]:shadow-lg
                                 text-slate-400
                                 transition-all duration-200 
                                 font-semibold text-sm
                                 py-2.5"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="rounded-lg 
                                 data-[state=active]:bg-white/10
                                 data-[state=active]:text-white 
                                 data-[state=active]:shadow-lg
                                 text-slate-400
                                 transition-all duration-200 
                                 font-semibold text-sm
                                 py-2.5"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Clean Login Tab */}
                  <TabsContent value="login" className="p-8 m-0 space-y-8">
                    {/* Minimalist Header */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        Welcome back
                      </h3>
                      <p className="text-sm text-slate-400 font-normal">
                        Sign in to continue to your dashboard
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      {/* Clean Username Field */}
                      <div className="space-y-2.5">
                        <Label htmlFor="username" className="text-sm font-medium text-slate-300">
                          Email or Username
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors duration-200 z-10" />
                          <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin@example.com"
                            className="h-12 pl-12 pr-4
                                     bg-slate-800/50 backdrop-blur-sm
                                     border border-slate-700/50 
                                     rounded-xl 
                                     text-white text-sm
                                     placeholder:text-slate-500 
                                     focus:border-primary/50 
                                     focus:ring-2 focus:ring-primary/20 
                                     focus:bg-slate-800/70
                                     hover:border-slate-600
                                     transition-all duration-200"
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Clean Password Field */}
                      <div className="space-y-2.5">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                          Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors duration-200 z-10" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 pl-12 pr-12
                                     bg-slate-800/50 backdrop-blur-sm
                                     border border-slate-700/50 
                                     rounded-xl 
                                     text-white text-sm
                                     placeholder:text-slate-500 
                                     focus:border-primary/50 
                                     focus:ring-2 focus:ring-primary/20 
                                     focus:bg-slate-800/70
                                     hover:border-slate-600
                                     transition-all duration-200"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                                     text-slate-500 hover:text-primary 
                                     transition-colors duration-200 
                                     p-1 rounded-lg"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Clean Options Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            className="w-4 h-4 border-slate-600 
                                     data-[state=checked]:bg-primary 
                                     data-[state=checked]:border-primary 
                                     rounded"
                          />
                          <Label
                            htmlFor="remember"
                            className="text-sm text-slate-400 font-normal cursor-pointer 
                                     hover:text-slate-300 transition-colors"
                          >
                            Remember me
                          </Label>
                        </div>

                        <button
                          type="button"
                          className="text-sm text-primary hover:text-cyan-400 font-medium transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Clean Primary Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-sm font-semibold
                                 bg-primary hover:bg-primary/90
                                 shadow-lg shadow-primary/25 
                                 hover:shadow-xl hover:shadow-primary/30
                                 transition-all duration-200 
                                 rounded-xl
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 group/btn"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5" />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </Button>

                      {/* Clean Divider */}
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 text-xs font-medium text-slate-500 bg-slate-900/40">
                            or
                          </span>
                        </div>
                      </div>

                      {/* Clean Social Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialLogin('google')}
                          disabled={isLoading}
                          className="h-11 
                                   bg-slate-800/30 backdrop-blur-sm
                                   border border-slate-700/50 
                                   hover:bg-slate-800/50 
                                   hover:border-slate-600
                                   text-slate-300 
                                   transition-all duration-200
                                   rounded-xl
                                   text-sm font-medium"
                        >
                          <Chrome className="w-4 h-4 mr-2" />
                          Google
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialLogin('github')}
                          disabled={isLoading}
                          className="h-11 
                                   bg-slate-800/30 backdrop-blur-sm
                                   border border-slate-700/50 
                                   hover:bg-slate-800/50 
                                   hover:border-slate-600
                                   text-slate-300 
                                   transition-all duration-200
                                   rounded-xl
                                   text-sm font-medium"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Clean Register Tab */}
                  <TabsContent value="register" className="p-8 m-0 space-y-8">
                    {/* Minimalist Header */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        Create Account
                      </h3>
                      <p className="text-sm text-slate-400 font-normal">
                        Register as an administrator
                      </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                      {/* Clean Username */}
                      <div className="space-y-2.5">
                        <Label htmlFor="reg-username" className="text-sm font-medium text-slate-300">
                          Username
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors duration-200 z-10" />
                          <Input
                            id="reg-username"
                            type="text"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            placeholder="johndoe"
                            className="h-12 pl-12 pr-4
                                     bg-slate-800/50 backdrop-blur-sm
                                     border border-slate-700/50 
                                     rounded-xl 
                                     text-white text-sm
                                     placeholder:text-slate-500 
                                     focus:border-primary/50 
                                     focus:ring-2 focus:ring-primary/20 
                                     focus:bg-slate-800/70
                                     hover:border-slate-600
                                     transition-all duration-200"
                            required
                          />
                        </div>
                      </div>

                      {/* Clean Role Selector */}
                      <div className="space-y-2.5">
                        <Label className="text-sm font-medium text-slate-300">
                          Account Role
                        </Label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors duration-200 z-10 pointer-events-none" />
                          <select
                            value={regRole}
                            onChange={(e) => setRegRole(e.target.value as 'superadmin' | 'admin')}
                            className="w-full h-12 pl-12 pr-10
                                     bg-slate-800/50 backdrop-blur-sm
                                     border border-slate-700/50 
                                     rounded-xl 
                                     text-white text-sm
                                     appearance-none cursor-pointer
                                     focus:border-primary/50 
                                     focus:ring-2 focus:ring-primary/20 
                                     focus:bg-slate-800/70 
                                     focus:outline-none 
                                     hover:border-slate-600
                                     transition-all duration-200"
                          >
                            <option value="admin" className="bg-slate-800">Administrator</option>
                            <option value="superadmin" className="bg-slate-800">Super Admin</option>
                          </select>
                          <svg
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-focus-within:text-primary transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Clean Password */}
                      <div className="space-y-2.5">
                        <Label htmlFor="reg-password" className="text-sm font-medium text-slate-300">
                          Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors duration-200 z-10" />
                          <Input
                            id="reg-password"
                            type={showRegPassword ? 'text' : 'password'}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="h-12 pl-12 pr-12
                                     bg-slate-800/50 backdrop-blur-sm
                                     border border-slate-700/50 
                                     rounded-xl 
                                     text-white text-sm
                                     placeholder:text-slate-500 
                                     focus:border-primary/50 
                                     focus:ring-2 focus:ring-primary/20 
                                     focus:bg-slate-800/70
                                     hover:border-slate-600
                                     transition-all duration-200"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                                     text-slate-500 hover:text-primary 
                                     transition-colors duration-200 
                                     p-1 rounded-lg"
                          >
                            {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Clean Confirm Password */}
                      <div className="space-y-2.5">
                        <Label htmlFor="reg-confirm" className="text-sm font-medium text-slate-300">
                          Confirm Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors duration-200 z-10" />
                          <Input
                            id="reg-confirm"
                            type={showRegConfirmPassword ? 'text' : 'password'}
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="h-12 pl-12 pr-12
                                     bg-slate-800/50 backdrop-blur-sm
                                     border border-slate-700/50 
                                     rounded-xl 
                                     text-white text-sm
                                     placeholder:text-slate-500 
                                     focus:border-primary/50 
                                     focus:ring-2 focus:ring-primary/20 
                                     focus:bg-slate-800/70
                                     hover:border-slate-600
                                     transition-all duration-200"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                                     text-slate-500 hover:text-primary 
                                     transition-colors duration-200 
                                     p-1 rounded-lg"
                          >
                            {showRegConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Clean Submit Button */}
                      <Button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full h-12 text-sm font-semibold
                                 bg-primary hover:bg-primary/90
                                 shadow-lg shadow-primary/25 
                                 hover:shadow-xl hover:shadow-primary/30
                                 transition-all duration-200 
                                 rounded-xl mt-2
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 group/btn"
                      >
                        {isRegistering ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5" />
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </Button>

                      {/* Security Notice */}
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Admin accounts are automatically verified and secured with encryption
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Clean Footer */}
            <div className="mt-10 text-center space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                  <span className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75"></span>
                </div>
                <span className="text-xs font-medium text-slate-400">All Systems Operational</span>
              </div>

              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} Neverland Studio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
