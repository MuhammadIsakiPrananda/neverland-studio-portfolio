import { ArrowRight, Play, Monitor, Search, ShoppingCart, Apple, Users, Film, Zap, Music, Palette, Server, Database, Cloud, DollarSign, Cpu, Rocket, Instagram, Linkedin, Github, Twitter } from 'lucide-react';
import profileImage from '../../../assets/Profile Neverland Studio.jpg';
import { useLanguage } from '../../../contexts/LanguageContext';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

const getAnimationDelay = () => {
  const now = Date.now();
  const animationDuration = 60000;
  const offset = -(now % animationDuration) / 1000;
  return `${offset}s`;
};

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useLanguage();
  const companies = [
    { name: 'Microsoft', icon: Monitor },
    { name: 'Google', icon: Search },
    { name: 'Amazon', icon: ShoppingCart },
    { name: 'Apple', icon: Apple },
    { name: 'Meta', icon: Users },
    { name: 'Netflix', icon: Film },
    { name: 'Tesla', icon: Zap },
    { name: 'Spotify', icon: Music },
    { name: 'Adobe', icon: Palette },
    { name: 'IBM', icon: Server },
    { name: 'Oracle', icon: Database },
    { name: 'SAP', icon: Cloud },
    { name: 'Salesforce', icon: DollarSign },
    { name: 'Intel', icon: Cpu },
    { name: 'NVIDIA', icon: Rocket }
  ];

  // Duplicate companies 4 times for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

  return (
    <section className="relative overflow-hidden -mt-20 border-b bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-slate-800">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Radial gradient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto min-h-[60vh] flex items-center pt-32 pb-8">
          
          {/* Flex Column: Image Top (Mobile) + Text Below */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-center w-full">
            
            {/* Profile Image - Shows on Top for Mobile */}
            <div className="relative order-1 lg:order-2 w-full flex justify-center lg:justify-end animate-fade-in-right delay-200">
              <div className="relative group w-32 sm:w-40 md:w-48 lg:w-full max-w-sm">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl blur-2xl opacity-20 transition-opacity duration-500 bg-blue-500/30 group-hover:opacity-30" />
                
                {/* Image Container with reserved space untuk prevent CLS */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-500/10 transition-all duration-300 hover:scale-[1.01] hover:border-blue-500/50">
                  {/* Placeholder dengan aspect ratio 1:1 untuk mencegah layout shift */}
                  <div className="aspect-square" />
                  <img 
                    src={profileImage} 
                    alt="Neverland Studio"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                </div>
              </div>
            </div>

            {/* Text Content - Below Image on Mobile */}
            <div className="space-y-4 order-2 lg:order-1 text-center lg:text-left animate-fade-in-left">
              
              {/* Main Title */}
              <h1 className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                  {t('home.hero.greeting')}
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('home.hero.subtitle')}
                </div>
              </h1>
              
              {/* Description */}
              <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-slate-300">
                {t('home.hero.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start animate-fade-in-up delay-300">
                <button 
                  onClick={() => onNavigate('contact')}
                  className="group px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  <span className="flex items-center gap-2">
                    {t('home.hero.cta')}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button 
                  onClick={() => window.open('https://www.youtube.com/@NeverlandStudio-pl1yg', '_blank')}
                  className="group px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all duration-300 border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                    Watch Demo
                  </span>
                </button>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start animate-fade-in-up delay-400">
                <span className="text-xs text-slate-500">Follow us:</span>
                <div className="flex gap-3">
                  <a 
                    href="https://instagram.com/neverlandstudio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/neverlandstudio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://github.com/neverlandstudio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://twitter.com/neverlandstudio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Trusted Companies - Minimalist Carousel */}
        <div className="pb-12 pt-4 animate-fade-in-up delay-500">
          {/* Text with Border Lines */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 sm:px-6 bg-slate-950 text-xs sm:text-sm text-slate-500 font-medium">
                Trusted by industry leaders
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className="flex gap-8 sm:gap-10 md:gap-12 animate-scroll items-center"
              style={{ animationDelay: getAnimationDelay() }}
            >
              {duplicatedCompanies.map((company, idx) => {
                const Icon = company.icon;
                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                    <span className="text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">
                      {company.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 4));
          }
        }

        .animate-scroll {
          display: flex;
          animation: scroll 60s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
