import { useState, useEffect } from 'react';
import { X, Star, Send, User, Briefcase, Building2, MessageSquare } from 'lucide-react';
import type { Theme } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface WriteReviewModalProps {
  theme: Theme;
  onClose: () => void;
}

export default function WriteReviewModal({ theme, onClose }: WriteReviewModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [ratingError, setRatingError] = useState<string | undefined>();
  const [reviewError, setReviewError] = useState<string | undefined>();

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(undefined);
    setEmailError(undefined);
    setRatingError(undefined);
    setReviewError(undefined);

    // Validate
    let hasError = false;

    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (rating === 0) {
      setRatingError('Please select a rating');
      hasError = true;
    }

    if (!review.trim()) {
      setReviewError('Review is required');
      hasError = true;
    } else if (review.trim().length < 20) {
      setReviewError('Review must be at least 20 characters');
      hasError = true;
    }

    if (hasError) return;

    // Simulate submission
    console.log({ name, email, company, position, rating, review });
    setSubmitted(true);

    // Auto close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900/95 rounded-xl border border-slate-800 max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors group"
        >
          <X className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-800">
                <h2 className="text-xl font-semibold text-white mb-1">Write a Review</h2>
                <p className="text-sm text-slate-400">Share your experience with us</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3 py-2.5 bg-slate-800/50 border ${
                        nameError ? 'border-red-500/50' : 'border-slate-700/50'
                      } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Your name"
                    />
                    {nameError && <p className="mt-1.5 text-xs text-red-400">{nameError}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2.5 bg-slate-800/50 border ${
                        emailError ? 'border-red-500/50' : 'border-slate-700/50'
                      } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Your Email Address"
                    />
                    {emailError && <p className="mt-1.5 text-xs text-red-400">{emailError}</p>}
                  </div>
                </div>

                {/* Company & Position */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Company */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Company <span className="text-slate-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Company name"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Position <span className="text-slate-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Your position"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Rating <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-xs text-slate-500">
                        {rating}/5
                      </span>
                    )}
                  </div>
                  {ratingError && <p className="mt-1.5 text-xs text-red-400">{ratingError}</p>}
                </div>

                {/* Review */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Your Review <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    className={`w-full px-3 py-2.5 bg-slate-800/50 border ${
                      reviewError ? 'border-red-500/50' : 'border-slate-700/50'
                    } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
                    placeholder="Share your experience with us..."
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    {reviewError ? (
                      <p className="text-xs text-red-400">{reviewError}</p>
                    ) : (
                      <p className="text-xs text-slate-600">Min. 20 characters</p>
                    )}
                    <p className="text-xs text-slate-600">{review.length}</p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-sm text-slate-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Success State
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Thank You!</h3>
              <p className="text-sm text-slate-400">Your review has been submitted</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
