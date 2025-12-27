import { Building2, Users, Code, Globe } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function OurStory() {
  const { t } = useLanguage();
  const highlights = [
    {
      icon: Building2,
      title: 'Founded 2025',
      description: 'Established with a vision'
    },
    {
      icon: Users,
      title: '50+ Team',
      description: 'Expert professionals'
    },
    {
      icon: Code,
      title: '500+ Projects',
      description: 'Successfully delivered'
    },
    {
      icon: Globe,
      title: '25+ Countries',
      description: 'Global reach'
    }
  ];

  return (
    <section className="mb-16 md:mb-20">
      <div className="max-w-5xl mx-auto">
        {/* Main Story */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {t('about.story.title')}
          </h2>
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-slate-300">
            <p>{t('about.story.content')}</p>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {item.title}
                </div>
                <div className="text-sm text-slate-400">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
