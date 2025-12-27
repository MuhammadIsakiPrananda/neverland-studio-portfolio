import React from 'react';
import { MessageCircle, Mail, ChevronUp, X } from 'lucide-react';
import { Theme } from '../../types';

interface FloatingButtonsProps {
  theme: Theme;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

export default function FloatingButtons({ theme, showMenu, setShowMenu }: FloatingButtonsProps) {
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ${showMenu ? 'mb-4' : 'mb-0 opacity-0 pointer-events-none'}`}>
        <a href="https://wa.me/1234567890" className={`p-4 rounded-full ${isDark ? 'bg-green-500' : 'bg-green-600'} text-white shadow-xl hover:scale-110 transition-transform`}>
          <MessageCircle className="w-6 h-6" />
        </a>
        <a href="mailto:hello@neverlandstudio.com" className={`p-4 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'} text-white shadow-xl hover:scale-110 transition-transform`}>
          <Mail className="w-6 h-6" />
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`p-4 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-800'} text-white shadow-xl hover:scale-110 transition-transform`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`p-4 rounded-full ${isDark ? 'bg-yellow-500 text-gray-900' : 'bg-gray-900 text-white'} shadow-xl hover:scale-110 transition-transform`}
      >
        {showMenu ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
