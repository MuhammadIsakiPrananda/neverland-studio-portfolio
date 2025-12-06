import { testimonials } from '@/features/landing/data/testimonials';
import { Star, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
      />
    ))}
  </div>
);

interface ReviewSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  onWriteReviewClick: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ setSectionRef, onWriteReviewClick }) => {
  if (testimonials.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section id="Reviews" ref={setSectionRef('Reviews')} className="py-20 sm:py-32 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 text-white balance-text">
            Loved by Teams Worldwide
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto balance-text">
            See what our clients are saying about their experience with Neverland Studio.
          </p>
        </motion.div>

        <motion.div
          // Mengubah ke layout masonry (kolom) untuk tampilan yang lebih dinamis
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={index}
              className="group h-full"
              variants={itemVariants}
            >
              {/* Kontainer utama kartu dengan transisi */}
              <div className="relative h-full rounded-lg overflow-hidden bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-px transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 shadow-lg shadow-slate-950/20">
                {/* Konten kartu dengan latar belakang solid */}
                <figure className="relative h-full flex flex-col bg-slate-900 rounded-[7px] transition-colors duration-300 group-hover:bg-slate-900/80">
                  {/* Aksen garis animasi di atas */}
                  <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent">
                    <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out group-hover:w-full"></div>
                  </div>

                {/* Isi Ulasan */}
                <blockquote className="p-6 flex-grow text-slate-300 leading-relaxed">
                  <p>"{testimonial.text}"</p>
                </blockquote>
                
                {/* Informasi Penulis */}
                <figcaption className="flex items-center gap-4 p-6 border-t border-slate-800 bg-slate-900/50">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-slate-700 transition-transform duration-300 group-hover:scale-110" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{testimonial.role}</div>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </figcaption>
                </figure>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 flex justify-center">
          <button onClick={onWriteReviewClick} className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber-500/30">
            {/* Efek Kilatan (Shine Effect) */}
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-white/0 via-white/40 to-white/0 transition-transform duration-1000 group-hover:translate-x-full"></span>
            
            {/* Konten Tombol */}
            <Edit className="relative w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
            <span className="relative">Write a Review</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;