import { motion, type Variants } from "framer-motion";
import { ChevronRight, Play, Github, Linkedin, Instagram, Twitter } from "lucide-react";
import { StardustBackground, Partners } from "@/shared/components";
import { stats } from "@/features/landing/data/stats.tsx";
import CountUp from "../ui/CountUp";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const getStatLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      "Happy Clients": t("hero.stats.clients"),
      "Projects Completed": t("hero.stats.projects"),
      "Team Members": t("hero.stats.team"),
      "Years Experience": t("hero.stats.experience"),
    };
    return labelMap[label] || label;
  };

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
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            variants={titleContainer}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-white balance-text mb-6 overflow-hidden"
          >
            <motion.span variants={wordVariant} className="inline-block pr-4">
              {t("hero.title1")}
            </motion.span>
            <motion.span variants={wordVariant} className="inline-block">
              {t("hero.title2")}
            </motion.span>
            <br />
            <div className="relative inline-block mt-2 px-2 -mx-2">
              <motion.span
                variants={wordVariant}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                // Menerapkan efek gradien untuk teks yang lebih modern
                className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent inline-block cursor-pointer"
              >
                {t("hero.highlight")}
              </motion.span>

              <motion.div
                className="absolute -bottom-3 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
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
            {t("hero.description")}
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
                    {typeof stat.number === "string" &&
                    /^\d+/.test(stat.number) ? (
                      <CountUp
                        end={parseFloat(stat.number)}
                        duration={1200}
                        decimals={stat.number.includes(".") ? 1 : 0}
                        suffix={stat.number.replace(/^[\d\.]+/, "")}
                        shouldStart={!isLoading}
                      />
                    ) : (
                      stat.number
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {getStatLabel(stat.label)}
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
              className="group inline-flex items-center justify-center px-7 py-3 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transform hover:scale-105 flex-1 sm:flex-none"
            >
              {t("hero.getStarted")}
              <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="group inline-flex items-center justify-center px-7 py-3 text-base font-medium text-slate-200 bg-transparent border-2 border-slate-700 rounded-full transition-all duration-300 hover:border-amber-500 hover:bg-amber-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-600 transform hover:scale-105 flex-1 sm:flex-none"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {t("hero.watchDemo")}
            </button>
          </motion.div>

          {/* Follow Us Section Modern Lucide Outline */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center mt-8 mb-2"
            initial="hidden"
            animate="visible"
          >
            <span className="uppercase tracking-widest text-xs font-semibold text-slate-400 mb-3">Follow Us</span>
            <div className="flex gap-3">
              <a
                href="https://github.com/MuhammadIsakiPrananda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="group w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 hover:border-amber-500 transition-all bg-slate-900/60 hover:bg-amber-500/10 shadow-lg hover:scale-110"
              >
                <Github className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-isaki-prananda-454668240/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 hover:border-amber-500 transition-all bg-slate-900/60 hover:bg-amber-500/10 shadow-lg hover:scale-110"
              >
                <Linkedin className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.instagram.com/tuanmudazaky_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 hover:border-amber-500 transition-all bg-slate-900/60 hover:bg-amber-500/10 shadow-lg hover:scale-110"
              >
                <Instagram className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="group w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 hover:border-amber-500 transition-all bg-slate-900/60 hover:bg-amber-500/10 shadow-lg hover:scale-110"
              >
                <Twitter className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="hidden lg:flex items-center justify-center relative"
          variants={itemVariants}
        >
          <motion.img
            src="/images/Neverland Studio.webp"
            alt="Neverland Studio Showcase"
            className="w-full h-auto max-w-md rounded-2xl object-contain shadow-2xl shadow-amber-500/10 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            animate={{
              y: [0, -10, 0], // Efek melayang naik-turun
              boxShadow: [
                // Efek cahaya berdenyut
                "0 25px 50px -12px rgba(245, 158, 11, 0.1)",
                "0 25px 50px -12px rgba(245, 158, 11, 0.2)",
                "0 25px 50px -12px rgba(245, 158, 11, 0.1)",
              ],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.3 },
            }}
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
              {t("hero.trustedBy")}
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
