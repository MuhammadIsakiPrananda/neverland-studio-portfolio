import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { team } from "@/features/landing/data/team";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeamSectionProps {
  isLoading: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  onJoinTeamClick: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  isLoading,
  setSectionRef,
  onJoinTeamClick,
}) => {
  const { t } = useLanguage();
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={(el) => {
        setSectionRef("Team")(el);
        if (el) sectionRef.current = el;
      }}
      id="Team"
      className="py-20 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
            {t("team.title")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
            {t("team.title")}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t("team.subtitle")}
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group transform hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-amber-400 text-sm mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm mb-4">{member.bio}</p>
                <div className="flex gap-3">
                  <button className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center hover:bg-amber-500/20 transition-all">
                    <Linkedin className="w-4 h-4 text-amber-300" />
                  </button>
                  <button className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center hover:bg-amber-500/20 transition-all">
                    <Twitter className="w-4 h-4 text-amber-300" />
                  </button>
                  <button className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center hover:bg-amber-500/20 transition-all">
                    <Mail className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <button
            onClick={onJoinTeamClick}
            className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105"
          >
            {t("team.joinTeam")}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TeamSection;
