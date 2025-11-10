import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown } from 'lucide-react';
import { faq } from '../../data/faq';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const answerVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      marginTop: '1rem',
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0, height: 0, marginTop: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <motion.section className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}> 
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-lg">
            Find answers to common questions about our services and processes.
          </p>
        </div>

        <motion.div className="space-y-4" variants={containerVariants}>
          {faq.map((faqItem, idx) => ( 
            <motion.div
              key={idx} 
              className="bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center cursor-pointer group"
              > 
                <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                  {faqItem.q}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    variants={answerVariants} initial="hidden" animate="visible" exit="exit"
                  > 
                    <p className="text-slate-300 leading-relaxed px-6 pb-6">{faqItem.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-6">Still have questions? We're here to help.</p>
          <button className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto ">
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;