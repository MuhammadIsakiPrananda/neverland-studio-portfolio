import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English', shortName: 'EN' },
  { code: 'id', name: 'Bahasa Indonesia', shortName: 'ID' },
];

export default function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
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

  const handleLanguageChange = (code: string) => {
    setLanguage(code as 'en' | 'id');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 text-slate-300 hover:text-white group"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium">{currentLang.shortName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] sm:w-64 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 ring-1 ring-black/20">
            {/* Header */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800/50 bg-slate-800/30">
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Select Language</span>
              </div>
            </div>

            {/* Language Options */}
            <div className="p-1 sm:p-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    w-full flex items-center justify-between gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg
                    transition-all duration-200
                    ${language === lang.code
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-5 sm:w-8 sm:h-6 rounded flex items-center justify-center bg-slate-800 border border-slate-700/50 text-[10px] sm:text-xs font-bold">
                      {lang.shortName}
                    </div>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
