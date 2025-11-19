
import { motion, type Variants, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react'; 
import StardustBackground from '../ui/StardustBackground';
import Partners from '../ui/Partners';
import { stats } from '../../data/stats';
interface HeroSectionProps {
  isLoading: boolean;
  isMenuOpen: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  setShowVideo: (show: boolean) => void;
  onGetStartedClick: () => void;
}

// --- Animation Variants (Moved outside component for performance) ---

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const titleContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: i * 0.08 },
  }),
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 100 } },
};

const HeroSection: React.FC<HeroSectionProps> = ({ isLoading, isMenuOpen, setSectionRef, setShowVideo, onGetStartedClick }) => {
  // Hooks for interactive mouse effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform for interactive glow (moves with the mouse)
  const glowParallaxX = useTransform(x, [-100, 100], [-30, 30]);
  const glowParallaxY = useTransform(y, [-100, 100], [-30, 30]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.section 
      ref={setSectionRef('Home')} 
      id="Home" 
      className={`min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-10 relative overflow-hidden pt-24 pb-12 transition-all duration-300 ${isMenuOpen ? 'z-0' : 'z-10'}`} 
      initial="hidden" 
      animate={!isLoading ? "visible" : "hidden"} 
      variants={sectionVariants} 
    >
      <StardustBackground />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-1">
        <motion.div className="text-center lg:text-left z-10" variants={containerVariants} initial="hidden" animate={!isLoading ? "visible" : "hidden"} >
          <motion.div variants={itemVariants} className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full mb-4 hover:bg-teal-500/20 hover:border-teal-400/60 transition-all duration-300 cursor-default">
            Where Ideas Take Flight
          </motion.div>

          <motion.h1 variants={titleContainer} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-white balance-text mb-6 overflow-hidden">
            <motion.span variants={wordVariant} className="inline-block pr-4">Navigating</motion.span>
            <motion.span variants={wordVariant} className="inline-block">Digital</motion.span>
            <br />
            <div className="relative inline-block mt-2 px-2 -mx-2">
              <motion.span 
                variants={wordVariant}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                // Terapkan class baru untuk efek kilau di dalam teks
                className="text-shine-effect inline-block cursor-pointer"
              >
                Neverlands
              </motion.span>

              <motion.div
                className="absolute -bottom-3 left-0 h-[3px] bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                animate={!isLoading ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              />
            </div>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed balance-text mb-10">
            We blend creative artistry with technical excellence to build digital solutions that are not only visually stunning but also deliver measurable results. Your vision, our expertise.
          </motion.p>

          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-teal-500/50 hover:bg-slate-800/50 transition-all duration-300 group transform hover:-translate-y-1.5">
                <div className="w-12 h-12 bg-slate-900/50 border border-slate-700 rounded-full flex items-center justify-center text-teal-400 mx-auto mb-3 group-hover:bg-teal-500/10 group-hover:text-teal-300 transition-all duration-300">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-white transition-colors duration-300">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={onGetStartedClick} 
              className="btn-cartoon flex items-center justify-center gap-2 group flex-1 sm:flex-none text-base"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button> 
            <button 
              onClick={() => setShowVideo(true)}
              className="btn-cartoon-secondary flex items-center justify-center gap-2 group flex-1 sm:flex-none text-base"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="hidden lg:flex items-center justify-center relative" 
          variants={itemVariants}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div 
            className="relative p-2 bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-sm"
          >
            <motion.div
              className="absolute inset-0 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow -z-10"
              style={{ x: glowParallaxX, y: glowParallaxY }}
            ></motion.div>
            <motion.div
              animate={{ y: ["-10px", "10px", "-10px"] }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <img 
                src="/images/Neverland Studio.webp" 
                alt="Neverland Studio Showcase" 
                className="w-full h-auto max-w-md rounded-lg shadow-2xl shadow-teal-900/50 object-contain relative z-10"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bagian "Trusted By" dengan separator */}
      <motion.div 
        className="w-full max-w-7xl mx-auto mt-20 lg:mt-24 z-1"
        variants={containerVariants}
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* Animated Separator Outline */}
        <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
        </motion.div>
        <motion.div variants={itemVariants} className="w-full pt-12 lg:pt-16">
          <p className="text-center text-slate-400 font-medium tracking-widest text-sm uppercase mb-8">Trusted by Industry Leaders</p>
          <Partners />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;