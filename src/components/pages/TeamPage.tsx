import { Github, Linkedin, Twitter, Mail, MapPin, Code2, Award, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TeamPage() {
  const { t } = useLanguage();
  const teamMembers = [
    {
      name: 'Muhammad Isaki Prananda',
      position: 'Founder & CEO',
      department: 'Leadership',
      location: 'Malang, Indonesia',
      image: '/src/assets/Profile Neverland Studio.jpg',
      bio: 'Visionary leader with 10+ years of experience in software development and business strategy.',
      skills: ['Leadership', 'Strategy', 'Full-Stack'],
      projects: '50+',
      experience: '10 years',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'isaki@neverlandstudio.com'
      }
    },
    {
      name: 'Sarah Johnson',
      position: 'CTO',
      department: 'Leadership',
      location: 'Jakarta, Indonesia',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Technical architect specializing in scalable systems and cloud infrastructure.',
      skills: ['Architecture', 'DevOps', 'Cloud'],
      projects: '40+',
      experience: '8 years',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'sarah@neverlandstudio.com'
      }
    },
    {
      name: 'Alex Chen',
      position: 'Lead Developer',
      department: 'Engineering',
      location: 'Bandung, Indonesia',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Expert in modern web technologies and passionate about clean code architecture.',
      skills: ['React', 'Node.js', 'TypeScript'],
      projects: '35+',
      experience: '6 years',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'alex@neverlandstudio.com'
      }
    },
    {
      name: 'Priya Sharma',
      position: 'UX/UI Designer',
      department: 'Design',
      location: 'Surabaya, Indonesia',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Creating beautiful and intuitive user experiences that delight customers.',
      skills: ['UI Design', 'UX Research', 'Figma'],
      projects: '30+',
      experience: '5 years',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'priya@neverlandstudio.com'
      }
    },
    {
      name: 'David Martinez',
      position: 'Senior Backend Developer',
      department: 'Engineering',
      location: 'Jakarta, Indonesia',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Building robust and scalable backend systems with modern technologies.',
      skills: ['Python', 'PostgreSQL', 'AWS'],
      projects: '28+',
      experience: '7 years',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'david@neverlandstudio.com'
      }
    },
    {
      name: 'Emma Wilson',
      position: 'Product Manager',
      department: 'Product',
      location: 'Yogyakarta, Indonesia',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      bio: 'Bridging the gap between business goals and technical implementation.',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      projects: '25+',
      experience: '6 years',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'emma@neverlandstudio.com'
      }
    },
  ];

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-[430px] h-[430px] bg-green-500/25 rounded-full blur-[110px] animate-pulse" style={{animationDelay: '1.6s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[380px] h-[380px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2.4s'}}></div>
        <div className="absolute top-2/3 right-2/5 w-[330px] h-[330px] bg-cyan-500/15 rounded-full blur-[90px] animate-pulse" style={{animationDelay: '0.8s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-md mb-6 animate-fade-in-down">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('team.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              {t('team.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed animate-fade-in-up delay-200">
            {t('team.hero.subtitle')}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto py-2">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className={`group relative rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 will-change-transform hover:-translate-y-2 animate-fade-in-scale delay-${Math.min((index + 1) * 100, 600)}`}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                {/* Department Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold">
                  {member.department}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                
                <p className="text-blue-400 font-semibold mb-2 text-sm">
                  {member.position}
                </p>

                <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
                  <MapPin className="w-3 h-3" />
                  <span>{member.location}</span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{member.projects} {t('team.stats.projects')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Award className="w-3.5 h-3.5 text-blue-400" />
                    <span>{member.experience} {t('team.stats.experience')}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-cyan-600 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-purple-600 text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
