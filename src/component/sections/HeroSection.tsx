
import { motion, type Variants } from 'framer-motion';
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

const HeroSection: React.FC<HeroSectionProps> = ({ isLoading, isMenuOpen, setSectionRef, setShowVideo, onGetStartedClick }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };

  return (
    <motion.section 
      ref={setSectionRef('Home')} 
      id="Home" 
      className={`min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-24 pb-12 transition-all duration-300 ${isMenuOpen ? 'z-0' : 'z-10'}`} 
      initial="hidden" 
      animate={!isLoading ? "visible" : "hidden"} 
      variants={sectionVariants} 
    >
      <StardustBackground />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-1">
        <motion.div className="text-center lg:text-left z-10" variants={containerVariants} initial="hidden" animate={!isLoading ? "visible" : "hidden"} >
          <motion.div variants={itemVariants} className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full mb-6 hover:bg-teal-500/20 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-500 transform hover:scale-105 cursor-default">
            Welcome to Neverland: Where Ideas Take Flight
          </motion.div>

          <motion.h1 variants={titleContainer} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-white balance-text mb-8">
            <motion.span variants={wordVariant} className="inline-block">Navigating</motion.span>
            <motion.span variants={wordVariant} className="inline-block ml-4">Digital</motion.span>
            <br />
            <div className="relative inline-block mt-2">
              <motion.span variants={wordVariant} className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient">
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
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed balance-text mb-12">
            Neverland Studio is your partner in digital innovation. We blend creative artistry with technical excellence to build solutions that are not only visually stunning but also deliver measurable results.
          </motion.p>

          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 rounded-full flex items-center justify-center text-teal-400 mx-auto mb-3">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-row gap-4 justify-center lg:justify-start">
            <button onClick={onGetStartedClick} className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1 flex-1 sm:flex-none text-base">
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button> 
            <button 
              onClick={() => setShowVideo(true)}
              className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-slate-800/80 hover:border-teal-500/50 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 flex-1 sm:flex-none text-base text-white"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
        <motion.div className="hidden lg:flex items-center justify-center" variants={itemVariants}>
          <motion.div
            animate={{
              y: ["-10px", "10px", "-10px"],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <img 
              src="/images/Neverland Studio.webp" 
              alt="Neverland Studio Showcase" 
              className="w-full h-auto max-w-lg rounded-lg shadow-2xl shadow-teal-900/50 object-contain"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-20 lg:mt-24 z-1">
        <motion.div 
          variants={itemVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }}
          className="w-full"
        >
          <p className="text-center text-slate-300 font-semibold tracking-widest text-sm uppercase mb-8">TRUSTED BY INDUSTRY LEADERS</p>
          <Partners />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;