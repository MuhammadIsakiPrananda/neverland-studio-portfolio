import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import { benefits } from '../../data/benefits';

interface BenefitsSectionProps {
  isLoading: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ isLoading }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInteracting) return;

    const intervalId = setInterval(() => {
      setHoveredIndex(prevIndex => {
        if (prevIndex === null) return 0;
        return (prevIndex + 1) % benefits.length;
      });
    }, 3000); // Ganti item setiap 3 detik

    return () => clearInterval(intervalId);
  }, [isInteracting, benefits.length]);
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardVariants: Variants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.section 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8" 
      initial="hidden" 
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Visual */}
          <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-teal-900/20 rounded-3xl blur-2xl"></div>
            <AnimatePresence mode="wait">
              {hoveredIndex !== null && (
                <motion.div
                  key={hoveredIndex}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-md h-auto bg-gray-800/70 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-900/30"
                >
                  <div className="text-cyan-400 mb-6">
                    {benefits[hoveredIndex].icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">{benefits[hoveredIndex].title}</h3>
                  <p className="text-slate-300 text-lg">{benefits[hoveredIndex].desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Content */}
          <div 
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 text-white">The Neverland Advantage</h2>
            <p className="text-slate-400 text-lg mb-10">
              Partner with us and benefit from our commitment to excellence, innovation, and your success.
            </p>

            <div className="space-y-2">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 rounded-lg transition-all duration-300 relative overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`transition-colors duration-300 ${hoveredIndex === idx ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {benefit.icon}
                    </div>
                    <h4 className={`text-lg font-semibold transition-colors duration-300 ${hoveredIndex === idx ? 'text-white' : 'text-slate-300'}`}>
                      {benefit.title}
                    </h4>
                  </div>
                  {hoveredIndex === idx && (
                    <motion.div
                      layoutId="benefit-hover"
                      className="absolute inset-0 bg-gray-800/50 rounded-lg"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;