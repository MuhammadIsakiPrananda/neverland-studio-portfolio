import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
}

type AuthMode = 'login' | 'register' | 'forgotPassword';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Efek untuk me-reset mode ke 'login' saat modal ditutup.
  // Ini memastikan pengguna selalu disambut dengan form login.
  useEffect(() => {
    if (!isOpen) {
      // Tambahkan sedikit jeda agar reset terjadi setelah animasi penutupan selesai.
      const timer = setTimeout(() => {
        setMode('login');
      }, 200); // Durasi 200ms cocok dengan animasi 'leave'
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const renderContent = () => {
    switch (mode) {
      case 'register':
        return <RegisterForm onSwitchMode={handleSwitchMode} onRegisterSuccess={onLoginSuccess} />;
      case 'forgotPassword':
        return <ForgotPasswordForm onSwitchMode={handleSwitchMode} />;
      case 'login':
      default:
        return <LoginForm onSwitchMode={handleSwitchMode} onLoginSuccess={onLoginSuccess} />;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      {/* 
        Properti onClose diubah menjadi fungsi kosong `() => {}` untuk mencegah modal tertutup saat mengklik di luar.
        Penutupan modal sekarang hanya dikontrol oleh tombol 'X' di dalam Dialog.Panel.
      */}
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        {/* Backdrop (overlay) dengan transisi fade dan efek blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Panel Modal dengan transisi fade dan scale */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 p-8 text-left align-middle shadow-2xl shadow-amber-500/10 transition-all">
                {/* Tombol Close (X) */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                {renderContent()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;