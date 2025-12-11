import { useRef } from "react";
import {
  motion,
  useInView,
  type Variants,
  AnimatePresence,
} from "framer-motion";
import { Star, Quote, Edit } from "lucide-react";
import { testimonials } from "@/features/landing/data/testimonials";
import { SpotlightCard } from "@/shared/components";

interface TestimonialsSectionProps {
  isLoading: boolean;
  onAddReviewClick: () => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  isLoading,
  onAddReviewClick,
}) => {
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
        staggerChildren: 0.1,
      },
    },
  };

  const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 500,
        damping: 20,
      },
    }),
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
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-slate-800/50 px-4 py-1.5 text-sm font-medium border border-amber-500/30 shadow-lg shadow-amber-900/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-60 blur-lg animate-pulse-slow"></div>
              <Star className="relative w-4 h-4 text-amber-300" />
              <span className="relative bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text font-semibold text-transparent">
                Testimonials
              </span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white balance-text">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto balance-text">
            We're proud to have worked with amazing clients. Here's what they
            think about us.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, idx) => (
            <SpotlightCard
              key={idx}
              className="bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 transition-all flex flex-col group transform hover:-translate-y-2 hover:border-amber-500/50"
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="relative z-10 flex flex-col h-full"
              >
                <Quote className="w-12 h-12 text-amber-500/20 mb-4" />
                <p className="text-slate-300 mb-6 italic leading-relaxed flex-grow">
                  “{testimonial.text}”
                </p>
                <div className="flex flex-col gap-6 border-t border-slate-800 pt-6 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-500/50 transition-colors"
                      />
                      <div>
                        <div className="font-bold text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-1 text-amber-400 ml-4">
                      <AnimatePresence>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            custom={i}
                            variants={starVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                          >
                            <Star className="w-4 h-4" fill="currentColor" />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SpotlightCard>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button
            onClick={onAddReviewClick}
            className="flex items-center gap-2 bg-amber-500/10 text-amber-300 font-semibold px-6 py-3 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-300 shadow-lg shadow-amber-500/5 mx-auto transform hover:scale-105"
          >
            <Edit className="w-5 h-5" />
            Write a Review
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
