import { useState, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useClickOutside } from './useClickOutside';

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesia' },
];

const LanguageSwitcher = () => {
  const getInitialLanguage = () => {
    // 1. Coba dapatkan kode bahasa dari localStorage
    const savedLangCode = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (savedLangCode) {
      // 2. Cari objek bahasa yang sesuai dengan kode yang tersimpan
      const savedLang = languages.find((lang) => lang.code === savedLangCode);
      if (savedLang) {
        return savedLang;
      }
    }
    // 3. Jika tidak ada, gunakan Bahasa Indonesia sebagai default
    return languages[1];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Gunakan hook untuk menutup dropdown saat klik di luar
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLanguageSelect = (lang: Language) => {
    // 4. Update state dan simpan pilihan ke localStorage
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang.code);
    setIsOpen(false);
    // TODO: Tambahkan logika i18next di sini, misal: i18n.changeLanguage(lang.code);
    console.log(`Language changed to: ${lang.name}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700 rounded-lg hover:bg-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      >
        <Globe className="w-5 h-5" />
        <span>{selectedLanguage.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg animate-fade-in-down z-50">
          <ul className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageSelect(lang)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden bg-slate-700/50 shrink-0 text-xs font-bold select-none">
                    {lang.code.toUpperCase()}
                  </span>
                  <span className="truncate">{lang.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;