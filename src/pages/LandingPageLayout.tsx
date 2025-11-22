import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DesktopNav from '../component/layout/DesktopNav';
import MobileNav from '../component/layout/MobileNav';
import { useAuth } from '../context/AuthContext';

interface LandingPageLayoutProps {
  onLoginClick: () => void;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, userProfile, logout } = useAuth();
  const location = useLocation();

  // Efek untuk menutup menu saat pindah halaman
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk mengunci scroll body
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMenuOpen]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProgrammaticScroll = useRef(false);

  const handleNavClick = (section: string) => {
    isProgrammaticScroll.current = true;
    setActiveSection(section);
    sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  };

  return (
    <>
      <DesktopNav
        isScrolled={isScrolled}
        activeSection={activeSection}
        handleNavClick={handleNavClick}
        isLoggedIn={isLoggedIn}
        userProfile={isLoggedIn ? userProfile : null}
        onLoginClick={onLoginClick}
        onLogout={logout}
        onDashboardClick={() => { /* akan ditangani oleh App.tsx */ }}
        onQuoteClick={() => handleNavClick('Contact')}
      />
      <MobileNav
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        handleNavClick={handleNavClick}
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onLogout={logout}
        userProfile={isLoggedIn ? userProfile : null}
        onDashboardClick={() => { /* akan ditangani oleh App.tsx */ }}
      />
      <Outlet context={{ sectionRefs, setActiveSection, isProgrammaticScroll }} />
    </>
  );
};

export default LandingPageLayout;