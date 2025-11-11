
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import SpotlightCard from '../ui/SpotlightCard';

interface TestimonialsSectionProps {
  onAddReviewClick: () => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onAddReviewClick }) => {
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

  const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.05, type: 'spring', stiffness: 500, damping: 20 } }),
  }

  return (
    <motion.section className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}> 
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">What Our Clients Say</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We're proud to have worked with amazing clients. Here's what they think about us.
          </p>
        </div>

        <motion.div 
          className="[column-count:1] sm:[column-count:2] lg:[column-count:3] gap-8 space-y-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, idx) => (
            <SpotlightCard
              key={idx} 
              className="bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 transition-all break-inside-avoid flex flex-col group"
            >
              <motion.div 
                whileHover={{ y: -4 }}
                className="relative z-10 flex flex-col h-full flex-grow">
                <Quote className="w-10 h-10 text-teal-500/30 mb-4" />
                <p className="text-slate-300 mb-6 italic leading-relaxed flex-grow">"{testimonial.text}"</p>
                <div className="flex items-center justify-between mt-auto"> 
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-teal-500/50 transition-colors"
                    />
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div> 
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-1 text-yellow-400 ml-4">
                    <AnimatePresence>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div key={i} custom={i} variants={starVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                          <Star className="w-4 h-4" fill="currentColor" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </SpotlightCard>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button onClick={onAddReviewClick} className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto">
            <MessageSquarePlus className="w-5 h-5" />
            Be the Next Success Story
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;