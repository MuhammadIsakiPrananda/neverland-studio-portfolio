import { useEffect, useState } from 'react';
import { Headset, ChevronUp, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Chatbot from '../ui/Chatbot';
import { useChatbot } from '../sections/ChatbotContext';

const FloatingButtons = () => {
  const { isChatOpen, setIsChatOpen } = useChatbot();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  return (
    <>
      <Chatbot isOpen={isChatOpen} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-4 sm:right-8 flex flex-col gap-4 z-40">
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-slate-900 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center group border border-slate-700 hover:border-amber-500/50 transition-colors duration-300"
          title={isChatOpen ? "Close Chat" : "Chat with AI Assistant"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div key={isChatOpen ? 'x' : 'sparkles'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              {isChatOpen ? <X className="w-7 h-7 text-amber-400" /> : <Headset className="w-7 h-7 text-amber-400" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-4 sm:left-8 w-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700/50 hover:border-amber-500/50 transition-all z-40"
            title="Scroll to Top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-6 h-6 text-amber-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButtons;