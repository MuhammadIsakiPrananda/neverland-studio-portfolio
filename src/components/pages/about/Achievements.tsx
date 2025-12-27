import { Award, Medal, Trophy, Star } from 'lucide-react';

export default function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: 'Best Web Development',
      year: '2025',
      organization: 'Tech Innovation Awards',
    },
    {
      icon: Medal,
      title: 'Excellence in UI/UX',
      year: '2025',
      organization: 'Design Masters',
    },
    {
      icon: Award,
      title: 'Top IT Solutions Provider',
      year: '2025',
      organization: 'Business Excellence',
    },
    {
      icon: Star,
      title: 'Client Satisfaction Leader',
      year: '2025',
      organization: 'Customer Choice Awards',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg">
                <Award className="w-4 h-4" />
                <span className="text-sm font-semibold">Recognition</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Awards & Achievements
            </h2>
            
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-300">
              Recognition for our excellence and innovation
            </p>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden text-center"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold mb-2 text-white">
                      {achievement.title}
                    </h3>

                    {/* Year */}
                    <div className="inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 bg-blue-500/20 text-blue-300">
                      {achievement.year}
                    </div>

                    {/* Organization */}
                    <p className="text-sm text-slate-400">
                      {achievement.organization}
                    </p>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
