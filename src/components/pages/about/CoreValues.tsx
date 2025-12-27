import { Lightbulb, Award, Shield, Users, Zap, Target } from 'lucide-react';

export default function CoreValues() {
  const coreValues = [
    { 
      icon: Lightbulb,
      title: 'Innovation', 
      desc: 'Embracing emerging technologies and pioneering new approaches. We explore creative solutions and stay ahead of industry trends to deliver transformative digital experiences.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Award,
      title: 'Excellence', 
      desc: 'Committed to delivering the highest quality in every line of code and design decision. Through rigorous testing and attention to detail, we exceed professional standards.',
      gradient: 'from-cyan-500 to-blue-600'
    },
    { 
      icon: Shield,
      title: 'Integrity', 
      desc: 'Building lasting relationships through trust, transparency, and ethical practices. We communicate honestly, deliver on promises, and always act in our clients\' best interests.',
      gradient: 'from-purple-500 to-blue-500'
    },
    { 
      icon: Users,
      title: 'Collaboration', 
      desc: 'Viewing clients as true partners. We work closely to understand challenges, align on goals, and co-create solutions that drive mutual success through open communication.',
      gradient: 'from-blue-600 to-purple-500'
    },
    { 
      icon: Zap,
      title: 'Agility', 
      desc: 'Adapting quickly to change. Our agile methodology enables swift response to evolving requirements and market dynamics, keeping solutions relevant and effective.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      icon: Target,
      title: 'Impact', 
      desc: 'Measuring success by tangible results. We focus on delivering measurable outcomes—increased revenue, improved efficiency, and accelerated growth that drive real business value.',
      gradient: 'from-blue-500 to-purple-600'
    }
  ];

  return (
    <section className="mb-16 md:mb-20 lg:mb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-400">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index} 
                className="group relative p-5 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl bg-slate-800/50 border border-slate-700/30 shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Icon */}
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-base md:text-xl lg:text-2xl font-bold mb-2 md:mb-4 text-white">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm lg:text-base leading-relaxed text-slate-300">
                  {value.desc}
                </p>

                {/* Bottom Gradient Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
