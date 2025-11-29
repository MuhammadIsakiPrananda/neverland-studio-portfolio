import { useState } from 'react';
import { User as UserIcon, Lock, LogIn, Loader, Eye, EyeOff, ShieldX } from 'lucide-react';
import { useNotification } from './useNotification';
import SocialLoginButtons from './SocialLoginButtons';

interface LoginFormProps {
  onSwitchMode: (mode: 'register' | 'forgotPassword') => void; // Mode bisa register atau forgotPassword
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
  // Props baru dari AuthModal
  onOpenTerms: () => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode, onLoginSuccess, onOpenTerms, agreedToTerms, setAgreedToTerms }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; agreedToTerms?: string }>({});
  const { addNotification } = useNotification();

  const validate = () => {
    const newErrors: { identifier?: string; password?: string; agreedToTerms?: string } = {};
    if (!identifier) {
      newErrors.identifier = 'Email or Username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    if (!agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions.';
    }
    // Tambahkan validasi lain di sini jika perlu
    // Misalnya, validasi format email

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Jalankan validasi hanya saat submit
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Menggunakan URL relatif agar fleksibel, sama seperti RegisterForm.
      // Permintaan akan dikirim ke domain yang sama dengan frontend.
      // Di development, ini akan ditangani oleh proxy Vite.
      // Di produksi, ini akan langsung mengarah ke backend di domain yang sama.
      const apiUrl = '/api/auth/login';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Kirim 'identifier' sesuai dengan yang diharapkan backend
        body: JSON.stringify({ identifier, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika response dari server adalah error (4xx atau 5xx)
        // Gunakan pesan error dari backend kita: data.msg
        throw new Error(data.msg || 'An error occurred.');
      }

      // Jika login berhasil
      setErrors({});
      addNotification('Login Successful', `Welcome back, ${data.user.name}!`, 'success');
      
      // Panggil onLoginSuccess dengan data dari API
      onLoginSuccess(data.user, rememberMe);

    } catch (error: any) {
      const errorMessage = error.message || 'Invalid credentials. Please try again.';
      setApiError(errorMessage);
      addNotification('Login Failed', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Mengganti motion.div dengan div biasa dan menambahkan animasi fade-in sederhana
    <div key="login" className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-400">
          Welcome Back
        </h2>
        <p className="text-slate-400 mt-2">Sign in to continue to Neverland</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {apiError && (
          <div className="bg-red-900/40 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-start gap-3 animate-shake">
            <ShieldX className="w-5 h-5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <div>
          <label htmlFor="identifier" className="text-sm font-medium text-slate-400 mb-2 block">Email or Username</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="identifier"
              type="text"
              placeholder="e.g. alex@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors(prev => ({ ...prev, identifier: undefined }));
              }}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.identifier ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`}
              required
              disabled={isLoading}
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.identifier}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-400 mb-2 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: undefined }));
              }}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.password}</p>}
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
            />
            <label htmlFor="remember-me" className="text-slate-400 select-none">
              Remember for 30 days
            </label>
          </div>
          <button
            type="button"
            onClick={() => onSwitchMode('forgotPassword')}
            className="text-amber-400 hover:underline disabled:opacity-50"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        <div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                setErrors(prev => ({ ...prev, agreedToTerms: undefined }));
              }}
              disabled={isLoading}
              className="h-4 w-4 mt-0.5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
            />
            <label htmlFor="agree-terms" className="text-sm text-slate-400 select-none">
              I agree to the{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-amber-400 hover:underline disabled:opacity-50"
              >
                Terms & Conditions
              </button>
            </label>
          </div>
          {errors.agreedToTerms && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.agreedToTerms}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader className="w-5 h-5 animate-spin" /> Signing In...</>
          ) : (
            <><LogIn className="w-5 h-5" /> Sign In</>
          )}
        </button>

        <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
        </div>

        <SocialLoginButtons />

        <p className="text-center text-sm text-slate-400 pt-4 border-t border-slate-700/50">
          Don't have an account?{' '}
          <button type="button" onClick={() => onSwitchMode('register')} className="font-semibold text-amber-400 hover:underline disabled:opacity-50" disabled={isLoading}> 
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;