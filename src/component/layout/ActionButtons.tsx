import { Globe, LogIn } from 'lucide-react';

interface ActionButtonsProps {
  onLoginClick: () => void;
  onGetStartedClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onLoginClick, onGetStartedClick }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button className="flex items-center justify-center w-10 h-10 text-slate-300 hover:text-white transition-colors rounded-full">
          <Globe className="w-5 h-5" />
        </button>
      </div>
      <button 
        onClick={onLoginClick}
        className="hidden sm:flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors px-4 py-2 text-sm rounded-full tracking-wide"
      >
          <LogIn className="w-4 h-4" />
          Login
      </button>
      <button onClick={onGetStartedClick} className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full shadow-md shadow-cyan-900/50 hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm font-semibold transform hover:-translate-y-0.5 tracking-wide">
          Get Started
      </button>
    </div>
  );
};

export default ActionButtons;