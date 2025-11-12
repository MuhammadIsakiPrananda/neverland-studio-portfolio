import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import { useNotification } from './useNotification';
import ReCAPTCHA from "react-google-recaptcha";

interface RegisterFormProps {
  onSwitchMode: (mode: 'login') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchMode }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '', suggestions: [] as string[] });
  const { addNotification } = useNotification();

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    const suggestions: string[] = [];
    if (pass.length < 8) {
      suggestions.push('Use 8+ characters');
    } else {
      score++;
    }
    if (/[A-Z]/.test(pass)) score++; else suggestions.push('Use an uppercase letter');
    if (/[a-z]/.test(pass)) score++; else suggestions.push('Use a lowercase letter');
    if (/[0-9]/.test(pass)) score++; else suggestions.push('Use a number');
    if (/[^A-Za-z0-9]/.test(pass)) score++; else suggestions.push('Use a symbol');

    let label = 'Weak';
    let color = 'bg-red-500';
    if (score > 2) { label = 'Medium'; color = 'bg-yellow-500'; }
    if (score > 4) { label = 'Strong'; color = 'bg-green-500'; }
    
    setPasswordStrength({ score, label, color, suggestions });
  };

  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', suggestions: [] });
    }
  }, [password]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) {
      return;
    }
    if (!captchaToken) {
      setApiError('Please complete the reCAPTCHA.');
      return;
    }

    setIsLoading(true);
    // Simulasi panggilan API
    setTimeout(() => {
      setIsLoading(false);
      // Ganti dengan logika registrasi sesungguhnya
      addNotification('Registration Successful', 'Welcome! Please check your email to verify your account.', 'success');
      // Di sini Anda akan mengirim captchaToken ke backend untuk verifikasi
      onSwitchMode('login');
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const isFormValid = !Object.values(errors).some(Boolean) && fullName && email && password && confirmPassword && password === confirmPassword && !!captchaToken;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6 text-center">Create an Account</motion.h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 -mb-2">
            <AlertCircle className="w-5 h-5" /><span>{apiError}</span>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) { 
              setErrors(prev => { const { fullName, ...rest } = prev; return rest; });
            }
          }} onBlur={validate}
            className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors disabled:opacity-50 ${errors.fullName ? 'border-red-500/50' : 'border-slate-700'}`}
            disabled={isLoading} required />
        </motion.div>
        {errors.fullName && <p className="text-xs text-red-400 -mt-2 ml-2">{errors.fullName}</p>}

        <motion.div variants={itemVariants} className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) { 
              setErrors(prev => { const { email, ...rest } = prev; return rest; });
            }
          }} onBlur={validate}
            className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors disabled:opacity-50 ${errors.email ? 'border-red-500/50' : 'border-slate-700'}`}
            disabled={isLoading} required />
        </motion.div>
        {errors.email && <p className="text-xs text-red-400 -mt-2 ml-2">{errors.email}</p>}

        <motion.div variants={itemVariants} className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) { 
              setErrors(prev => { const { password, ...rest } = prev; return rest; });
            }
          }} onBlur={validate}
            className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-12 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-slate-700'}`}
            disabled={isLoading} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </motion.div>
        {errors.password && <p className="text-xs text-red-400 -mt-2 ml-2">{errors.password}</p>}

        {password && (
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <p className="font-medium">Password Strength: <span className={`font-bold ${passwordStrength.score > 4 ? 'text-green-400' : passwordStrength.score > 2 ? 'text-yellow-400' : 'text-red-400'}`}>{passwordStrength.label}</span></p>
            </div>
            <div className="flex gap-1 h-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1/5 rounded-full ${i < passwordStrength.score ? passwordStrength.color : 'bg-slate-700'}`}></div>
              ))}
            </div>
            {passwordStrength.suggestions.length > 0 && passwordStrength.score < 5 && (
              <ul className="text-xs text-slate-400 list-disc list-inside pl-1">
                {passwordStrength.suggestions.slice(0, 2).map(s => <li key={s}>{s}</li>)}
              </ul>
            )}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) { 
              setErrors(prev => { const { confirmPassword, ...rest } = prev; return rest; });
            }
          }} onBlur={validate}
            className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-12 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500/50' : 'border-slate-700'}`}
            disabled={isLoading} required />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors" aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </motion.div>
        {errors.confirmPassword && <p className="text-xs text-red-400 -mt-2 ml-2">{errors.confirmPassword}</p>}

        <motion.div variants={itemVariants} className="flex justify-center">
          <ReCAPTCHA
            sitekey="6Lc5EAgsAAAAAMBLswyP5OAl7Tzo8BYXLHWGKLZt" // <-- Site Key Anda
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
            theme="dark"
          />
        </motion.div>

        <motion.button variants={itemVariants} type="submit" disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:transform-none">
          {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
          {isLoading ? 'Registering...' : 'Register'}
        </motion.button>

        <motion.p variants={itemVariants} className="text-center text-sm text-slate-400 pt-2">
          Already have an account?{' '}
          <button type="button" onClick={() => onSwitchMode('login')} className="font-semibold text-cyan-400 hover:underline disabled:opacity-50" disabled={isLoading}>
            Sign In
          </button>
        </motion.p>
      </form>
    </motion.div>
  );
};

export default RegisterForm;