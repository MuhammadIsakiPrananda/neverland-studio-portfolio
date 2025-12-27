import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function CompanyStory() {
  const { t } = useLanguage();
  return (
    <section className="relative -mt-20 pt-32 pb-12 md:pb-16 lg:pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-sm md:text-base font-semibold">
                Digital Innovation Leader Since 2025
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('about.hero.title')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl leading-relaxed text-slate-300">
            {t('about.story.content')}
          </p>
        </div>
      </div>
    </section>
  );
}
