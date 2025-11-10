"use client";
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import DesktopNav from './component/layout/DesktopNav';
import MobileNav from './component/layout/MobileNav';
import HeroSection from './component/sections/HeroSection';
import BenefitsSection from './component/sections/BenefitsSection';
import ServicesSection from './component/sections/ServicesSection';
import ProcessSection from './component/sections/ProcessSection';
import PortfolioSection from './component/sections/PortfolioSection';
import TeamSection from './component/sections/TeamSection';
import TestimonialsSection from './component/sections/TestimonialsSection';
import PricingSection from './component/sections/PricingSection';
import FAQSection from './component/sections/FAQSection';
import CTASection from './component/sections/CTASection';
import ContactSection from './component/sections/ContactSection';
import Footer from './component/common/Footer';
import FloatingButtons from './component/common/FloatingButtons';
import VideoModal from './component/common/VideoModal';
import AuthModal from './component/ui/AuthModal';
import NotificationProvider from './component/ui/NotificationProvider';
import LoadingScreen from './component/ui/LoadingScreen';

const NeverlandStudio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showVideo, setShowVideo] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Simulasi waktu loading
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Force scroll to top on every refresh
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isAuthModalOpen || isMenuOpen || isLoading) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isAuthModalOpen, isMenuOpen, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const setSectionRef = (section: string) => (el: HTMLElement | null) => {
    sectionRefs.current[section] = el;
  };

  const handleNavClick = (section: string) => {
    sectionRefs.current[section]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setActiveSection(section);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => Object.values(currentRefs).forEach((el) => {
      if (el) observer.unobserve(el);
    });
  }, []);

  return (
    <div 
      className="bg-[#0A0A0A] text-slate-300 min-h-screen"
      style={{
        backgroundSize: '30px 30px',
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.04) 1px, transparent 0)',
      }}>
      <NotificationProvider>
        <AnimatePresence>
          {isLoading && <LoadingScreen />}
        </AnimatePresence>

        <DesktopNav 
          isScrolled={isScrolled} 
          activeSection={activeSection} 
          handleNavClick={handleNavClick} 
          onLoginClick={() => setIsAuthModalOpen(true)} 
        />
        <MobileNav 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          activeSection={activeSection} 
          handleNavClick={handleNavClick} 
          onLoginClick={() => setIsAuthModalOpen(true)} />
        
        <main>
          <HeroSection isLoading={isLoading} setSectionRef={setSectionRef} setShowVideo={setShowVideo} onGetStartedClick={() => handleNavClick('Contact')} />
          <BenefitsSection />
          <ServicesSection setSectionRef={setSectionRef} />
          <ProcessSection setSectionRef={setSectionRef} />
          <PortfolioSection setSectionRef={setSectionRef} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <TeamSection setSectionRef={setSectionRef} />
          <TestimonialsSection />
          <PricingSection setSectionRef={setSectionRef} onGetStartedClick={() => handleNavClick('Contact')} />
          <FAQSection />
          <CTASection />
          <ContactSection setSectionRef={setSectionRef} />
        </main>

        <Footer />
        <FloatingButtons />
        <VideoModal showVideo={showVideo} setShowVideo={setShowVideo} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Custom Animations */}
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; } 
            100% { background-position: 0% 50%; } 
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .balance-text {
            text-wrap: balance;
          }

          @keyframes pulse-slow {
            50% { opacity: 0.6; }
          }
          .animate-pulse-slow { animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

          @keyframes pulse-slow-reverse { 50% { opacity: 0.6; } }
          .animate-pulse-slow-reverse { animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) 2s infinite; }

          .bg-radial-gradient-hero {
            background-image: radial-gradient(circle, rgba(10, 10, 10, 0) 50%, rgba(10, 10, 10, 1) 85%);
          }
        `}</style>
      </NotificationProvider>
    </div>
  );
};

export default NeverlandStudio;