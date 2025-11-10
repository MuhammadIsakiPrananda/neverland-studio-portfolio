
import { motion, type Variants } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import SpotlightCard from '../ui/SpotlightCard';

const TestimonialsSection = () => {
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

  return (
    <motion.section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}> 
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
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
              className="bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 transition-all break-inside-avoid flex flex-col"
            >
              <div className="relative z-10 flex flex-col h-full flex-grow">
                <Quote className="w-10 h-10 text-sky-500/30 mb-4" />
                <p className="text-slate-300 mb-6 italic leading-relaxed flex-grow">"{testimonial.text}"</p>
                <div className="flex items-center justify-between mt-auto"> 
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-sky-500/50 transition-colors"
                    />
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div> 
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-1 text-yellow-400 ml-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="currentColor" />
                  ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105">
            Read More Reviews
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;