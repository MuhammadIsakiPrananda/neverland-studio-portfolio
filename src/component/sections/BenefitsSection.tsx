import { motion, type Variants } from "framer-motion";
import { benefits } from "../../data/benefits.tsx";

interface BenefitsSectionProps {
  isLoading: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ isLoading }) => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.section
      className="py-16 sm:py-20 bg-slate-900/50"
      initial="hidden" 
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Advantage</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 text-white">Why Partner With Neverland</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto balance-text">We combine creativity, technology, and strategy to deliver exceptional results that drive growth for your business.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-800/30 p-6 rounded-xl border border-slate-800/50 text-center transition-all duration-300 hover:bg-slate-800/60 hover:border-teal-500/50 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-900/70 flex items-center justify-center border border-slate-700">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BenefitsSection;