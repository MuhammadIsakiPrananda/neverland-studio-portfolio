import { CheckCircle } from 'lucide-react';

export default function ServicesOverview() {
  return (
    <section className="py-16 md:py-20 bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">Our Services</h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto px-4">
            Comprehensive IT solutions designed to drive your business forward
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              id: 1,
              title: 'Web Development',
              description: 'Custom web applications built with modern technologies',
              icon: '🌐',
              features: ['Responsive Design', 'SEO Optimized', 'Fast Performance']
            },
            {
              id: 2,
              title: 'Mobile Apps',
              description: 'Native and cross-platform mobile applications',
              icon: '📱',
              features: ['iOS & Android', 'Cross Platform', 'Cloud Integration']
            },
            {
              id: 3,
              title: 'Cloud Solutions',
              description: 'Scalable cloud infrastructure and deployment',
              icon: '☁️',
              features: ['AWS & Azure', 'Auto Scaling', '24/7 Monitoring']
            }
          ].map((service) => (
            <div
              key={service.id}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl md:rounded-3xl shadow-xl shadow-blue-500/5 p-6 md:p-8 flex flex-col hover-lift hover-glow hover:border-blue-500/50 group transition-all duration-300"
            >
              {/* Icon and Title */}
              <div className="flex items-start gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-2xl shadow-lg shadow-blue-600/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">{service.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 mb-4 md:mb-6 text-sm md:text-base group-hover:text-slate-200 transition-colors duration-300">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2 md:space-y-3 mt-auto">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2 md:space-x-3">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 group-hover:text-blue-300 transition-colors duration-300" />
                    <span className="text-xs md:text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
