import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { ReviewForm } from "@/shared/components";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "100vh", opacity: 0, scale: 0.8 },
    visible: {
      y: "0",
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          // onClick={onClose} // Dihapus agar tidak menutup saat backdrop diklik
        >
          <motion.div
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 w-full max-w-lg relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <ReviewForm onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
