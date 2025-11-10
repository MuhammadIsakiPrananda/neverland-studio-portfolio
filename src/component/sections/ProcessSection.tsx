
import { motion, type Variants } from "framer-motion";
import { process } from '../../data/process';

interface ProcessSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ setSectionRef }) => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section ref={setSectionRef('Process')} id="Process" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Our Process</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">A Journey to Digital Success</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our streamlined process ensures clarity, efficiency, and outstanding results from start to finish.</p>
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {process.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 hover:border-sky-500/50 transition-all group"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-sky-500 to-violet-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-violet-500/30 text-white">
                {step.step}
              </div>
              <div className="text-sky-400 mb-6 mt-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProcessSection;