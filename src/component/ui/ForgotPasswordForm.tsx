import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: 'login') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email is required.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Di sini Anda akan mengirim captchaToken dan email ke backend
      // untuk verifikasi dan pengiriman email reset.
      setIsLoading(false);
      setIsSubmitted(true);
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
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-2">Check Your Email</motion.h2>
          <motion.p variants={itemVariants} className="text-slate-400 mb-6">
            We've sent a password reset link to your email address.
          </motion.p>
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => onSwitchMode('login')}
            className="font-semibold text-cyan-400 hover:underline"
          >
            Back to Sign In
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-2 text-center">Forgot Password?</motion.h2>
          <motion.p variants={itemVariants} className="text-slate-400 text-center mb-6 text-sm">Enter your email and we'll send you a reset link.</motion.p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 -mb-2">
                <AlertCircle className="w-5 h-5" /><span>{error}</span>
              </motion.div>
            )}
            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-4 py-3 text-white focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors ${error && !email ? 'border-red-500/50' : 'border-slate-700'}`}
                required
                disabled={isLoading}
              />
            </motion.div>
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:transform-none"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </motion.button>
            <motion.p variants={itemVariants} className="text-center text-sm text-slate-400">
              Remember your password?{' '}
              <button type="button" onClick={() => onSwitchMode('login')} className="font-semibold text-cyan-400 hover:underline disabled:opacity-70" disabled={isLoading}>
                Sign In
              </button>
            </motion.p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordForm;