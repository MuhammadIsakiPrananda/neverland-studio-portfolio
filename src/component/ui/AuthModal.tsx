import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from '../ui/LoginForm';
import RegisterForm from '../ui/RegisterForm';
import ForgotPasswordForm from '../ui/ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgotPassword';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleClose = () => {
    onClose();
    // Reset to login mode after a short delay to allow for exit animation
    setTimeout(() => setMode('login'), 300);
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      y: "-100vh",
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      y: "0",
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      }
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden" // We keep exit for the animation, but remove onClick
        >
          <motion.div
            className="bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl shadow-cyan-900/20 p-8 w-full max-w-md relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <AnimatePresence mode="wait">
              {mode === 'login' && <LoginForm key="login" onSwitchMode={setMode} onClose={handleClose} />}
              {mode === 'register' && <RegisterForm key="register" onSwitchMode={setMode} />}
              {mode === 'forgotPassword' && <ForgotPasswordForm key="forgot" onSwitchMode={setMode} />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;