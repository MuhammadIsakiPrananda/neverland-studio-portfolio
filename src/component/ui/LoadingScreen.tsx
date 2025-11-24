import { motion, type Variants } from 'framer-motion';

const LoadingScreen = () => {
  const containerVariants: Variants = {
    initial: { 
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
    },
    animate: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
    },
  };

  const textVariant: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 z-[200] flex items-center justify-center"
    >
      <div className="flex items-center space-x-4">
        <motion.div 
          variants={textVariant}
          className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-cyan-500/20 border-2 border-cyan-500/50"
        >
          <img src="/images/Neverland Studio.webp" alt="Neverland Studio Logo" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div 
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col justify-center"
        >
          <motion.span variants={textVariant} className="block text-2xl font-bold tracking-wider leading-none bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"> 
            Neverland
          </motion.span>
          <motion.span variants={textVariant} className="block text-base font-medium tracking-widest leading-none text-slate-300"> 
            Studio
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;