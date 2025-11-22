import { useState } from 'react';
import { User as UserIcon, Lock, Mail, LogIn, Loader, Eye, EyeOff, ShieldX } from 'lucide-react';
import { useNotification } from './useNotification';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import ReCAPTCHA from 'react-google-recaptcha';

interface RegisterFormProps {
  onSwitchMode: (mode: 'login') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; recaptcha?: string; }>({});
  const { addNotification } = useNotification();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid.';
    
    if (!password) {
      newErrors.password = 'Password is required.';
    } else {
      const passwordErrors = [];
      if (password.length < 8) {
        passwordErrors.push('at least 8 characters');
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push('a lowercase letter');
      }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push('an uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        passwordErrors.push('a number');
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        passwordErrors.push('a special character (e.g. !@#$)');
      }
      if (passwordErrors.length > 0) {
        newErrors.password = `Must contain ${passwordErrors.join(', ')}.`;
      }
    }

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!recaptchaToken) newErrors.recaptcha = 'Please verify you are not a robot.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    // Hapus error recaptcha jika token sudah ada
    if (token) {
      setErrors(prev => ({ ...prev, recaptcha: undefined }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika response dari server adalah error (4xx atau 5xx)
        throw new Error(data.message || 'An error occurred.');
      }

      // Jika registrasi berhasil
      setErrors({});
      addNotification('Registration Successful', `Welcome, ${data.user.name}! Please sign in.`, 'success');
      // Setelah registrasi berhasil, alihkan ke mode login
      onSwitchMode('login');

    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during registration.';
      setApiError(errorMessage);
      addNotification('Registration Failed', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div key="register" className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cyan-400">
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
            <input id="name" type="text" placeholder="e.g. Alex Johnson" value={name} onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: undefined }));
            }} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all disabled:opacity-50 ${errors.name ? 'border-red-500/50' : 'border-slate-700'}`} required disabled={isLoading} />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-400 mb-2 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="email" type="email" placeholder="e.g. alex@example.com" value={email} onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: undefined }));
            }} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all disabled:opacity-50 ${errors.email ? 'border-red-500/50' : 'border-slate-700'}`} required disabled={isLoading} />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password-reg" className="text-sm font-medium text-slate-400 mb-2 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="password-reg" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" value={password} onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: undefined }));
            }} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-slate-700'}`} required disabled={isLoading} />
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
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirm-password" className="text-sm font-medium text-slate-400 mb-2 block">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input id="confirm-password" type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" value={confirmPassword} onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: undefined }));
            }} className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500/50' : 'border-slate-700'}`} required disabled={isLoading} />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.confirmPassword}</p>}
        </div>

        <div className="pt-2">
          <ReCAPTCHA
            sitekey="6LctOhQsAAAAABekEQMZ1hW1PnP7Q-P-hp9r119H"
            onChange={handleRecaptchaChange}
            theme="dark"
          />
          {errors.recaptcha && <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">{errors.recaptcha}</p>}
        </div>

        <button type="submit" disabled={isLoading || !recaptchaToken} className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] mt-4 cursor-pointer">
          {isLoading ? <><Loader className="w-5 h-5 animate-spin" /> Creating Account...</> : <><LogIn className="w-5 h-5" /> Sign Up</>}
        </button>

        <p className="text-center text-sm text-slate-400 pt-2">
          Already have an account?{' '}
          <button type="button" onClick={() => onSwitchMode('login')} className="font-semibold text-cyan-400 hover:underline disabled:opacity-50" disabled={isLoading}>
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;