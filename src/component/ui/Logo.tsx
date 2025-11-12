import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div className="flex items-center gap-3 flex-shrink-0 group" aria-label="Neverland Studio Home">
      <motion.div
        className="w-10 h-10 rounded-full overflow-hidden shadow-md group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 border-2 border-slate-700 group-hover:border-cyan-500/50"
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <img src="/images/Neverland Studio.webp" alt="Neverland Studio Logo" className="w-full h-full object-cover" />
      </motion.div>
      <div className="flex flex-col -space-y-1.5">
        <span 
          className="shimmer-text text-xl font-black tracking-tighter bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(20, 184, 166, 0.3))' }}
        >
          Neverland
        </span>
        <span className="text-sm font-bold tracking-widest text-slate-400 pl-0.5 group-hover:text-slate-300 transition-colors duration-300">Studio</span>
      </div>
    </div>
  );
};

export default Logo;