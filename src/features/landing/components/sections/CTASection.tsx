import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Rocket, Phone, Linkedin, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CTASectionProps {
  isLoading: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isLoading }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-lg border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div>
            <div className="inline-block p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-6">
              <Rocket className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("Contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 group transform hover:scale-105"
            >
              {t("cta.button")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Contact Cards */}
          <div className="space-y-6">
            {[
              {
                icon: <Mail className="w-6 h-6 text-cyan-400" />,
                title: t("cta.emailTitle"),
                detail: "arlianto032@gmail.com",
                action: t("cta.sendNow"),
                href: "mailto:arlianto032@gmail.com",
              },
              {
                icon: <Phone className="w-6 h-6 text-cyan-400" />,
                title: t("cta.scheduleTitle"),
                detail: t("cta.scheduleDetail"),
                action: t("cta.schedule"),
                href: "https://calendly.com/your-link",
              },
              {
                icon: <Linkedin className="w-6 h-6 text-cyan-400" />,
                title: t("cta.linkedinTitle"),
                detail: t("cta.linkedinDetail"),
                action: t("cta.connect"),
                href: "https://www.linkedin.com/in/your-profile",
              },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                target={item.href?.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="bg-slate-800/50 border border-white/10 rounded-xl p-6 flex items-center justify-between hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.detail}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all ">
                  {item.action} <ArrowRight className="inline w-4 h-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
