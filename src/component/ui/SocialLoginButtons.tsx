import type { JSX } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { useSocialAuth, type AuthProvider } from './useSocialAuth';
import { Loader } from 'lucide-react';
import { User } from '@/types/user';

// Ikon Google tidak ada di lucide-react, jadi kita gunakan SVG.
// Ini adalah SVG Google yang umum digunakan.
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.901,36.61,44,30.817,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

type SocialProviderConfig = {
  name: AuthProvider;
  icon: JSX.Element;
};

const socialProviders: SocialProviderConfig[] = [
  {
    name: 'google',
    icon: <GoogleIcon />,
  },
  {
    name: 'github',
    icon: <Github className="h-6 w-6" />,
  },
  {
    name: 'linkedin',
    icon: <Linkedin className="h-6 w-6" />,
  },
];

interface SocialLoginButtonsProps {
  onLoginSuccess: (user: User, provider: AuthProvider) => void;
}

const SocialLoginButtons = ({ onLoginSuccess }: SocialLoginButtonsProps) => {
  const { initiateLogin, isLoading } = useSocialAuth(onLoginSuccess);

  return (
    <div className="w-full">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-500">Atau lanjutkan dengan</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => initiateLogin(provider.name)}
            disabled={!!isLoading}
            className="inline-flex w-full justify-center items-center rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 px-4 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Login with ${provider.name}`}
          >
            {isLoading === provider.name ? <Loader className="animate-spin" size={24} /> : provider.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLoginButtons;