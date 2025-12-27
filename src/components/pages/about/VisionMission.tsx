import { Eye, Target } from 'lucide-react';

export default function VisionMission() {
  const cards = [
    {
      icon: Eye,
      title: 'Our Vision',
      content: 'To be the global leader in innovative IT solutions, empowering businesses to thrive in the digital age. We envision a future where technology seamlessly integrates with strategy, transforming ideas into realities that drive growth and competitive advantage.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Our Mission',
      content: 'To deliver exceptional software solutions that exceed expectations through technical excellence and industry expertise. We foster innovation, create lasting value, and act as your trusted technology partner—understanding your challenges and crafting solutions that propel your business forward.',
      gradient: 'from-cyan-500 to-purple-500'
    }
  ];

  return (
    <section className="mb-16 md:mb-20 lg:mb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700/30 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Icon Circle */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                />
                
                {/* Content */}
                <div className="p-8 md:p-10 relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-5 text-white">
                    {card.title}
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed text-slate-300">
                    {card.content}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
