import { motion, useInView, type Variants } from "framer-motion";
import { process } from "@/features/landing/data/process.tsx";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProcessSectionProps {
  isLoading: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({
  isLoading,
  setSectionRef,
}) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      ref={(el) => {
        // This ref is managed by App.tsx for scroll navigation
        setSectionRef("Process")(el);
        sectionRef.current = el;
      }}
      id="Process"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            {t("process.title")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
            {t("process.title")}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </div>

        {/* Process Timeline */}
        <motion.div className="relative" variants={containerVariants}>
          {/* The connecting line */}
          <div
            className="absolute left-9 top-9 bottom-0 w-0.5 bg-white/10 hidden md:block"
            aria-hidden="true"
          ></div>

          <div className="space-y-12">
            {process.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative flex items-start gap-6 md:gap-8 group"
              >
                {/* Step Number and Icon */}
                <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center text-cyan-400 transition-colors group-hover:border-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Step {step.step}
                  </div>
                </div>
                {/* Content Card */}
                <div className="bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex-1 transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProcessSection;
