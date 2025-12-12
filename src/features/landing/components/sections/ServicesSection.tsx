import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type MouseEvent,
} from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services } from "@/features/landing/data/services.tsx";
import ServiceDetailModal from "../ServiceDetailModal";
import { useLanguage } from "@/contexts/LanguageContext";

type Service = (typeof services)[0] & {
  detailedDesc: string[];
  features: string[];
};

interface ServicesSectionProps {
  isLoading: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

interface SpotlightCardProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty("--spotlight-x", `${x}px`);
    cardRef.current.style.setProperty("--spotlight-y", `${y}px`);
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={cardVariants}
      className={`group relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-lg p-8 transition-colors duration-300 before:absolute before:-inset-px before:rounded-2xl before:border before:border-transparent before:bg-[radial-gradient(400px_at_var(--spotlight-x)_var(--spotlight-y),rgba(6,182,212,0.15),transparent_40%)] before:opacity-0 before:transition-opacity before:duration-300 hover:border-cyan-500/40 hover:before:opacity-100 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  isLoading,
  setSectionRef,
}) => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    if (selectedService) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedService]);

  return (
    <motion.section
      ref={(el) => {
        setSectionRef("Services")(el);
        sectionRef.current = el;
      }}
      id="Services"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            {t("services.title")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
            {t("services.title")}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {services.map((service, idx) => (
            <SpotlightCard
              key={idx}
              onClick={() => setSelectedService(service as Service)}
            >
              {/* The content is now inside a z-10 container to appear above the spotlight effect */}
              <div className="relative z-10 flex h-full flex-col">
                <div className="w-16 h-16 mb-6 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center text-cyan-400 shadow-lg shadow-black/20 group-hover:scale-105 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300">
                  {/* Render the icon directly as a component */}
                  <service.icon.type className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-8">
                  <div className="inline-flex cursor-pointer items-center gap-2 font-semibold text-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        <ServiceDetailModal
          service={selectedService as Service | null}
          onClose={() => setSelectedService(null)}
        />
      </div>
    </motion.section>
  );
};

export default ServicesSection;
