import { useState, useRef } from "react";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "./useClickOutside";
import { useLanguage } from "@/contexts/LanguageContext";

interface Language {
  code: "en" | "id";
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "id", name: "Indonesian", nativeName: "Indonesia" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedLanguage =
    languages.find((lang) => lang.code === language) || languages[1];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Minimalist Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500"
      >
        <Globe className="h-5 w-5" />
        <span>{selectedLanguage.code.toUpperCase()}</span>
      </button>

      {/* Minimalist Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 origin-top-right bg-slate-900/90 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl shadow-black/40 z-50"
          >
            <div className="p-1.5">
              {languages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? "bg-amber-500/10 text-amber-300"
                        : "text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{lang.nativeName}</div>
                        <div
                          className={`text-xs ${
                            isSelected ? "text-amber-400/70" : "text-slate-400"
                          }`}
                        >
                          {lang.name}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
