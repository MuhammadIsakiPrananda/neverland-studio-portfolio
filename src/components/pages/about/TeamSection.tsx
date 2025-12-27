import type { Theme } from '../../../types';
import { teamMembers } from '../../../data/mockData';

interface TeamSectionProps {
  theme: Theme;
}

export default function TeamSection({ theme }: TeamSectionProps) {
  const isDark = theme === 'dark';

  return (
    <section className="mb-16 md:mb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Meet Our Team
          </h2>
          <p className={`text-sm md:text-base lg:text-lg xl:text-xl max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-stone-600'
          }`}>
            Our talented team of experts brings together diverse skills and experiences to deliver exceptional results
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className={`group relative rounded-2xl md:rounded-3xl overflow-hidden ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } border ${
                isDark ? 'border-gray-700/30' : 'border-stone-200'
              } shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3`}
            >
              {/* Image with Overlay */}
              <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isDark 
                    ? 'from-gray-900 via-gray-900/20 to-transparent' 
                    : 'from-white via-white/20 to-transparent'
                } opacity-60`} />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 lg:p-8">
                <h3 className={`text-sm md:text-lg lg:text-xl xl:text-2xl font-bold mb-1 md:mb-2 ${
                  isDark ? 'text-white' : 'text-stone-900'
                }`}>
                  {member.name}
                </h3>
                <p className={`font-semibold mb-2 md:mb-4 text-xs md:text-sm lg:text-base ${
                  isDark ? 'text-yellow-400' : 'text-stone-700'
                }`}>
                  {member.position}
                </p>
                <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-stone-600'
                }`}>
                  {member.bio}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                isDark 
                  ? 'from-yellow-400 to-amber-500' 
                  : 'from-stone-700 to-stone-900'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
