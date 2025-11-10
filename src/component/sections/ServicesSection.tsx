
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check } from 'lucide-react';
import { services } from '../../data/services';
import SpotlightCard from '../ui/SpotlightCard';

interface ServicesSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ setSectionRef }) => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section ref={setSectionRef('Services')} id="Services" className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">What We Do</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">We offer a comprehensive suite of digital services to bring your vision to life.</p>
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants}>
          {services.map((service, idx) => (
            <SpotlightCard
              key={idx}
              className="bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 hover:border-sky-500/50 transition-all hover:transform hover:-translate-y-2"
            >
              <div className="relative z-10">
                <div className={`bg-gradient-to-r ${service.color} p-3 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.desc}</p>
                <ul className="space-y-2 mb-6"> 
                  {service.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300"> 
                      <Check className="w-4 h-4 text-sky-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="text-sky-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button 
            onClick={() => document.getElementById('Portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-sky-500 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-violet-500/30 transition-all transform hover:scale-105"
          >
            Explore All Services
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;