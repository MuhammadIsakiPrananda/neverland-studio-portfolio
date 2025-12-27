import type { Theme } from '../../types';
import { X, Lock, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LoginModalProps {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

export default function LoginModal({ theme, isOpen, onClose, onLogin }: LoginModalProps) {
  const isDark = theme === 'dark';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check
    if (username === 'admin' && password === 'admin') {
      onLogin(username);
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        } backdrop-blur-sm animate-fade-in`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`
        relative w-full max-w-md
        rounded-3xl shadow-2xl
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50' 
          : 'bg-gradient-to-br from-white via-stone-50 to-white border border-stone-200'}
        animate-scale-in p-6 sm:p-8
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`
            absolute top-4 right-4 p-2 rounded-xl transition-all duration-300
            ${isDark 
              ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
              : 'hover:bg-stone-100 text-stone-600 hover:text-stone-900'}
          `}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            isDark 
              ? 'bg-amber-400/20 text-amber-300' 
              : 'bg-stone-800/10 text-stone-700'
          }`}>
            <Lock className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}>
            Welcome Back
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-stone-600'
          }`}>
            Please login to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-stone-700'
            }`}>
              Username
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-gray-500' : 'text-stone-400'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                    : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                  focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                `}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-stone-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-gray-500' : 'text-stone-400'
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-amber-400/50' 
                    : 'bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-400'}
                  focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-amber-400/20' : 'focus:ring-stone-400/20'}
                `}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`
              w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300
              ${isDark 
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 hover:from-amber-400 hover:to-amber-300' 
                : 'bg-gradient-to-r from-stone-900 to-stone-800 text-white hover:from-stone-800 hover:to-stone-700'}
              hover:scale-105 hover:shadow-xl
            `}
          >
            Login
          </button>
        </form>

        {/* Test Credentials Info */}
        <div className={`mt-6 p-4 rounded-xl ${
          isDark 
            ? 'bg-blue-500/10 border border-blue-400/20' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-xs text-center ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>
            <strong>Test Credentials:</strong><br />
            Username: admin | Password: admin
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
