import type { Theme } from '../../../types';
import { X, Building2, MapPin, Users, Calendar, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo: string;
  location: string;
  employees: string;
  since: string;
  description: string;
  services: string[];
  website?: string;
}

interface CompanyModalProps {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  industryTitle: string;
}

export default function CompanyModal({ theme, isOpen, onClose, companies, industryTitle }: CompanyModalProps) {
  const isDark = theme === 'dark';

  // Close modal on ESC key and prevent body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const scrollY = window.scrollY;
      
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        } backdrop-blur-sm animate-fade-in`}
      />

      {/* Modal Container */}
      <div className={`
        relative w-full max-w-5xl max-h-[90vh] overflow-y-auto
        rounded-3xl shadow-2xl scrollbar-hide
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50' 
          : 'bg-gradient-to-br from-white via-stone-50 to-white border border-stone-200'}
        animate-scale-in
      `}>
        {/* Header */}
        <div className={`sticky top-0 z-10 ${
          isDark ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-xl border-b ${
          isDark ? 'border-gray-700/50' : 'border-stone-200'
        } p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 ${
                isDark 
                  ? 'bg-amber-400/10 border border-amber-400/20 text-amber-300' 
                  : 'bg-stone-800/5 border border-stone-300 text-stone-800'
              }`}>
                <Building2 className="w-3 h-3" />
                <span className="text-xs font-semibold">{industryTitle}</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                Our Trusted Partners
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-stone-100 text-stone-600 hover:text-stone-900'}
              `}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Company Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`
                group relative p-6 rounded-2xl
                ${isDark 
                  ? 'bg-gray-800/40 border border-gray-700/50 hover:border-amber-400/30' 
                  : 'bg-white/60 border border-stone-200/50 hover:border-stone-400/50'}
                backdrop-blur-xl shadow-lg
                hover:shadow-2xl hover:-translate-y-1
                transition-all duration-300
              `}
            >
              {/* Company Logo/Icon */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`
                  w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold
                  ${isDark 
                    ? 'bg-gradient-to-br from-amber-400/20 to-amber-500/20 text-amber-300' 
                    : 'bg-gradient-to-br from-stone-700/10 to-stone-800/10 text-stone-800'}
                  shadow-lg
                `}>
                  {company.logo}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-stone-900'
                  }`}>
                    {company.name}
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-stone-600'
                  }`}>
                    {company.industry}
                  </p>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-stone-500'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-stone-600'
                  }`}>
                    {company.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-stone-500'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-stone-600'
                  }`}>
                    {company.employees} employees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-stone-500'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-stone-600'
                  }`}>
                    Partner since {company.since}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm leading-relaxed mb-4 ${
                isDark ? 'text-gray-300' : 'text-stone-700'
              }`}>
                {company.description}
              </p>

              {/* Services */}
              <div className="mb-4">
                <p className={`text-xs font-semibold mb-2 ${
                  isDark ? 'text-gray-500' : 'text-stone-500'
                }`}>
                  SERVICES PROVIDED
                </p>
                <div className="flex flex-wrap gap-2">
                  {company.services.map((service, idx) => (
                    <span
                      key={idx}
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${isDark 
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' 
                          : 'bg-stone-800/5 text-stone-800 border border-stone-300'}
                      `}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Website Link */}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center gap-2 text-sm font-semibold
                    ${isDark 
                      ? 'text-amber-400 hover:text-amber-300' 
                      : 'text-stone-900 hover:text-stone-700'}
                    transition-colors duration-300
                  `}
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

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

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        /* Hide scrollbar but maintain scroll functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}
