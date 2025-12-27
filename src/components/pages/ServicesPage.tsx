import { Code, Smartphone, Cloud, Database, Shield, Network, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function ServicesPage() {
  const { t } = useLanguage();
  
  const serviceCategories = [
    {
      id: 'web-development',
      icon: <Code className="w-7 h-7" />,
      categoryKey: 'webDevelopment',
      subServiceKeys: ['corporate', 'ecommerce', 'webapp', 'pwa', 'landing', 'api']
    },
    {
      id: 'mobile-apps',
      icon: <Smartphone className="w-7 h-7" />,
      categoryKey: 'mobileApps',
      subServiceKeys: ['ios', 'android', 'reactNative', 'flutter', 'aso', 'maintenance']
    },
    {
      id: 'cloud-solutions',
      icon: <Cloud className="w-7 h-7" />,
      categoryKey: 'cloudSolutions',
      subServiceKeys: ['migration', 'aws', 'azure', 'gcp', 'devops', 'monitoring']
    },
    {
      id: 'database',
      icon: <Database className="w-7 h-7" />,
      categoryKey: 'database',
      subServiceKeys: ['design', 'sql', 'nosql', 'optimization', 'migration', 'backup']
    },
    {
      id: 'security',
      icon: <Shield className="w-7 h-7" />,
      categoryKey: 'security',
      subServiceKeys: ['audit', 'pentest', 'ssl', 'encryption', 'firewall', 'compliance']
    },
    {
      id: 'network',
      icon: <Network className="w-7 h-7" />,
      categoryKey: 'network',
      subServiceKeys: ['design', 'lan', 'wan', 'vpn', 'security', 'monitoring']
    }
  ];

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/3 w-[480px] h-[480px] bg-emerald-500/20 rounded-full blur-[125px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-[420px] h-[420px] bg-cyan-500/25 rounded-full blur-[115px] animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] bg-violet-500/20 rounded-full blur-[105px] animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-[340px] h-[340px] bg-blue-500/15 rounded-full blur-[95px] animate-pulse" style={{animationDelay: '1.8s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '55px 55px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm mb-6">
            <Code className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('services.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('services.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {t('services.hero.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {serviceCategories.map((category, index) => {
            return (
              <div
                key={category.id}
                className={`h-full animate-fade-in-scale delay-${Math.min((index + 1) * 100, 600)}`}
              >
                <div className="group relative h-full flex flex-col rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col flex-1">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-700/50 border border-slate-600/50 group-hover:border-slate-500 transition-colors duration-300 mb-5">
                      <div className="text-slate-300">
                        {category.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                      {t(`services.categories.${category.categoryKey}.title`)}
                    </h3>

                    {/* Description Container dengan flex-grow */}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-slate-400 mb-5">
                        {t(`services.categories.${category.categoryKey}.description`)}
                      </p>
                    </div>

                    {/* Border Separator - selalu di posisi yang sama */}
                    <div className="border-t border-slate-700/50 mb-5"></div>

                    {/* Sub-Services List */}
                    <ul className="space-y-3">
                      {category.subServiceKeys.map((subKey, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm group/item">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-200 group-hover/item:text-white transition-colors">
                              {t(`services.categories.${category.categoryKey}.subServices.${subKey}.name`)}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {t(`services.categories.${category.categoryKey}.subServices.${subKey}.details`)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center max-w-3xl mx-auto p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('services.cta.title')}
          </h2>
          <p className="text-slate-300 mb-6">
            {t('services.cta.subtitle')}
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            {t('services.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
}
