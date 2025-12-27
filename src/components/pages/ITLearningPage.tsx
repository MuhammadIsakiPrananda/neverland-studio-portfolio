import { BookOpen, Users, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import EnrollmentModal from '../modals/EnrollmentModal';

export default function ITLearningPage() {
  const { t } = useLanguage();
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleEnrollClick = (course: any) => {
    setSelectedCourse(course);
    setIsEnrollmentModalOpen(true);
  };

  const courses = [
    {
      id: 'tkj',
      title: 'TKJ - Computer & Network Engineering',
      subtitle: 'Network Engineering & Computer Systems',
      description: 'Learn computer network fundamentals, device installation and configuration, troubleshooting, and IT system management.',
      duration: '6 Months',
      level: 'Beginner - Advanced',
      students: '500+',
      modules: [
        'Computer Network Fundamentals',
        'TCP/IP & OSI Model',
        'Routing & Switching',
        'Network Security & Firewall',
        'Windows & Linux Server Administration',
        'Wireless Network Configuration'
      ],
      price: 'Rp 3.500.000',
      discountPrice: 'Rp 700.000',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'rpl',
      title: 'RPL - Software Engineering',
      subtitle: 'Software Engineering & Development',
      description: 'Master modern programming, web & mobile app development, database management, and software engineering best practices.',
      duration: '6 Months',
      level: 'Beginner - Advanced',
      students: '750+',
      modules: [
        'Programming Fundamentals (HTML, CSS, JS)',
        'Web Development (React, Node.js)',
        'Mobile App Development',
        'Database Design & Management',
        'RESTful API Development',
        'Version Control with Git'
      ],
      price: 'Rp 4.000.000',
      discountPrice: 'Rp 800.000',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'sija',
      title: 'SIJA - Network Information Systems & Applications',
      subtitle: 'Network Information Systems & Applications',
      description: 'Integrate network and application knowledge to build robust and scalable information systems.',
      duration: '6 Months',
      level: 'Intermediate - Advanced',
      students: '400+',
      modules: [
        'Information Systems Management',
        'Network Infrastructure Design',
        'Cloud Computing & Deployment',
        'System Integration',
        'DevOps & CI/CD',
        'IT Project Management'
      ],
      price: 'Rp 4.500.000',
      discountPrice: 'Rp 900.000',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const features = [
    { icon: Users, text: 'Experienced Instructors' },
    { icon: BookOpen, text: 'Complete & Updated Materials' },
    { icon: Clock, text: 'Flexible Schedule' },
    { icon: Award, text: 'Official Certificate' },
  ];

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-md mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('itLearning.hero.subtitle')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('itLearning.hero.title')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed mb-8">
            {t('itLearning.hero.description')}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up delay-200">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-slate-300 text-center">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`h-full animate-fade-in-up delay-${(index + 1) * 200}`}
            >
              <div className="group relative h-full rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Header - Clean minimal design */}
              <div className="relative p-6 bg-slate-700/30 border-b border-slate-700/50">
                <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-400">{course.subtitle}</p>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Stats - Better spacing */}
                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{course.duration}</div>
                    <div className="text-xs text-slate-400">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-cyan-400 leading-tight">{course.level}</div>
                    <div className="text-xs text-slate-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{course.students}</div>
                    <div className="text-xs text-slate-400">Students</div>
                  </div>
                </div>

                {/* Modules */}
                <div className="mb-6 flex-grow">
                  <h4 className="text-sm font-semibold text-white mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    {course.modules.map((module, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{module}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-slate-700/50 mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-slate-400">Investment</div>
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold animate-pulse">80% OFF</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-sm text-slate-500 line-through">{course.price}</div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {course.id === 'tkj' ? 'Rp 700.000' : course.id === 'rpl' ? 'Rp 800.000' : 'Rp 900.000'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEnrollClick(course)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-600/20">
                    {t('itLearning.enroll')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Modal */}
      {isEnrollmentModalOpen && selectedCourse && (
        <EnrollmentModal
          theme="dark"
          course={selectedCourse}
          onClose={() => {
            setIsEnrollmentModalOpen(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}
