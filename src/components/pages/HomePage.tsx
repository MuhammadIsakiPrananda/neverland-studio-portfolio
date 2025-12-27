import HeroSection from './home/HeroSection';
import WhyChooseUs from './home/WhyChooseUs';
import CallToAction from './home/CallToAction';
import DecorativeBackground from '../common/DecorativeBackground';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="relative bg-slate-950">
      {/* Decorative Background Elements */}
      <DecorativeBackground />
      
      {/* Page Content */}
      <div className="relative z-10">
        <HeroSection onNavigate={onNavigate} />
        <WhyChooseUs />
        <CallToAction onNavigate={onNavigate} />
      </div>
    </div>
  );
}
