import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, MessageSquare, Star, Send, Loader, AlertCircle } from 'lucide-react';
import { useNotification } from './useNotification';

interface ReviewFormProps {
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review || rating === 0) {
      setError('Please fill in your name, review, and provide a rating.');
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addNotification('Review Submitted!', 'Thank you for your valuable feedback.', 'success');
      onClose();
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6 text-center">Share Your Experience</motion.h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /><span>{error}</span>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors" required />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Your Role / Company (Optional)" value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
          <textarea placeholder="Your review..." value={review} onChange={(e) => setReview(e.target.value)} rows={4}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors resize-none" required />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <label className="block text-sm font-medium mb-3 text-slate-300">Your Rating</label>
          <div className="flex justify-center gap-2" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-600'
                  }`}
                  fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading || !name || !review || rating === 0}
          className="w-full bg-gradient-to-r from-sky-500 to-violet-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-violet-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;