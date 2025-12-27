import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import type { Theme } from '../../../types';

interface BaseModalProps {
  theme: Theme;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  showPattern?: boolean;
}

export default function BaseModal({
  theme,
  onClose,
  onBack,
  title,
  subtitle,
  children,
  showPattern = true,
}: BaseModalProps) {

  // Disable body scroll when modal is open
  useEffect(() => {
    // Store original overflow style
    const originalOverflow = document.body.style.overflow;
    
    // Disable scroll
    document.body.style.overflow = 'hidden';
    
    // Re-enable scroll on cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeInBackdrop p-2 sm:p-4"
    >
      <div
        className="relative w-full max-w-5xl h-auto max-h-[90vh] sm:max-h-[95vh] sm:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-modalSlideIn flex flex-col sm:flex-row"
        key={title}
      >
        {/* Left Side - Pattern/Illustration (40%) */}
        {showPattern && (
          <div className="hidden md:flex w-[40%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated Pattern Background */}
            <div className="absolute inset-0">
              {/* Geometric Shapes */}
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-float" />
              <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-blue-400/10 blur-3xl animate-float-delayed" />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-6 grid-rows-6 h-full gap-4 p-8">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="bg-blue-400/20 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-12 flex flex-col justify-center">
              <div className="text-blue-400 mb-6">
                {title === 'Create Account' ? (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ) : title === 'Reset Password' ? (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">
                {title === 'Create Account' ? 'Register' : 
                 title === 'Reset Password' ? 'Forgot Password' : (
                  <>
                    Welcome to<br />
                    Neverland Studio
                  </>
                )}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {title === 'Create Account' 
                  ? 'Create your account and start your journey with us. Join the Neverland Studio community today.'
                  : title === 'Reset Password'
                  ? 'No worries! We\'ll send you reset instructions to your email. Get back to your account in no time.'
                  : 'Secure access to your portfolio and projects. Experience the magic of seamless collaboration.'
                }
              </p>
              
              {/* Decorative Elements */}
              <div className="mt-12 flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-8' : 'w-2'} bg-blue-400`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Form Content (60%) */}
        <div className={`${showPattern ? 'w-full md:w-[60%]' : 'w-full'} relative bg-slate-900 flex flex-col min-h-0 overflow-hidden`}>
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 z-0" />

          {/* Content Area with Scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 pb-6 sm:pb-8 scrollbar-hide">
            {/* Header with Close Button */}
            <div className="relative pt-6 sm:pt-8 pb-0">
              {/* Close Button - Clean */}
              <button
                onClick={onClose}
                className="absolute top-4 right-0 z-20 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
              </button>

              {/* Back Button - Clean */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="absolute top-4 left-0 z-20 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                </button>
              )}
            </div>

            <div className={`${onBack ? 'mt-4' : 'mt-8'}`}>
              {/* Title */}
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                {title}
              </h2>
              
              {/* Subtitle */}
              <p className="text-sm mb-8 text-slate-400">
                {subtitle}
              </p>

              {/* Form Content */}
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.96); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-fadeInBackdrop { animation: fadeInBackdrop 0.3s ease-out; }
        .animate-modalSlideIn { animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .animate-float { animation: float 7s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 9s ease-in-out infinite; animation-delay: 1s; }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
