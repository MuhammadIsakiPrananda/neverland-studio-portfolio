import { Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ProfileDropdownProps {
  user: {
    username: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  onEditProfile: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({ user, onEditProfile, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayName = user.name || user.username;
  const avatarText = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-slate-800/50 text-slate-200"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30">
          {user.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            avatarText
          )}
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden sm:block text-sm font-medium">
          {displayName}
        </span>

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden bg-slate-800 border border-slate-700 animate-scale-in origin-top-right z-50">
          {/* User Info */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30">
                {user.avatar ? (
                  <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  avatarText
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-white">
                  {displayName}
                </p>
                {user.email && (
                  <p className="text-xs truncate text-slate-400">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onEditProfile();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-slate-700/50 text-slate-300 hover:text-white"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Edit Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 text-slate-300 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
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

        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
