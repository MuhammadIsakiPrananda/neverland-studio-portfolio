import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader, AlertCircle, Eye, EyeOff, ShieldX } from 'lucide-react';
import { useNotification } from './useNotification';

interface LoginFormProps {
  onSwitchMode: (mode: 'register' | 'forgotPassword') => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { addNotification } = useNotification();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'test@example.com' && password === 'password') {
        setErrors({});
        addNotification('Login Successful', 'Welcome back!', 'success');
        onClose();
      } else {
        setApiError('Invalid email or password.');
        addNotification('Login Failed', 'Please check your credentials and try again.', 'error');
      }
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6 text-center">Sign In</motion.h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
          >
            <ShieldX className="w-5 h-5" />
            <span>{apiError}</span> 
          </motion.div>
        )}
        <motion.div variants={itemVariants} className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validate}
            className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors disabled:opacity-50 ${errors.email ? 'border-red-500/50' : 'border-slate-700'}`}
            required
            disabled={isLoading}
          />
        </motion.div>
        {errors.email && <p className="text-xs text-red-400 -mt-4 ml-2">{errors.email}</p>}

        <motion.div variants={itemVariants} className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validate}
            className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-12 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-slate-700'}`}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </motion.div>
        {errors.password && <p className="text-xs text-red-400 -mt-4 ml-2">{errors.password}</p>}

        <motion.div variants={itemVariants} className="text-right">
          <button
            type="button"
            onClick={() => onSwitchMode('forgotPassword')}
            className="text-sm text-cyan-400 hover:underline disabled:opacity-50"
            disabled={isLoading} 
          >
            Forgot Password?
          </button>
        </motion.div>
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading || !email || !password || Object.keys(errors).length > 0}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:transform-none" 
        >
          {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </motion.button>
        <motion.p variants={itemVariants} className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button type="button" onClick={() => onSwitchMode('register')} className="font-semibold text-cyan-400 hover:underline disabled:opacity-50" disabled={isLoading}> 
            Sign Up
          </button>
        </motion.p>
      </form>
    </motion.div>
  );
};

export default LoginForm;