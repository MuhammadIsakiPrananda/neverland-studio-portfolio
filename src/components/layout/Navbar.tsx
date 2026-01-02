import { useEffect, useState } from 'react';
import { Menu, X, LogIn, LogOut, Home, Info, Briefcase, FolderKanban, CreditCard, Quote, Mail, ChevronDown } from 'lucide-react';
import logoImage from '../../assets/Profile Neverland Studio.jpg';
import ProfileDropdown from '../common/ProfileDropdown';
import LanguageDropdown from '../common/LanguageDropdown';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavbarProps {
  currentPage: string;
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  setCurrentPage: (page: string) => void;
  setIsMenuOpen: (open: boolean) => void;

  handleLogout: () => void;
  setShowLoginModal: (show: boolean) => void;
  userProfile?: any;
  onShowProfileEdit?: () => void;
  onSimpleLogout?: () => void;
}

export default function Navbar({
  currentPage,
  isMenuOpen,
  isAuthenticated,
  setCurrentPage,
  setIsMenuOpen,

  handleLogout,
  setShowLoginModal,
  userProfile,
  onShowProfileEdit,
  onSimpleLogout
}: NavbarProps) {
  const { t } = useLanguage();
  const [expandAbout, setExpandAbout] = useState(false);
  const [expandServices, setExpandServices] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuItems = [
    { key: 'home', icon: <Home className="w-4 h-4" />, label: t('nav.home') },
    { key: 'about', icon: <Info className="w-4 h-4" />, label: t('nav.about') },
    { key: 'services', icon: <Briefcase className="w-4 h-4" />, label: t('nav.services') },
    { key: 'projects', icon: <FolderKanban className="w-4 h-4" />, label: t('nav.portfolio') },
    { key: 'pricing', icon: <CreditCard className="w-4 h-4" />, label: t('nav.pricing') },
    { key: 'testimonials', icon: <Quote className="w-4 h-4" />, label: t('nav.testimonials') },
    { key: 'contact', icon: <Mail className="w-4 h-4" />, label: t('nav.contact') }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-2.5" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto">
          <div className="relative backdrop-blur-xl rounded-full px-4 py-2 shadow-2xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-blue-500/30 -z-10">
              <div className="h-full w-full rounded-full bg-slate-900/90" />
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full blur-xl -z-20 opacity-30 bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-blue-500/20 transition-opacity duration-300" />
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage('home')}
                className="flex items-center space-x-2 group cursor-pointer"
                aria-label="Go to homepage"
              >
                {/* Logo */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full blur-lg transition-opacity duration-500 opacity-0 group-hover:opacity-60 bg-blue-400" />
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 border-blue-400/50 shadow-lg shadow-blue-500/30 group-hover:border-blue-400 group-hover:shadow-xl group-hover:shadow-blue-500/50 group-hover:scale-110">
                    <img 
                      src={logoImage} 
                      alt="Neverland Studio - IT Services & Digital Solutions Logo" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width="40"
                      height="40"
                    />
                  </div>
                </div>
                
                {/* Text */}
                <div className="flex flex-col">
                  <span className="font-bold text-base transition-all duration-300 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-cyan-300 group-hover:to-blue-300 drop-shadow-sm group-hover:drop-shadow-md">
                    Neverland Studio
                  </span>
                </div>
              </button>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-1">
                {menuItems.map((item) => {
                  // Special handling for Services menu with dropdown
                  if (item.key === 'services') {
                    return (
                      <div key={item.key} className="relative group/dropdown">
                        <button
                          onClick={() => setCurrentPage(item.key)}
                          className={`
                            relative flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-300 ease-out overflow-hidden
                            ${currentPage === item.key
                              ? 'text-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30' 
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}
                          `}
                        >
                          <div className={`
                            relative z-10 transition-all duration-300
                            ${currentPage === item.key
                              ? 'scale-105' 
                              : 'group-hover/dropdown:scale-110 group-hover/dropdown:-translate-y-0.5'}
                          `}>
                            {item.icon}
                          </div>
                          <span className="relative z-10">{item.label}</span>
                          <ChevronDown className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                        </button>
                        
                        {/* Clean Minimalist Dropdown Menu */}
                        <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-200 z-50">
                          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-xl border border-slate-700/50">
                            {/* IT Learning */}
                            <button
                              onClick={() => setCurrentPage('it-learning')}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                                currentPage === 'it-learning'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span className="font-medium">IT Learning</span>
                            </button>
                            
                            {/* IT Solutions */}
                            <button
                              onClick={() => setCurrentPage('it-solutions')}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 border-t border-slate-800/50 ${
                                currentPage === 'it-solutions'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="font-medium">IT Solutions</span>
                            </button>
                            
                            {/* IT Consulting */}
                            <button
                              onClick={() => setCurrentPage('it-consulting')}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 border-t border-slate-800/50 ${
                                currentPage === 'it-consulting'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              <span className="font-medium">IT Consulting</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Special handling for About menu with dropdown
                  if (item.key === 'about') {
                    return (
                      <div key={item.key} className="relative group/dropdown">
                        <button
                          onClick={() => setCurrentPage(item.key)}
                          className={`
                            relative flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-300 ease-out overflow-hidden
                            ${currentPage === item.key
                              ? 'text-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30' 
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}
                          `}
                        >
                          <div className={`
                            relative z-10 transition-all duration-300
                            ${currentPage === item.key
                              ? 'scale-105' 
                              : 'group-hover/dropdown:scale-110 group-hover/dropdown:-translate-y-0.5'}
                          `}>
                            {item.icon}
                          </div>
                          <span className="relative z-10">{item.label}</span>
                          <ChevronDown className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                        </button>
                        
                        {/* Clean Minimalist Dropdown Menu */}
                        <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-200 z-50">
                          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-xl border border-slate-700/50">
                            {/* Team Item */}
                            <button
                              onClick={() => setCurrentPage('team')}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                                currentPage === 'team'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="font-medium">Team</span>
                            </button>
                            
                            {/* Skills Item */}
                            <button
                              onClick={() => setCurrentPage('skills')}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 border-t border-slate-800/50 ${
                                currentPage === 'skills'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                              <span className="font-medium">{t('nav.skills')}</span>
                            </button>
                            
                            {/* Awards & Achievements Item */}
                            <button
                              onClick={() => setCurrentPage('awards')}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 border-t border-slate-800/50 ${
                                currentPage === 'awards'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                              <span className="font-medium">Awards</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Regular menu items
                  return (
                    <button
                      key={item.key}
                      onClick={() => setCurrentPage(item.key)}
                      className={`
                        relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${currentPage === item.key 
                          ? 'text-white bg-blue-600' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'}
                      `}
                    >
                      <div className="w-5 h-5">
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-2">
                <LanguageDropdown />
                
                {isAuthenticated ? (
                  userProfile && userProfile.username ? (
                    <ProfileDropdown
                      user={userProfile}
                      onEditProfile={() => onShowProfileEdit?.()}
                      onLogout={() => onSimpleLogout?.()}
                    />
                  ) : (
                    <div className="hidden lg:flex items-center space-x-2">
                      {userProfile?.role === 'admin' && (
                        <button
                          onClick={() => setCurrentPage('dashboard')}
                          className="px-3 py-1.5 rounded-full text-sm bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200"
                        >
                          Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="p-1.5 rounded-full hover:bg-red-900/20 text-red-400 transition-colors"
                        aria-label="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="hidden lg:flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t('nav.login')}</span>
                  </button>
                )}
                
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-1.5 text-slate-300"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 lg:hidden bg-black/60"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="fixed top-0 right-0 bottom-0 z-50 lg:hidden w-80 max-w-[85vw] bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out border-l border-slate-700/50">

            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                  <img 
                    src={logoImage} 
                    alt="Neverland Studio" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Menu
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
              {menuItems.map((item) => {
                // Special handling for Services with submenu
                if (item.key === 'services') {
                  return (
                    <div key={item.key}>
                      {/* Services Button */}
                      <button
                        onClick={() => setExpandServices(!expandServices)}
                        className={`
                          w-full flex items-center justify-between p-3.5 rounded-lg
                          transition-all duration-200
                          ${currentPage === item.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5">
                            {item.icon}
                          </div>
                          <span className="font-medium">
                            {item.label}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          expandServices ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Submenu Items */}
                      <div className={`overflow-hidden transition-all duration-200 ${
                        expandServices ? 'max-h-64 mt-2' : 'max-h-0'
                      }`}>
                        <div className="space-y-2 pl-4">
                          {/* Services Overview */}
                          <button
                            onClick={() => {
                              setCurrentPage('services');
                              setIsMenuOpen(false);
                            }}
                            className={`
                              w-full flex items-center space-x-3 p-3 rounded-lg
                              transition-all duration-200
                              ${currentPage === 'services'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'}
                            `}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.allServices')}</span>
                          </button>
                          
                          {/* IT Learning */}
                          <button
                            onClick={() => {
                              setCurrentPage('it-learning');
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.itLearning')}</span>
                          </button>
                          
                          {/* IT Solutions */}
                          <button
                            onClick={() => {
                              setCurrentPage('it-solutions');
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.itSolutions')}</span>
                          </button>
                          
                          {/* IT Consulting */}
                          <button
                            onClick={() => {
                              setCurrentPage('it-consulting');
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.itConsulting')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Special handling for About with submenu
                if (item.key === 'about') {
                  return (
                    <div key={item.key}>
                      {/* About Button */}
                      <button
                        onClick={() => setExpandAbout(!expandAbout)}
                        className={`
                          w-full flex items-center justify-between p-3.5 rounded-lg
                          transition-all duration-200
                          ${currentPage === item.key || currentPage === 'team' || currentPage === 'awards'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5">
                            {item.icon}
                          </div>
                          <span className="font-medium">
                            {item.label}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          expandAbout ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Submenu Items */}
                      <div className={`overflow-hidden transition-all duration-200 ${
                        expandAbout ? 'max-h-48 mt-2' : 'max-h-0'
                      }`}>
                        <div className="space-y-2 pl-4">
                          {/* About Us Item */}
                          <button
                            onClick={() => {
                              setCurrentPage('about');
                              setIsMenuOpen(false);
                            }}
                            className={`
                              w-full flex items-center space-x-3 p-3 rounded-lg
                              transition-all duration-200
                              ${currentPage === 'about'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'}
                            `}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.aboutUs')}</span>
                          </button>
                          
                          {/* Team Item */}
                          <button
                            onClick={() => {
                              setCurrentPage('team');
                              setIsMenuOpen(false);
                            }}
                            className={`
                              w-full flex items-center space-x-3 p-3 rounded-lg
                              transition-all duration-200
                              ${currentPage === 'team'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'}
                            `}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.team')}</span>
                          </button>
                          
                          {/* Awards Item */}
                          <button
                            onClick={() => {
                              setCurrentPage('awards');
                              setIsMenuOpen(false);
                            }}
                            className={`
                              w-full flex items-center space-x-3 p-3 rounded-lg
                              transition-all duration-200
                              ${currentPage === 'awards'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white'}
                            `}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span className="text-sm font-medium">{t('nav.awards')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Regular menu items
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setCurrentPage(item.key);
                      setIsMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 p-3.5 rounded-lg
                      transition-all duration-200
                      ${currentPage === item.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'}
                    `}
                  >
                    <div className="w-5 h-5">
                      {item.icon}
                    </div>
                    <span className="font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-800 bg-slate-900">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300 font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-blue-600/30 font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{t('nav.login')}</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
