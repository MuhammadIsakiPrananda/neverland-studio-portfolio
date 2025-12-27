import { Calendar, Trophy, Rocket, Star, Target } from 'lucide-react';

export default function TimelineMilestones() {
  const milestones = [
    {
      year: '2025',
      title: 'Foundation',
      description: 'Neverland Studio was founded with a vision to transform digital experiences',
      icon: Rocket,
    },
    {
      year: '2025',
      title: 'First Major Client',
      description: 'Secured partnership with leading enterprise companies',
      icon: Trophy,
    },
    {
      year: '2025',
      title: '100+ Projects',
      description: 'Successfully delivered over 100 projects across various industries',
      icon: Target,
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanded operations to serve clients in 25+ countries',
      icon: Star,
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-950/50 border-y border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">Our Journey</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Company Milestones
            </h2>
            
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-300">
              Key moments that shaped our journey
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

            {/* Milestones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                
                return (
                  <div key={index} className="relative">
                    {/* Milestone Card */}
                    <div className="group relative rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                      {/* Year Badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg z-10">
                        {milestone.year}
                      </div>

                      {/* Icon */}
                      <div className="w-14 h-14 mx-auto mb-4 mt-2 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                        <Icon className="w-7 h-7" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold mb-2 text-white">
                        {milestone.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-slate-400">
                        {milestone.description}
                      </p>
                    </div>

                    {/* Arrow Connector (desktop only) */}
                    {index < milestones.length - 1 && (
                      <div className="hidden md:block absolute top-16 -right-4 text-xl z-20 text-blue-400/30">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
