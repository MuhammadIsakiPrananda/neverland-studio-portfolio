import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div className="flex items-center gap-3 flex-shrink-0 group" aria-label="Neverland Studio Home">
      <motion.div
        className="w-10 h-10 rounded-full overflow-hidden shadow-md group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300 border-2 border-zinc-800 group-hover:border-amber-500/50"
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <img src="/images/Neverland Studio.webp" alt="Neverland Studio Logo" className="w-full h-full object-cover" />
      </motion.div>
      <div className="flex flex-col">
        <span 
          className="text-xl font-black tracking-tighter text-transparent bg-clip-text 
                     bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400
                     animate-shimmer bg-[length:200%_auto]"
          style={{ filter: 'drop-shadow(0 1px 3px rgba(245, 158, 11, 0.3))' }}
        >
          Neverland
        </span>
        <span className="text-sm font-bold tracking-widest text-zinc-400 pl-0.5 group-hover:text-zinc-300 transition-colors duration-300">Studio</span>
      </div>
    </div>
  );
};

export default Logo;