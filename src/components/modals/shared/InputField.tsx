import { useState } from 'react';
import type { ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Theme } from '../../../types';

interface InputFieldProps {
  theme: Theme;
  type: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
  minLength?: number;
}

export default function InputField({
  theme,
  type,
  label,
  value,
  onChange,
  icon,
  error,
  required = false,
  minLength,
}: InputFieldProps) {
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isFloating = isFocused || value.length > 0;
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={`
            absolute left-4 top-1/2 -translate-y-1/2 z-10
            transition-all duration-300
            ${isFocused 
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]'
              : 'text-slate-400'
            }
          `}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          minLength={minLength}
          className={`
            w-full ${icon ? 'pl-12' : 'pl-4'} ${type === 'password' ? 'pr-12' : 'pr-4'} pt-6 pb-2
            rounded-xl
            transition-all duration-300 ease-out
            bg-slate-800/50 text-white placeholder-transparent
            ${error 
              ? 'border-2 border-red-500/50 focus:border-red-500'
              : isFocused
                ? 'border-2 border-blue-500/50 ring-2 ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                : 'border-2 border-slate-700/50 hover:border-slate-600/50'
            }
            focus:outline-none
            backdrop-blur-sm
          `}
          placeholder={label}
        />

        {/* Floating Label */}
        <label
          className={`
            absolute ${icon ? 'left-12' : 'left-4'} pointer-events-none
            transition-all duration-300 ease-out
            ${isFloating 
              ? 'top-2 text-xs' 
              : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${isFocused
              ? 'text-blue-400 font-medium'
              : 'text-slate-400'
            }
            ${error && !isFocused ? 'text-red-400' : ''}
          `}
        >
          {label}
        </label>

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2
              p-1.5 rounded-lg
              transition-all duration-300
              hover:bg-slate-700/50 active:bg-slate-600/50
              hover:scale-110 active:scale-95
              group
            `}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            ) : (
              <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            )}
          </button>
        )}

        {/* Focus Glow Effect */}
        {isFocused && !error && (
          <div className={`
            absolute inset-0 rounded-xl -z-10
            blur-xl opacity-40
            bg-blue-500/30
            animate-pulse
          `} />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className={`
          mt-1.5 text-xs
          text-red-400
          animate-slideDown
          flex items-center gap-1
        `}>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
