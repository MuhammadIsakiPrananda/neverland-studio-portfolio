
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight } from "lucide-react";
import { services } from '../../data/services';
import SpotlightCard from '../ui/SpotlightCard';
import ServiceDetailModal from '../ui/ServiceDetailModal';

type Service = typeof services[0] & {
  detailedDesc: string[];
  features: string[];
};

interface ServicesSectionProps {
  isLoading: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ isLoading, setSectionRef }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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

  useEffect(() => {
    if (selectedService) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedService]);

  return (
    <motion.section
      ref={(el) => {
        setSectionRef('Services')(el);
        sectionRef.current = el;
      }}
      id="Services"
      className="py-20 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">What We Do</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">We offer a comprehensive suite of digital services to bring your vision to life.</p>
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants}>
          {services.map((service, idx) => (
            <SpotlightCard
              key={idx}
              onClick={() => setSelectedService(service as Service)}
              className="group relative bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 transition-all duration-300 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10"
            >
              <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                  {/* Render the icon directly as a component */}
                  <service.icon.type className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{service.desc}</p>
                </div>
                <div className="mt-8">
                  <button className="inline-flex items-center gap-2 font-semibold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        <ServiceDetailModal service={selectedService as Service | null} onClose={() => setSelectedService(null)} />

      </div>
    </motion.section>
  );
};

export default ServicesSection;