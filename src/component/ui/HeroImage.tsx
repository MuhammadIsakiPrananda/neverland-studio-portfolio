import { motion } from 'framer-motion';

const HeroImage = () => {
  return (
    <motion.div
      className="w-[450px] h-[450px] relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Decorative Glows */}
      <div className="absolute -top-10 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-10 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Main Image Container */}
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/40 border-2 border-slate-800/80 relative">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1484&auto=format&fit=crop&fm=webp" alt="Digital Agency Team" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </motion.div>
  );
};

export default HeroImage;