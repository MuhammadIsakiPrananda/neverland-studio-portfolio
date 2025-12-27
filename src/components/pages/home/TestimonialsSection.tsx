import { Heart, MessageCircle, Star, TrendingUp } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc',
      company: 'TechStart Inc',
      image: '👩‍💼',
      rating: 5,
      text: 'Neverland Studio transformed our digital presence completely. Their team is professional, creative, and incredibly efficient.',
      stats: { projects: 12, satisfaction: 100 }
    },
    {
      name: 'Michael Chen',
      role: 'CTO, InnovateLab',
      company: 'InnovateLab',
      image: '👨‍💻',
      rating: 5,
      text: 'Working with Neverland Studio was a game-changer. They delivered beyond our expectations and on time.',
      stats: { projects: 8, satisfaction: 98 }
    },
    {
      name: 'Emma Williams',
      role: 'Founder, StartupHub',
      company: 'StartupHub',
      image: '👩‍🚀',
      rating: 5,
      text: 'The best IT partner we\'ve ever had. Their expertise and dedication to our success is unmatched.',
      stats: { projects: 15, satisfaction: 100 }
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-950 border-b border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-semibold">Client Success Stories</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            What Our Clients Say
          </h2>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative p-6 md:p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105"
            >
              {/* Quote Icon */}
              <MessageCircle className="absolute top-6 right-6 w-8 h-8 text-blue-500/20 group-hover:text-blue-500/40 transition-colors duration-300" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-300 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                  <p className="text-xs text-slate-500">{testimonial.company}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400">{testimonial.stats.projects} Projects</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-slate-400">{testimonial.stats.satisfaction}% Happy</span>
                </div>
              </div>

              {/* Decorative gradient on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-semibold">4.9/5 Average Rating</span>
            <span className="text-slate-400">from 150+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
