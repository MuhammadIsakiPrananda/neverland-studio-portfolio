import { useState } from 'react';
import { User as UserIcon, Lock, LogIn, Loader, Eye, EyeOff, ShieldX } from 'lucide-react';
import { useNotification } from './useNotification';
import SocialLoginButtons from './SocialLoginButtons';

interface LoginFormProps {
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<typeof formData> & { agreedToTerms?: string }>({});
  const { addNotification } = useNotification();

  const validate = (field?: keyof typeof formData) => {
    const newErrors: Partial<typeof formData> & { agreedToTerms?: string } = { ...errors };
    const { identifier, password } = formData;

    const validateField = (key: keyof typeof formData) => {
      switch (key) {
        case 'identifier':
          newErrors.identifier = identifier ? undefined : 'Email or Username is required.';
          break;
        case 'password':
          newErrors.password = password ? undefined : 'Password is required.';
          break;
      }
    };

    if (field) {
      validateField(field);
    } else {
      (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => validateField(key));
      // Validasi tambahan untuk persetujuan syarat dan ketentuan
      if (!agreedToTerms) {
        newErrors.agreedToTerms = 'You must agree to the terms and conditions.';
      } else {
        newErrors.agreedToTerms = undefined;
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

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
        body: JSON.stringify(formData), 
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAgreedToTerms(isChecked);
    if (isChecked) {
      setErrors(prev => ({ ...prev, agreedToTerms: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validate(e.target.id as keyof typeof formData);
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
              value={formData.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
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
              onChange={(e) => setRememberMe(e.target.checked)} // NOSONAR
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
            />
            <label htmlFor="remember-me" className="text-slate-400 select-none">
              Remember for 30 days
            </label>
          </div>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-amber-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="agree-terms" checked={agreedToTerms} onChange={handleAgreeChange} disabled={isLoading} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0" />
            <label htmlFor="agree-terms" className="text-sm text-slate-400 select-none">
              I agree to the <button type="button" className="text-amber-400 hover:underline">Terms & Conditions</button>
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

        {/* Menggabungkan border dan link ke dalam satu div untuk memperbaiki masalah klik yang disebabkan oleh `space-y-5` */}
      </form>

      {/* Bagian ini dipindahkan ke luar <form> untuk memastikan tombol bisa diklik */}
      <div className="pt-5 mt-5 border-t border-slate-700/50 relative z-10">
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="font-semibold text-amber-400 hover:underline"> 
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;