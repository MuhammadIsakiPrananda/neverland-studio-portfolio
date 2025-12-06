import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import type { services } from "@/features/landing/data/services.tsx";

// Asumsi struktur data di `data/services.ts` diperkaya seperti ini:
type Service = (typeof services)[0] & {
  detailedDesc: string[]; // Array of paragraphs for detailed description
  features: string[]; // Array of key features
};

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
}) => {
  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { scale: 0.9, y: 20, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { scale: 0.9, y: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Sticky Header with Close Button */}
            <div className="sticky top-0 p-4 sm:p-6 flex justify-between items-center bg-slate-900/70 backdrop-blur-lg border-b border-slate-800 z-10 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <service.icon.type className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-amber-400 font-semibold">
                    Service Spotlight
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    {service.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <X className="w-6 h-6 text-slate-300" />
              </button>
            </div>

            <div className="overflow-y-auto">
              {/* Modal Content */}
              <div className="p-6 sm:p-8 lg:p-10 grid md:grid-cols-5 gap-8">
                {/* Main Content */}
                <div className="md:col-span-3 space-y-6 text-slate-300">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Project Overview
                    </h3>
                    <p className="text-lg text-slate-200 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-amber-500/30 via-slate-700 to-transparent"></div>
                  {/* Render detailed description paragraphs */}
                  <div className="space-y-4 leading-relaxed">
                    {(service.detailedDesc || []).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Sidebar with Features */}
                <div className="md:col-span-2">
                  <div className="sticky top-0 bg-slate-800/50 border border-slate-700/80 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-5">
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {(service.features || []).map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: 0.2 + index * 0.1,
                              ease: "easeOut",
                            },
                          }}
                        >
                          <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailModal;
