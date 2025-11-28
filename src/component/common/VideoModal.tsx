
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  showVideo: boolean;
  setShowVideo: (show: boolean) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ showVideo, setShowVideo }) => {
  return (
    <AnimatePresence>
      {showVideo && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
            <div className="aspect-video relative">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
            <div className="p-6 border-t border-slate-800"> 
            <h3 className="text-xl font-bold text-white mb-2">Never Gonna Give You Up</h3>
            <p className="text-slate-400 text-sm">Rick Astley - Official Music Video</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default VideoModal;