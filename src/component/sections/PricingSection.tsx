import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { pricing } from '../../data/pricing';
import SpotlightCard from '../ui/SpotlightCard';

interface PricingSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  onGetStartedClick: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ setSectionRef, onGetStartedClick }) => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section ref={setSectionRef('Pricing')} id="Pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Flexible Plans for Every Need</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Choose a plan that works for you. All plans are fully customizable to fit your project's unique requirements.</p>
        </div>

        <motion.div className="grid md:grid-cols-3 gap-8 mb-12" variants={containerVariants}>
          {pricing.map((plan, idx) => (
            <SpotlightCard
              key={idx}
              className={`bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-lg border rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all ${ 
                plan.popular ? 'border-sky-500 shadow-xl shadow-sky-500/20 scale-105' : 'border-slate-800/50'
              }`}
            >
              <div className="relative z-10">
                {plan.popular && (
                  <div className="bg-gradient-to-r from-sky-500 to-violet-600 text-white text-sm font-bold py-2 px-4 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-4">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-gray-400 font-normal">/project</span>}
                </div>
                <p className="text-slate-400 mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onGetStartedClick}
                  className={`w-full py-4 rounded-full font-semibold transition-all transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
                      : 'border border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        <motion.div className="bg-gradient-to-r from-sky-900/20 to-violet-900/20 border border-sky-500/30 rounded-2xl p-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">We offer tailored enterprise solutions. Contact us for a personalized quote and strategy session.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-gradient-to-r from-sky-500 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-violet-500/30 transition-all transform hover:scale-105">
              Schedule a Consultation
            </button>
            <button className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105">
              Download Pricing Guide
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingSection;