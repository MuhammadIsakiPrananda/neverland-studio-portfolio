
import { motion, type Variants } from "framer-motion";
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { team } from '../../data/team';

interface TeamSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  onJoinTeamClick: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ setSectionRef, onJoinTeamClick }) => {
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

  return (
    <motion.section ref={setSectionRef('Team')} id="Team" className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Meet the Experts</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">The creative minds and passionate developers behind Neverland Studio's success.</p>
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants}>
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-all group transform hover:-translate-y-2"
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
                <p className="text-teal-400 text-sm mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm mb-4">{member.bio}</p>
                <div className="flex gap-3">
                  <button className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center hover:bg-teal-500/20 transition-all">
                    <Linkedin className="w-4 h-4 text-teal-300" />
                  </button>
                  <button className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center hover:bg-teal-500/20 transition-all">
                    <Twitter className="w-4 h-4 text-teal-300" />
                  </button>
                  <button className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center hover:bg-teal-500/20 transition-all">
                    <Mail className="w-4 h-4 text-teal-300" />
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
            Join Our Team
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TeamSection;