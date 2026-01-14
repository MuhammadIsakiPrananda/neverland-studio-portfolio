import { Award, Users, Clock, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
      title: t('home.features.quality.title'),
      desc: t('home.features.quality.description'),
      gradient: 'from-yellow-500 to-orange-500',
      particleColor: 'bg-yellow-400'
    },
    {
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
      title: t('home.features.experience.title'),
      desc: t('home.features.experience.description'),
      gradient: 'from-blue-500 to-cyan-500',
      particleColor: 'bg-blue-400'
    },
    {
      icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
      title: t('home.features.support.title'),
      desc: t('home.features.support.description'),
      gradient: 'from-green-500 to-emerald-500',
      particleColor: 'bg-green-400'
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
      title: t('home.features.innovation.title'),
      desc: t('home.features.innovation.description'),
      gradient: 'from-purple-500 to-pink-500',
      particleColor: 'bg-purple-400'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-950 border-b border-slate-800 relative overflow-hidden">
      {/* Minimalist Background - Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          {/* Animated Badge */}
          <Badge variant="outline" className="mb-4 sm:mb-6 bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2" />
            {t('home.features.title')}
          </Badge>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-white animate-fade-in-up">
            {t('home.features.subtitle')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto px-4 leading-relaxed animate-fade-in-up delay-200">
            We deliver excellence through innovation, expertise, and unwavering dedication to your success
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {features.map((item, idx) => (
            <Card
              key={idx}
              className="group relative h-full bg-slate-900/40 backdrop-blur-sm border-slate-700/30 transition-all duration-300 hover:scale-105 hover:bg-slate-800/50 hover:border-slate-600/50 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <CardContent className="p-6 sm:p-8 text-center">
                {/* Icon with Gradient */}
                <div className="mb-5">
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5`}>
                    <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-transparent">
                      <div className="text-white transition-all duration-300 group-hover:scale-110">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced animations CSS */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform;
        }

        .rotate-y-3:hover {
          transform: rotateY(3deg);
        }
      `}</style>
    </section>
  );
}
