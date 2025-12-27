import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';

interface CustomToastProps {
  t: Toast;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const CustomToast: React.FC<CustomToastProps> = ({ 
  t, 
  type, 
  message, 
  description, 
  duration = 4500,
  action
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrease = 100 / (duration / 50);
        const newProgress = Math.max(0, prev - decrease);
        
        // Auto-dismiss when progress reaches 0
        if (newProgress === 0) {
          setTimeout(() => toast.dismiss(t.id), 200);
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, t.id]);

  const styles = {
    success: {
      bg: 'bg-slate-900 dark:bg-slate-900',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      progress: 'bg-gradient-to-r from-emerald-500 to-green-500',
      Icon: CheckCircle,
      shadow: 'shadow-emerald-500/20',
    },
    error: {
      bg: 'bg-slate-900 dark:bg-slate-900',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/20',
      progress: 'bg-gradient-to-r from-red-500 to-rose-500',
      Icon: XCircle,
      shadow: 'shadow-red-500/20',
    },
    warning: {
      bg: 'bg-slate-900 dark:bg-slate-900',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      progress: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      Icon: AlertTriangle,
      shadow: 'shadow-amber-500/20',
    },
    info: {
      bg: 'bg-slate-900 dark:bg-slate-900',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      progress: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      Icon: Info,
      shadow: 'shadow-blue-500/20',
    },
  };

  const style = styles[type];
  const IconComponent = style.Icon;

  return (
    <div
      className={`
        ${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'}
        relative overflow-hidden w-full max-w-sm
        ${style.bg} ${style.border}
        border rounded-xl shadow-2xl ${style.shadow}
        backdrop-blur-xl
        pointer-events-auto
      `}
    >
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${style.iconBg} p-2.5 rounded-xl`}>
            <IconComponent className={`w-5 h-5 ${style.icon}`} />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-bold text-white text-sm leading-tight">
              {message}
            </p>
            {description && (
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                {description}
              </p>
            )}

            {/* Action Button */}
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  toast.dismiss(t.id);
                }}
                className={`
                  mt-2 px-3 py-1.5 rounded-lg text-xs font-medium
                  ${style.icon} ${style.iconBg}
                  hover:opacity-80 transition-opacity
                `}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className={`h-full ${style.progress} transition-all duration-100 ease-linear shadow-lg`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Enhanced Toaster component
export const ModernToaster = () => {
  return (
    <>
      <Toaster
        position="top-right"
        containerClassName="!top-20 !right-4 !z-[9999]"
        toastOptions={{
          duration: 4500,
          className: '!bg-transparent !shadow-none !p-0 !m-0',
        }}
        gutter={12}
      />
      
      {/* Custom Animations */}
      <style>{`
        @keyframes toast-enter {
          0% {
            transform: translateX(calc(100% + 1rem)) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes toast-leave {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100% + 1rem)) scale(0.95);
            opacity: 0;
          }
        }

        .animate-toast-enter {
          animation: toast-enter 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }

        .animate-toast-leave {
          animation: toast-leave 0.2s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
        }
      `}</style>
    </>
  );
};

// Helper functions with enhanced features
export const showSuccess = (
  message: string, 
  description?: string,
  action?: { label: string; onClick: () => void }
) => {
  toast.custom(
    (t) => (
      <CustomToast 
        t={t} 
        type="success" 
        message={message} 
        description={description}
        action={action}
        duration={4500} 
      />
    ),
    { duration: 4500 }
  );
};

export const showError = (
  message: string, 
  description?: string,
  action?: { label: string; onClick: () => void }
) => {
  toast.custom(
    (t) => (
      <CustomToast 
        t={t} 
        type="error" 
        message={message} 
        description={description}
        action={action}
        duration={6000} 
      />
    ),
    { duration: 6000 }
  );
};

export const showWarning = (
  message: string, 
  description?: string,
  action?: { label: string; onClick: () => void }
) => {
  toast.custom(
    (t) => (
      <CustomToast 
        t={t} 
        type="warning" 
        message={message} 
        description={description}
        action={action}
        duration={5000} 
      />
    ),
    { duration: 5000 }
  );
};

export const showInfo = (
  message: string, 
  description?: string,
  action?: { label: string; onClick: () => void }
) => {
  toast.custom(
    (t) => (
      <CustomToast 
        t={t} 
        type="info" 
        message={message} 
        description={description}
        action={action}
        duration={4000} 
      />
    ),
    { duration: 4000 }
  );
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    className: `
      !bg-white dark:!bg-slate-900 
      !text-slate-900 dark:!text-white 
      !border !border-slate-200 dark:!border-slate-700 
      !rounded-xl !shadow-lg
      !px-4 !py-3
    `,
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Promise-based notification
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: (data) => {
        const msg = typeof messages.success === 'function' 
          ? messages.success(data) 
          : messages.success;
        return msg;
      },
      error: (err) => {
        const msg = typeof messages.error === 'function' 
          ? messages.error(err) 
          : messages.error;
        return msg;
      },
    },
    {
      className: `
        !bg-white dark:!bg-slate-900 
        !text-slate-900 dark:!text-white 
        !border !border-slate-200 dark:!border-slate-700 
        !rounded-xl !shadow-lg
        !px-4 !py-3
      `,
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#fff',
      },
    }
  );
};

export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  dismiss: dismissToast,
  promise: showPromise,
};
