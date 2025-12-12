import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
} from "framer-motion";
import { MessageSquare, ChevronDown } from "lucide-react";
import { faq } from "@/features/landing/data/faq";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQSectionProps {
  isLoading: boolean;
}

const FAQSection: React.FC<FAQSectionProps> = ({ isLoading }) => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const answerVariants: Variants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: "1rem",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            {t("faq.title")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
            {t("faq.title")}
          </h2>
          <p className="text-slate-400 text-lg">{t("faq.subtitle")}</p>
        </div>

        <motion.div className="space-y-4" variants={containerVariants}>
          {faq.map((faqItem, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center cursor-pointer group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {faqItem.q}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    variants={answerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <p className="text-slate-300 leading-relaxed px-6 pb-6">
                      {faqItem.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-6">{t("faq.stillHaveQuestions")}</p>
          <button
            onClick={() =>
              document
                .getElementById("Contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <MessageSquare className="w-5 h-5" />
            {t("faq.contactSupport")}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
