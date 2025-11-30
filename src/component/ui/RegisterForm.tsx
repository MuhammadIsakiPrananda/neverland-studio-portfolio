import { useState } from 'react';
import { User as UserIcon, Lock, Mail, LogIn, Loader, Eye, EyeOff, ShieldX, AtSign } from 'lucide-react';
import { useNotification } from './useNotification';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import ReCAPTCHA from 'react-google-recaptcha';

interface RegisterFormProps {
  onSwitchMode: (mode: 'login') => void;
  onRegisterSuccess: (user: any, rememberMe: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchMode, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<typeof formData> & { agreedToTerms?: string }>({});
  const { addNotification } = useNotification();

  const validate = (field?: keyof typeof formData) => {
    const newErrors: Partial<typeof formData> & { agreedToTerms?: string } = { ...errors };
    const { name, username, email, password, confirmPassword } = formData;

    const validateField = (key: keyof typeof formData) => {
      switch (key) {
        case 'name':
          newErrors.name = name ? undefined : 'Name is required.';
          break;
        case 'username':
          newErrors.username = username ? undefined : 'Username is required.';
          break;
        case 'email':
          if (!email) {
            newErrors.email = 'Email is required.';
          } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid.';
          } else {
            newErrors.email = undefined;
          }
          break;
        case 'password':
          if (!password) {
            newErrors.password = 'Password is required.';
          } else {
            const passwordErrors = [];
            if (password.length < 8) passwordErrors.push('at least 8 characters');
            if (!/[a-z]/.test(password)) passwordErrors.push('a lowercase letter');
            if (!/[A-Z]/.test(password)) passwordErrors.push('an uppercase letter');
            if (!/[0-9]/.test(password)) passwordErrors.push('a number');
            if (!/[^A-Za-z0-9]/.test(password)) passwordErrors.push('a special character');
            newErrors.password = passwordErrors.length > 0 ? `Must contain ${passwordErrors.join(', ')}.` : undefined;
          }
          break;
        case 'confirmPassword':
          newErrors.confirmPassword = password !== confirmPassword ? 'Passwords do not match.' : undefined;
          break;
        default:
          break;
      }
    };

    if (field) {
      validateField(field);
    } else {
      // Validate all fields if no specific field is provided
      (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => validateField(key));
      // Validasi tambahan untuk persetujuan syarat dan ketentuan
      if (!agreedToTerms) {
        newErrors.agreedToTerms = 'You must agree to the terms and conditions.';
      } else {
        newErrors.agreedToTerms = undefined;
      }
    }
    
    setErrors(newErrors);
    // Return true if no error messages are present after validation
    return Object.values(newErrors).every(error => error === undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear the specific error when user starts typing
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    // Run full validation on submit
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Menggunakan URL relatif agar fleksibel antara localhost dan domain produksi.
      // Permintaan akan dikirim ke domain yang sama dengan frontend.
      // Contoh: http://localhost:5173/api/auth/register atau https://neverlandstudio.my.id/api/auth/register
      // Pastikan server backend Anda (baik lokal maupun produksi) dapat menangani permintaan dari path ini.
      const apiUrl = '/api/auth/register';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika response dari server adalah error (4xx atau 5xx)
        throw new Error(data.msg || 'An error occurred during registration.');
      }

      // Jika registrasi berhasil
      setErrors({});
      
      addNotification('Registration Successful', `Welcome, ${data.user.name}! You are now logged in.`, 'success');
      
      // Panggil onRegisterSuccess agar pengguna langsung login
      onRegisterSuccess(data.user, false); // Anggap 'remember me' false saat registrasi

    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred during registration.';
      setApiError(errorMessage);
      addNotification('Registration Failed', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div key="register" className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-400">
          Create an Account
        </h2>
        <p className="text-slate-400 mt-2">Join us and start your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-red-900/40 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-start gap-3 animate-shake">
            <ShieldX className="w-5 h-5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-400 mb-2 block">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="name" type="text" placeholder="e.g. Alex Johnson" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.name ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`} required disabled={isLoading} />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.name}</p>}
        </div>

        {/* Username Input */}
        <div>
          <label htmlFor="username" className="text-sm font-medium text-slate-400 mb-2 block">Username</label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="username" type="text" placeholder="e.g. alexj" value={formData.username} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.username ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`} required disabled={isLoading} />
          </div>
          {errors.username && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.username}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-400 mb-2 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="email" type="email" placeholder="e.g. alex@example.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.email ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`} required disabled={isLoading} />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-400 mb-2 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`} required disabled={isLoading} />
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
          <PasswordStrengthMeter password={formData.password} />
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-400 mb-2 block">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500/50' : 'border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'}`} required disabled={isLoading} />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.confirmPassword}</p>}
        </div>

        <div className="pt-2">
          {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              theme="dark"
            />
          ) : (
            <div className="bg-yellow-900/40 border border-yellow-500/30 text-yellow-300 text-sm p-3 rounded-lg">
              reCAPTCHA is not configured. Please set{" "}
              <code className="bg-slate-700 px-1 py-0.5 rounded">VITE_RECAPTCHA_SITE_KEY</code> in your .env file and restart the server.
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="agree-terms-register" checked={agreedToTerms} onChange={handleAgreeChange} disabled={isLoading} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0" />
            <label htmlFor="agree-terms-register" className="text-sm text-slate-400 select-none">
              I agree to the <button type="button" className="text-amber-400 hover:underline">Terms & Conditions</button>
            </label>
          </div>
          {errors.agreedToTerms && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.agreedToTerms}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          {isLoading ? <><Loader className="w-5 h-5 animate-spin" /> Creating Account...</> : <><LogIn className="w-5 h-5" /> Sign Up</>}
        </button>

      </form>

      <div className="pt-5 mt-5 border-t border-slate-700/50 relative z-10">
        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button type="button" onClick={() => onSwitchMode('login')} className="font-semibold text-amber-400 hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;