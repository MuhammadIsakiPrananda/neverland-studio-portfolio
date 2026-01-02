import { Headphones, Users, Target, Zap, CheckCircle2, ArrowRight, Clock, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function ITConsultingPage() {
  const { t } = useLanguage();
  
  const consultingServices = [
    {
      id: 'strategy',
      icon: <Target className="w-7 h-7" />,
      titleKey: 'itConsulting.services.strategy.title',
      descriptionKey: 'itConsulting.services.strategy.description',
      featuresKey: 'itConsulting.services.strategy.features'
    },
    {
      id: 'infrastructure',
      icon: <Shield className="w-7 h-7" />,
      titleKey: 'itConsulting.services.infrastructure.title',
      descriptionKey: 'itConsulting.services.infrastructure.description',
      featuresKey: 'itConsulting.services.infrastructure.features'
    },
    {
      id: 'support',
      icon: <Headphones className="w-7 h-7" />,
      titleKey: 'itConsulting.services.support.title',
      descriptionKey: 'itConsulting.services.support.description',
      featuresKey: 'itConsulting.services.support.features'
    },
    {
      id: 'training',
      icon: <Users className="w-7 h-7" />,
      titleKey: 'itConsulting.services.training.title',
      descriptionKey: 'itConsulting.services.training.description',
      featuresKey: 'itConsulting.services.training.features'
    },
    {
      id: 'optimization',
      icon: <TrendingUp className="w-7 h-7" />,
      titleKey: 'itConsulting.services.optimization.title',
      descriptionKey: 'itConsulting.services.optimization.description',
      featuresKey: 'itConsulting.services.optimization.features'
    },
    {
      id: 'management',
      icon: <Zap className="w-7 h-7" />,
      titleKey: 'itConsulting.services.management.title',
      descriptionKey: 'itConsulting.services.management.description',
      featuresKey: 'itConsulting.services.management.features'
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      titleKey: 'itConsulting.benefits.saveTime.title',
      descriptionKey: 'itConsulting.benefits.saveTime.description'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      titleKey: 'itConsulting.benefits.reduceRisks.title',
      descriptionKey: 'itConsulting.benefits.reduceRisks.description'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      titleKey: 'itConsulting.benefits.scaleBetter.title',
      descriptionKey: 'itConsulting.benefits.scaleBetter.description'
    },
    {
      icon: <Target className="w-6 h-6" />,
      titleKey: 'itConsulting.benefits.strategicInsights.title',
      descriptionKey: 'itConsulting.benefits.strategicInsights.description'
    }
  ];

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/3 w-[480px] h-[480px] bg-purple-500/20 rounded-full blur-[125px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-[420px] h-[420px] bg-blue-500/25 rounded-full blur-[115px] animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] bg-cyan-500/20 rounded-full blur-[105px] animate-pulse" style={{animationDelay: '2.5s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '55px 55px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 backdrop-blur-sm mb-6">
            <Headphones className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('itConsulting.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('itConsulting.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {t('itConsulting.hero.subtitle')}
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group p-6 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover-lift animate-fade-in-scale delay-${Math.min((index + 1) * 100, 400)}`}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-600/10 border border-purple-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-purple-400">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t(benefit.titleKey)}</h3>
              <p className="text-sm text-slate-400">{t(benefit.descriptionKey)}</p>
            </div>
          ))}
        </div>

        {/* Consulting Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mb-16">
          {consultingServices.map((service, index) => (
            <div
              key={service.id}
              className={`h-full animate-fade-in-scale delay-${Math.min((index + 1) * 100, 600)}`}
            >
              <div className="group relative h-full flex flex-col rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 p-0.5 mb-5 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                      <div className="text-purple-400">
                        {service.icon}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-400 transition-colors duration-300">
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-400 mb-5 group-hover:text-slate-300 transition-colors duration-300">
                    {t(service.descriptionKey)}
                  </p>

                  {/* Border Separator */}
                  <div className="border-t border-slate-700/50 mb-5"></div>

                  {/* Features List */}
                  <ul className="space-y-3 flex-1">
                    {(t(service.featuresKey, { returnObjects: true }) as string[]).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm group/item">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 group-hover/item:text-white transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center max-w-3xl mx-auto p-8 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover-lift animate-fade-in-up delay-400">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('itConsulting.cta.title')}
          </h2>
          <p className="text-slate-300 mb-6">
            {t('itConsulting.cta.subtitle')}
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 group"
          >
            <span>{t('itConsulting.cta.button')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
