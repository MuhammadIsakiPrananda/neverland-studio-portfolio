import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import type { services } from '../../data/services';

// Asumsi struktur data di `data/services.ts` diperkaya seperti ini:
type Service = typeof services[0] & {
  detailedDesc: string[]; // Array of paragraphs for detailed description
  features: string[]; // Array of key features
};

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { scale: 0.9, y: 20, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
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
            className="relative bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Sticky Header with Close Button */}
            <div className="sticky top-0 p-4 flex justify-end bg-slate-900/50 backdrop-blur-sm z-10">
              <button onClick={onClose} className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                <X className="w-6 h-6 text-slate-300" />
              </button>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 pt-0">
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 flex-shrink-0">
                  <service.icon.type className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-teal-400 font-semibold">Layanan Unggulan Kami</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">{service.title}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 text-slate-300 leading-relaxed">
                  <p className="text-lg text-slate-200">{service.desc}</p>
                  {/* Render detailed description paragraphs */}
                  {(service.detailedDesc || []).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Sidebar with Features */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Apa yang Anda Dapatkan?</h4>
                    <ul className="space-y-3">
                      {(service.features || []).map((feature, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
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