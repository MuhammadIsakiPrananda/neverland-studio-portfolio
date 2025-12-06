import { motion, type Variants } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { StardustBackground, Partners } from "@/shared/components";
import { stats } from "@/features/landing/data/stats.tsx";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

const HeroSection: React.FC<HeroSectionProps> = ({
  isLoading,
  isMenuOpen,
  setSectionRef,
  setShowVideo,
  onGetStartedClick,
}) => {
  const handleGetStartedClick = () => {
    // Panggil fungsi asli jika ada logika lain (misal: menutup menu)
    onGetStartedClick();
    // Lakukan scroll ke bagian Contact
    document.getElementById("Contact")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <motion.section
      ref={setSectionRef("Home")}
      id="Home"
      className={`min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-10 relative overflow-hidden pt-24 pb-12 transition-all duration-300 ${
        isMenuOpen ? "z-0" : "z-10"
      }`}
      initial="hidden"
      animate={!isLoading ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <StardustBackground />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-1">
        <motion.div
          className="text-center lg:text-left z-10"
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full mb-4 hover:bg-amber-500/20 hover:border-amber-400/60 transition-all duration-300 cursor-default"
          >
            Your Partner in Digital Innovation
          </motion.div>

          <motion.h1
            variants={titleContainer}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-white balance-text mb-6 overflow-hidden"
          >
            <motion.span variants={wordVariant} className="inline-block pr-4">
              Navigating
            </motion.span>
            <motion.span variants={wordVariant} className="inline-block">
              Digital
            </motion.span>
            <br />
            <div className="relative inline-block mt-2 px-2 -mx-2">
              <motion.span
                variants={wordVariant}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                // Menerapkan efek gradien untuk teks yang lebih modern
                className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent inline-block cursor-pointer"
              >
                Neverlands
              </motion.span>

              <motion.div
                className="absolute -bottom-3 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={!isLoading ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              />
            </div>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed balance-text mb-10"
          >
            We blend{" "}
            <span className="text-amber-400 font-semibold">
              creative artistry
            </span>{" "}
            with{" "}
            <span className="text-amber-400 font-semibold">
              technical excellence
            </span>{" "}
            to build digital solutions that are not only visually stunning but
            also deliver{" "}
            <span className="text-amber-400 font-semibold">
              measurable results
            </span>
            . Your vision, our expertise.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all duration-300 group transform hover:-translate-y-1.5"
              >
                <div className="w-12 h-12 bg-slate-900/50 border border-slate-700 rounded-full flex items-center justify-center text-amber-400 mx-auto mb-3 group-hover:bg-amber-500/10 group-hover:text-amber-300 transition-all duration-300">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-white transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-row gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={handleGetStartedClick}
              className="group inline-flex items-center justify-center px-7 py-3 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transform hover:scale-105 flex-1 sm:flex-none"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="group inline-flex items-center justify-center px-7 py-3 text-base font-medium text-slate-200 bg-transparent border-2 border-slate-700 rounded-full transition-all duration-300 hover:border-amber-500 hover:bg-amber-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-600 transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
        <motion.div
          className="hidden lg:flex items-center justify-center relative"
          variants={itemVariants}
        >
          <motion.img
            src="/images/Neverland Studio.webp"
            alt="Neverland Studio Showcase"
            className="w-full h-auto max-w-md rounded-2xl object-contain shadow-2xl shadow-amber-500/10"
            animate={{
              y: [0, -10, 0], // Efek melayang naik-turun
              boxShadow: [
                // Efek cahaya berdenyut
                "0 25px 50px -12px rgba(251, 191, 36, 0.1)",
                "0 25px 50px -12px rgba(251, 191, 36, 0.2)",
                "0 25px 50px -12px rgba(251, 191, 36, 0.1)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* --- Bagian "Trusted By" yang Didesain Ulang --- */}
      <motion.div
        className="w-full max-w-7xl mx-auto mt-24 lg:mt-32 z-1"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.div variants={itemVariants} className="relative text-center">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-slate-800/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-900 px-5 text-sm font-medium tracking-wider uppercase text-slate-400">
              Trusted By
            </span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="w-full pt-10 lg:pt-12">
          <Partners />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
