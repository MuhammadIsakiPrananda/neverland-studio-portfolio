import { useState } from 'react';
import { User as UserIcon, Lock, LogIn, Loader, Eye, EyeOff, ShieldX, X } from 'lucide-react';
import { useNotification } from './useNotification';
import SocialLoginButtons from './SocialLoginButtons';

interface LoginFormProps {
  onSwitchMode: (mode: 'register' | 'forgotPassword') => void; // Mode bisa register atau forgotPassword
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
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
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none transition-all disabled:opacity-50 ${errors.identifier ? 'border-red-500/50' : 'border-slate-700'}`}
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
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none transition-all disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-slate-700'}`}
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
                onClick={() => setIsTermsModalOpen(true)}
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

      {isTermsModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
          // onClick={() => setIsTermsModalOpen(false)} // Dihapus untuk mencegah tutup di sembarang tempat
        >
          <div 
            className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-amber-400">Terms & Conditions</h3>
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="text-slate-500 hover:text-white hover:bg-slate-700/50 p-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-slate-300 space-y-4">
              <p>Welcome to Neverland! By using our services, you agree to these terms. Please read them carefully.</p>
              <h4 className="font-semibold text-slate-100 pt-2">1. Your Account</h4>
              <p>You are responsible for safeguarding your account. Use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>
              <h4 className="font-semibold text-slate-100 pt-2">2. Content</h4>
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
              <h4 className="font-semibold text-slate-100 pt-2">3. Prohibited Uses</h4>
              <p>You may use the Service only for lawful purposes. You may not use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere with any other party's use of the Service.</p>
              <p className="pt-4 text-slate-400">By clicking "I agree", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end items-center gap-4">
              <button className="bg-slate-700/50 text-slate-200 py-2 px-6 rounded-lg font-semibold transition-colors cursor-not-allowed opacity-50">
                Close
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-shadow cursor-not-allowed opacity-50">
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;