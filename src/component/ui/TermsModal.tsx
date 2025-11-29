import { X, UserCircle, FileText, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const termsItems = [
  {
    icon: <UserCircle className="w-6 h-6 text-amber-400" />,
    title: "1. Your Account",
    content: "You are responsible for safeguarding your account. Use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above."
  },
  {
    icon: <FileText className="w-6 h-6 text-amber-400" />,
    title: "2. Content",
    content: "Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness."
  },
  {
    icon: <Ban className="w-6 h-6 text-amber-400" />,
    title: "3. Prohibited Uses",
    content: "You may use the Service only for lawful purposes. You may not use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere with any other party's use of the Service."
  }
];

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAgree }) => {  
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },    
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: "easeIn" as const } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex justify-center items-center p-4"
          onClick={onClose} // Menutup modal jika area luar diklik
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/40 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
            variants={modalVariants}
          >
            {/* Aurora Effect */}
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow opacity-50"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-3000 opacity-50"></div>

            <div className="relative flex justify-between items-center p-6 border-b border-slate-800 flex-shrink-0">
              <h3 className="text-2xl font-bold text-amber-400">Terms & Conditions</h3>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white hover:bg-slate-700/50 p-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
              <p className="text-slate-300">Welcome to Neverland Studio! By using our services, you agree to these terms. Please read them carefully. Last updated: June 10, 2024.</p>
              
              <motion.div 
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              >
                {termsItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-5"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <div className="flex-shrink-0 mt-1 w-8 h-8 flex items-center justify-center bg-slate-800/50 rounded-full border border-slate-700">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-lg">{item.title}</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <p className="pt-4 text-slate-400 text-sm">By clicking "I Understand & Agree", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
            </div>
            <div className="relative p-6 border-t border-slate-800 flex justify-end items-center gap-4 flex-shrink-0">
              <button type="button" onClick={onClose} className="text-slate-400 font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-slate-800 hover:text-slate-100">
                Close
              </button>
              <button type="button" onClick={onAgree} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-8 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-1">
                I Understand & Agree
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;