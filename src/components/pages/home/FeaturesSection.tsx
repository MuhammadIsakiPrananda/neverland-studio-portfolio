import { ArrowRight, CheckCircle, Users, Award, Zap, Target } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Delivery',
      description: 'Get your projects completed on time with our agile development methodology',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Work with certified professionals who bring years of industry experience',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'We ensure top-notch quality with rigorous testing and code reviews',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Result-Oriented',
      description: 'Focused on delivering measurable results that drive your business growth',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">What We Offer</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Features That Set Us Apart
          </h2>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Discover the advantages of partnering with Neverland Studio
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300"
              >
                {/* Icon Container */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Arrow Indicator */}
                <div className="flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Decorative gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
