import { Code2, Smartphone, Network, Database, Cloud, Lock } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function WhatWeDo() {
  const { t } = useLanguage();
  const services = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Scalable web applications built with modern frameworks and best practices'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile solutions for iOS and Android'
    },
    {
      icon: Network,
      title: 'Network Infrastructure',
      description: 'Robust network design, implementation, and management (TKJ)'
    },
    {
      icon: Database,
      title: 'Information Systems',
      description: 'Enterprise systems and database solutions (SIJA)'
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Cloud architecture, migration, and deployment services'
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Comprehensive security implementation and best practices'
    }
  ];

  return (
    <section className="mb-16 md:mb-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t('about.mission.title')}
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            {t('about.mission.content')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative p-6 md:p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
