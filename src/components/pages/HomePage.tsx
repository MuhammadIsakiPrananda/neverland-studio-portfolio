import HeroSection from './home/HeroSection';
import WhyChooseUs from './home/WhyChooseUs';
import CallToAction from './home/CallToAction';
import DecorativeBackground from '../common/DecorativeBackground';
import SEOHead from '../common/SEOHead';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <SEOHead 
        title="Neverland Studio | IT Services & Digital Solutions Indonesia"
        description="Neverland Studio menyediakan solusi IT profesional untuk pembelajaran dan pengembangan digital. Jasa pembuatan website, aplikasi mobile, konsultasi IT, dan pelatihan teknologi terkini dengan harga terjangkau."
        keywords="IT Services Indonesia, Web Development, Mobile App Development, Digital Solutions, IT Learning, IT Consulting, Software Development, Jasa IT Terpercaya, Pembuatan Website Profesional, Aplikasi Mobile"
        url="https://portfolio.neverlandstudio.my.id/home"
      />
      
      <main className="relative bg-slate-950">
        {/* Decorative Background Elements */}
        <DecorativeBackground />
        
        {/* Page Content */}
        <div className="relative z-10">
          <HeroSection onNavigate={onNavigate} />
          <WhyChooseUs />
          <CallToAction onNavigate={onNavigate} />
        </div>
      </main>
    </>
  );
}
