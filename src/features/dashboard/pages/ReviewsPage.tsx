import { testimonials } from '@/features/landing/data/testimonials';
import { Star, MessageSquare } from 'lucide-react';

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

const ReviewsPage = () => {
  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Inbox: Reviews</h1>
        <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full">
          <span className="font-semibold text-white">{testimonials.length}</span>
          <span className="text-slate-400">Total Reviews</span>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-slate-800/50 border border-slate-700 rounded-xl p-12 min-h-[400px]">
          <MessageSquare className="w-16 h-16 text-slate-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Reviews Yet</h2>
          <p className="text-slate-400 max-w-sm">
            When users submit reviews through the website, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 transition-all hover:border-amber-500/50 hover:bg-slate-800"
            >
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-600 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold text-white">{testimonial.name}</h3>
                      <p className="text-xs text-slate-400">{testimonial.role}</p>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;