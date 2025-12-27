import { Award, Medal, Trophy, Star, Crown, Gem, Calendar, Building2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AwardsPage() {
  const { t } = useLanguage();
  const achievements = [
    {
      icon: Trophy,
      title: 'Best Web Development Company',
      year: '2025',
      category: 'Technology',
      organization: 'Tech Innovation Awards',
      location: 'Jakarta, Indonesia',
      description: 'Recognized for outstanding web development projects and innovative solutions that transform businesses digitally.',
    },
    {
      icon: Crown,
      title: 'Excellence in UI/UX Design',
      year: '2025',
      category: 'Design',
      organization: 'Design Masters Global',
      location: 'Singapore',
      description: 'Awarded for exceptional user interface and experience design that creates delightful customer journeys.',
    },
    {
      icon: Award,
      title: 'Top IT Solutions Provider',
      year: '2025',
      category: 'Business',
      organization: 'Business Excellence Awards',
      location: 'Indonesia',
      description: 'Honored as a leading provider of comprehensive IT solutions for enterprises across multiple industries.',
    },
    {
      icon: Star,
      title: 'Client Satisfaction Leader',
      year: '2025',
      category: 'Service',
      organization: 'Customer Choice Awards',
      location: 'Southeast Asia',
      description: 'Achieved highest client satisfaction ratings in the industry through dedicated support and quality delivery.',
    },
    {
      icon: Gem,
      title: 'Innovation Award',
      year: '2024',
      category: 'Innovation',
      organization: 'Tech Summit Asia',
      location: 'Bali, Indonesia',
      description: 'Recognized for innovative approaches to software development and cutting-edge technology implementations.',
    },
    {
      icon: Medal,
      title: 'Outstanding Service Quality',
      year: '2024',
      category: 'Service',
      organization: 'Industry Leaders Forum',
      location: 'Jakarta',
      description: 'Exceptional service quality and customer support that exceeds industry standards consistently.',
    },
  ];

  const categoryColors: { [key: string]: string } = {
    Technology: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Design: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Business: 'text-green-400 bg-green-500/10 border-green-500/20',
    Service: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    Innovation: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
  };

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[125px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-yellow-500/25 rounded-full blur-[115px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[105px] animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-2/3 left-2/5 w-[350px] h-[350px] bg-rose-500/15 rounded-full blur-[95px] animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '58px 58px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm mb-6 animate-fade-in-down">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('awards.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              {t('awards.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 leading-relaxed animate-fade-in-up delay-200">
            {t('awards.hero.subtitle')}
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const categoryStyle = categoryColors[achievement.category] || categoryColors.Technology;
            
            return (
              <div
                key={index}
                className={`group relative rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-scale delay-${Math.min((index + 1) * 100, 600)}`}
              >
                {/* Category Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full ${categoryStyle} border text-xs font-semibold z-10`}>
                  {t(`awards.categories.${achievement.category.toLowerCase()}`)}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Icon & Year - Better spacing */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-700/50 border border-slate-600/50 group-hover:border-slate-500 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-slate-300" />
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{achievement.year}</span>
                    </div>
                  </div>

                  {/* Title - Better spacing */}
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                    {achievement.title}
                  </h3>

                  {/* Organization & Location - Better structure */}
                  <div className="mb-5 pb-5 border-b border-slate-700/50 space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          {achievement.organization}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {achievement.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description - Better spacing */}
                  <p className="text-sm leading-relaxed text-slate-400 line-clamp-3">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section - Improved spacing with animations */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-100">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-3">6+</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">{t('awards.stats.totalAwards')}</div>
          </div>
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-200">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-3">5</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">{t('awards.stats.categories')}</div>
          </div>
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-300">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-3">2</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">{t('awards.stats.years')}</div>
          </div>
          <div className="text-center p-6 md:p-8 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors animate-fade-in-scale delay-400">
            <div className="text-2xl md:text-3xl font-bold text-pink-400 mb-3">{t('awards.stats.global')}</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium">{t('awards.stats.recognition')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
