import { motion, type Variants } from 'framer-motion';

const LoadingScreen = () => {
  const containerVariants: Variants = {
    initial: { opacity: 1 },
    exit: {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
    },
  };

  const imageVariants: Variants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
  };

  const textContainer: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
  };

  const textVariant: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 bg-gradient-to-br from-[#0c001f] via-[#000] to-[#0c001f] z-[200] flex items-center justify-center"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
    >
      <div className="flex items-center space-x-4">
        <motion.div 
          variants={imageVariants}
          initial="initial"
          animate="animate" 
          className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-sky-500/20 border-2 border-sky-500/50"
        >
          <img src="/images/Neverland Studio.webp" alt="Neverland Studio Logo" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div 
          variants={textContainer}
          initial="initial"
          animate="animate" 
          className="flex flex-col justify-center"
        >
          <motion.span variants={textVariant} className="block text-2xl font-bold tracking-wider leading-none bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent"> 
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