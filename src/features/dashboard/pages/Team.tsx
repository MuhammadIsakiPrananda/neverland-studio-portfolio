import { motion } from 'framer-motion';
import { Plus, Mail, Linkedin, Twitter, MoreVertical } from 'lucide-react';

const teamMembers = [
  { id: 'alex', name: 'Alex Johnson', role: 'Lead Frontend Developer', avatar: 'https://i.pravatar.cc/150?u=alex', email: 'alex.j@neverland.studio', socials: { linkedin: '#', twitter: '#' } },
  { id: 'sarah', name: 'Sarah Miller', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?u=sarah', email: 'sarah.m@neverland.studio', socials: { linkedin: '#', twitter: '#' } },
  { id: 'john', name: 'John Doe', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?u=john', email: 'john.d@neverland.studio', socials: { linkedin: '#', twitter: '#' } },
  { id: 'mike', name: 'Mike Williams', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=mike', email: 'mike.w@neverland.studio', socials: { linkedin: '#', twitter: '#' } },
  { id: 'jane', name: 'Jane Smith', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?u=jane', email: 'jane.s@neverland.studio', socials: { linkedin: '#', twitter: '#' } },
  { id: 'admin', name: 'Admin User', role: 'System Administrator', avatar: 'https://i.pravatar.cc/150?u=admin', email: 'admin@neverland.studio', socials: { linkedin: '#', twitter: '#' } },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Team = () => {
  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Anggota Tim</h1>
        <button className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors shadow-md shadow-cyan-500/20">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Undang Anggota</span>
        </button>
      </div>

      {/* Team Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {teamMembers.map(member => (
          <motion.div key={member.id} variants={itemVariants} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 text-center p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="relative inline-block">
              <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700" />
              <button className="absolute top-0 right-0 text-slate-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-cyan-400 text-sm font-medium mb-4">{member.role}</p>
            <div className="flex justify-center items-center gap-2 text-slate-400 text-sm mb-6">
              <Mail className="w-4 h-4" />
              <span>{member.email}</span>
            </div>
            <div className="flex justify-center gap-4">
              <a href={member.socials.linkedin} className="text-slate-400 hover:text-cyan-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href={member.socials.twitter} className="text-slate-400 hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Team;