import { FaGoogle, FaGithub } from "react-icons/fa";
import type { IconType } from "react-icons";
import { Loader } from "lucide-react";
import { useSocialAuth, type AuthProvider } from "../hooks/useSocialAuth";
type SocialProviderConfig = {
  name: AuthProvider;
  icon: IconType;
  label: string;
};

const socialProviders: SocialProviderConfig[] = [
  {
    name: "google",
    icon: FaGoogle,
    label: "Sign in with Google",
  },
  {
    name: "github",
    icon: FaGithub,
    label: "Sign in with GitHub",
  },
];

const SocialLoginButtons = () => {
  const { initiateLogin, isLoading } = useSocialAuth();

  return (
    <div className="w-full">
      <div className="mt-5 flex flex-col gap-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            onClick={() => initiateLogin(provider.name)}
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading === provider.name ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <provider.icon className="h-5 w-5" />
                <span>{provider.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLoginButtons;
