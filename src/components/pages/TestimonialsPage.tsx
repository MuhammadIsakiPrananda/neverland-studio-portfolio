import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User, MessageSquarePlus } from 'lucide-react';
import type { Theme } from '../../types';
import { testimonials } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import WriteReviewModal from '../modals/WriteReviewModal';

interface TestimonialsPageProps {
  theme: Theme;
}

export default function TestimonialsPage({ theme }: TestimonialsPageProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-blue-500/25 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/4 left-1/2 w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            {t('testimonials.hero.title')}
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            {t('testimonials.hero.subtitle')}
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-5xl mx-auto">
          {/* Slider Container */}
          <div className="overflow-hidden rounded-xl">
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-700 ease-out"
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full px-2"
                  style={{ flex: '0 0 100%' }}
                >
                  <div className="relative rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-5 md:p-6 lg:p-8 shadow-lg">
                    {/* Large Quote Icon */}
                    <div className="absolute top-4 right-4 opacity-5">
                      <Quote className="w-16 h-16 md:w-20 md:h-20 text-blue-400" fill="currentColor" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Avatar & Info */}
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-4">
                        {/* Avatar */}
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                          {testimonial.avatar ? (
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                              <User className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-0.5">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-400 mb-0.5">
                            {testimonial.position}
                          </p>
                          <p className="text-xs md:text-sm font-semibold text-blue-400">
                            {testimonial.company}
                          </p>
                        </div>

                        {/* Star Rating */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-4 h-4 ${
                                idx < testimonial.rating
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-slate-700'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-sm md:text-base lg:text-lg text-slate-200 leading-relaxed italic text-center md:text-left">
                        "{testimonial.content}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-12 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600/50 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm z-10"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={goToNext}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-12 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600/50 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm z-10"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-10 h-2.5 bg-blue-500'
                  : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-slate-900/30 border border-slate-700/30 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">500+</div>
            <div className="text-xs md:text-sm text-slate-400">Projects Delivered</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-900/30 border border-slate-700/30 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">98%</div>
            <div className="text-xs md:text-sm text-slate-400">Client Satisfaction</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-900/30 border border-slate-700/30 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">4.9/5</div>
            <div className="text-xs md:text-sm text-slate-400">Average Rating</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-900/30 border border-slate-700/30 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">25+</div>
            <div className="text-xs md:text-sm text-slate-400">Countries Served</div>
          </div>
        </div>

        {/* More Testimonials Grid */}
        <div className="mt-12 max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">More Client Stories</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="group relative p-6 rounded-xl bg-slate-900/30 border border-slate-700/30 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-blue-400" fill="currentColor" />
                </div>
                
                {/* Avatar & Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                    {testimonial.avatar ? (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{testimonial.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{testimonial.position}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${
                        idx < testimonial.rating
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-700'
                      }`} 
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-slate-300 line-clamp-4 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Company */}
                <div className="mt-4 pt-4 border-t border-slate-700/30">
                  <p className="text-xs font-semibold text-blue-400">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Primary Button - Write Review */}
          <button 
            onClick={() => setShowReviewModal(true)}
            className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            <div className="relative flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
              <span className="text-white text-sm font-medium tracking-wide">Write a Review</span>
            </div>
          </button>

          {/* Secondary Button - View All */}
          <button className="group relative px-6 py-2.5 bg-transparent hover:bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 hover:-translate-y-0.5 backdrop-blur-sm">
            <div className="relative flex items-center gap-2">
              <span className="text-slate-300 text-sm group-hover:text-blue-400 font-medium tracking-wide transition-colors duration-300">View All Reviews</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {/* Subtext */}
        <p className="mt-4 text-center text-xs text-slate-500">
          Join <span className="text-blue-400 font-semibold">{testimonials.length}+</span> satisfied clients who trusted us
        </p>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <WriteReviewModal 
          theme={theme}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
