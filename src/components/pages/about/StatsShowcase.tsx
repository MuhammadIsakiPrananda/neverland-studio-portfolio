import { useState, useEffect } from 'react';
import { Users, Briefcase, Award, Globe } from 'lucide-react';

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
}

export default function StatsShowcase() {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatItem[] = [
    { icon: Users, value: 300, suffix: '+', label: 'Happy Clients' },
    { icon: Briefcase, value: 500, suffix: '+', label: 'Projects Delivered' },
    { icon: Award, value: 50, suffix: '+', label: 'Team Members' },
    { icon: Globe, value: 25, suffix: '+', label: 'Countries Served' },
  ];

  const Counter = ({ end, suffix }: { end: number; suffix: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!hasAnimated) return;
      
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [hasAnimated, end]);

    return <>{count}{suffix}</>;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 sm:p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-3 sm:mb-4 flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {/* Value */}
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <Counter end={stat.value} suffix={stat.suffix} />
                    </div>

                    {/* Label */}
                    <div className="text-xs sm:text-sm font-medium text-slate-400">
                      {stat.label}
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-gradient-to-br from-blue-400/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
