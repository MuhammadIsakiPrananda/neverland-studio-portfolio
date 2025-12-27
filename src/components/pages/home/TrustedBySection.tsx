import { 
  Monitor, 
  Search, 
  ShoppingCart, 
  Apple, 
  Users, 
  Film, 
  Zap, 
  Music, 
  Palette, 
  Server, 
  Database, 
  Cloud, 
  DollarSign, 
  Cpu, 
  Rocket 
} from 'lucide-react';

// Calculate animation delay based on current time to maintain position across refreshes
const getAnimationDelay = () => {
  const now = Date.now();
  const animationDuration = 25000; // 25 seconds in milliseconds (for mobile)
  const offset = -(now % animationDuration) / 1000; // Convert to seconds with negative value
  return `${offset}s`;
};

export default function TrustedBySection() {

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

  // Duplicate companies array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies, ...companies];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg">
            <span className="text-xs sm:text-sm font-semibold">Trusted Worldwide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white px-4">
            Trusted by Industry Leaders
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            Partnering with leading companies across the globe
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Scrolling wrapper */}
          <div 
            className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll-mobile sm:animate-scroll-tablet md:animate-scroll-desktop"
            style={{ animationDelay: getAnimationDelay() }}
          >
            {duplicatedCompanies.map((company, idx) => {
              const Icon = company.icon;
              return (
                <div
                  key={idx}
                  className="group flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3"
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-400 group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110" />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-400 group-hover:text-white transition-colors duration-300 text-center whitespace-nowrap">
                    {company.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS for animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        /* Mobile - faster scroll */
        .animate-scroll-mobile {
          display: flex;
          animation: scroll 25s linear infinite;
          animation-play-state: running;
        }

        /* Tablet - medium speed */
        @media (min-width: 640px) {
          .animate-scroll-tablet {
            animation: scroll 35s linear infinite;
            animation-play-state: running;
          }
        }

        /* Desktop - slower, more relaxed */
        @media (min-width: 768px) {
          .animate-scroll-desktop {
            animation: scroll 45s linear infinite;
            animation-play-state: running;
          }
        }

        /* Smooth performance with GPU acceleration */
        .animate-scroll-mobile,
        .animate-scroll-tablet,
        .animate-scroll-desktop {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Ensure animation continues smoothly */
        @media (prefers-reduced-motion: no-preference) {
          .animate-scroll-mobile,
          .animate-scroll-tablet, 
          .animate-scroll-desktop {
            animation-timing-function: linear;
          }
        }
      `}</style>
    </section>
  );
}
