import { ArrowRight, Sparkles, Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';

interface CallToActionProps {
  onNavigate: (page: string) => void;
}

export default function CallToAction({ onNavigate }: CallToActionProps) {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/neverlandstudio' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/neverlandstudio' },
    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/neverland.studio/' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/neverlandstudio' },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-950 border-b border-slate-800 overflow-hidden">
      {/* Subtle Background - Same as other sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 opacity-50" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          {/* Animated Badge */}
          <Badge variant="outline" className="mb-4 sm:mb-6 bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors">
            <Sparkles className="w-4 h-4 mr-2" />
            {t('home.cta.title')}
          </Badge>

          {/* Title with Gradient and Underline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-white animate-fade-in-up">
            {t('home.cta.title')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-8 sm:mb-10 px-4 leading-relaxed animate-fade-in-up delay-200">
            {t('home.cta.subtitle')}
          </p>

          {/* CTA Button with Animation */}
          <div className="animate-fade-in-up delay-300">
            <Button
              onClick={() => onNavigate('contact')}
              size="lg"
              className="group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('home.cta.button')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <Separator className="w-24 bg-slate-800" />
            <span className="text-xs sm:text-sm text-slate-500 font-medium">Connect with us</span>
            <Separator className="w-24 bg-slate-800" />
          </div>

          <div className="flex justify-center gap-3 sm:gap-4">
            {socialLinks.map((social, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="icon"
                asChild
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800/50 border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
