import { useEffect, useState } from "react";
import { Headset, ChevronUp, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Chatbot } from "../ui";
import { useChatbot } from "./ChatbotContext";

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
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollTop]);

  // Handler WhatsApp dengan pesan default
  const handleWhatsAppClick = () => {
    const baseUrl = "https://wa.me/628995257735";
    const defaultText =
      "Halo Neverland Studio 👋 Saya tertarik dengan layanan kalian. Bisa beri info paket & harga?";
    const text = `?text=${encodeURIComponent(defaultText)}`;
    window.open(baseUrl + text, "_blank");
  };

  return (
    <>
      <Chatbot isOpen={isChatOpen} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-4 sm:right-8 flex flex-col gap-4 z-40">
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-slate-900 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center group border border-slate-700 hover:border-amber-500/50 transition-colors duration-300"
          title={isChatOpen ? "Close Chat" : "Live Chat"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isChatOpen ? "x" : "sparkles"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isChatOpen ? (
                <X className="w-7 h-7 text-amber-400" />
              ) : (
                <Headset className="w-7 h-7 text-amber-400" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
        {/* WhatsApp Floating Button */}
        <motion.button
          onClick={handleWhatsAppClick}
          className="w-16 h-16 bg-green-500 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center group border border-slate-700 hover:border-green-400 transition-colors duration-300"
          title="Chat WhatsApp"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8"
          >
            <circle cx="12" cy="12" r="12" fill="#25D366" />
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.029-.967-.272-.099-.47-.148-.669.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
              fill="#fff"
            />
          </svg>
        </motion.button>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
