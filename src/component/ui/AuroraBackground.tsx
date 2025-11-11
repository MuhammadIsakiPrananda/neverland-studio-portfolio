import { motion } from 'framer-motion';

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-[80vmax] h-[80vmax] rounded-full bg-cyan-500/10 blur-3xl"
        style={{ x: '-30%', y: '-40%' }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[60vmax] h-[60vmax] rounded-full bg-teal-500/10 blur-3xl"
        style={{ x: '30%', y: '40%' }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 5 }}
      />
    </div>
  );
};

export default AuroraBackground;