import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { Theme } from '../../types';
import CompanyStory from './about/CompanyStory';
import OurStory from './about/OurStory';
import WhatWeDo from './about/WhatWeDo';

interface AboutPageProps {
  theme: Theme;
}

export default function AboutPage({ theme }: AboutPageProps) {
  const section1 = useScrollReveal(0.1);
  const section2 = useScrollReveal(0.1);

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-indigo-500/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-violet-500/25 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.8s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[110px] animate-pulse" style={{animationDelay: '2.8s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-[400px] h-[400px] bg-fuchsia-500/15 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1.2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '55px 55px'
        }}></div>
        
        {/* Floating Particles */}
      </div>


      {/* Hero Section - extends behind navbar */}
      <div className="relative z-10 animate-fade-in-down">
        <CompanyStory />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Our Story Section */}
        <div 
          ref={section1.ref}
          className={`transition-all duration-1000 ${
            section1.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          <OurStory />
        </div>

        {/* What We Do Section */}
        <div 
          ref={section2.ref}
          className={`transition-all duration-1000 delay-100 ${
            section2.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          <WhatWeDo />
        </div>
      </div>
    </div>
  );
}
