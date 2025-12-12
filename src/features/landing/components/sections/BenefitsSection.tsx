import { useState, useRef } from "react";
import {
  motion,
  type Variants,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { benefits, type Benefit } from "@/features/landing/data/benefits.tsx";
import { useLanguage } from "@/contexts/LanguageContext";

interface BenefitsSectionProps {
  isLoading: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ isLoading }) => {
  const { t } = useLanguage();
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.section
      className="py-20 sm:py-28 bg-slate-950 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            {t("benefits.title")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 text-white">
            {t("benefits.title")}
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto balance-text">
            {t("benefits.subtitle")}
            digital experiences that don't just look good—they perform, engage,
            and drive business growth.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              benefit={benefit}
              variants={itemVariants}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

interface BenefitCardProps {
  benefit: Benefit;
  variants: Variants;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, variants }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(mouseY, [-1, 1], [-10, 10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-1, 1], [10, -10]),
    springConfig
  );

  // Spotlight Effect Logic
  const [spotlightPosition, setSpotlightPosition] = useState({
    x: -100,
    y: -100,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const { width, height, left, top } = rect;

      // For 3D Tilt
      const mouseX_val = (e.clientX - left) / width - 0.5;
      const mouseY_val = (e.clientY - top) / height - 0.5;
      mouseX.set(mouseX_val);
      mouseY.set(mouseY_val);

      // For Spotlight
      setSpotlightPosition({ x: e.clientX - left, y: e.clientY - top });
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlightPosition({ x: -100, y: -100 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={variants}
      className="relative border border-white/10 rounded-2xl overflow-hidden group transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10"
      style={{
        perspective: "1000px",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glowing Outline Effect */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${spotlightPosition.x}px ${spotlightPosition.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Spotlight Effect */}
      <div
        className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px at ${spotlightPosition.x}px ${spotlightPosition.y}px, rgba(6, 182, 212, 0.1), transparent 80%)`,
          transform: "translateZ(20px)", // Push spotlight slightly forward
        }}
      />
      <div
        className="relative h-full bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl text-center flex flex-col border border-white/5"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-500`}
          >
            <div className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
              {benefit.icon}
            </div>
          </div>
        </div>
        <div
          className="flex-grow flex flex-col"
          style={{ transform: "translateZ(20px)" }}
        >
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors duration-300">{benefit.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed flex-grow group-hover:text-slate-300 transition-colors duration-300">
            {benefit.description}
          </p>
          {benefit.details && (
            <ul className="mt-4 text-left text-sm text-slate-400 space-y-2 pl-4 list-disc list-inside">
              {benefit.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BenefitsSection;
