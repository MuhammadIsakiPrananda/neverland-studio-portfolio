import { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Code2, Check, Star, Award, TrendingUp } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  // Mock detailed features based on project
  const features = [
    'Responsive design across all devices',
    'Modern UI/UX with smooth animations',
    'SEO optimized for search engines',
    'Fast loading performance',
    'Secure authentication system',
    'Real-time data synchronization',
    'Cloud-based architecture',
    'Comprehensive admin dashboard',
  ];

  const highlights = [
    { icon: Star, label: 'Client Rating', value: '5.0/5.0' },
    { icon: Award, label: 'Project Status', value: 'Completed' },
    { icon: TrendingUp, label: 'Performance', value: '+150%' },
    { icon: Code2, label: 'Code Quality', value: 'A+' },
  ];

  return (
    <>
      {/* Backdrop - No onClick to prevent closing */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-y-auto">
        <div 
          className="relative w-full max-w-4xl my-auto bg-slate-950 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-scale-in border border-slate-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-lg"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Scrollable Content - Hidden scrollbar but still scrollable */}
          <div className="overflow-y-auto max-h-[85vh] sm:max-h-[90vh] hide-scrollbar">
            {/* Header Image */}
            <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold shadow-lg">
                {project.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                {project.title}
              </h2>
              
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8">
                {project.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">Client</div>
                    <div className="text-sm font-semibold text-white truncate">{project.client}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">Completed</div>
                    <div className="text-sm font-semibold text-white">December 2024</div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Project Highlights
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {highlights.map((highlight, idx) => (
                    <div 
                      key={idx}
                      className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-blue-500/50 transition-colors"
                    >
                      <highlight.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-[10px] sm:text-xs text-slate-500 mb-1">{highlight.label}</div>
                      <div className="text-base sm:text-lg font-bold text-white">{highlight.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mt-0.5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {Array.isArray(project.technologies) && project.technologies.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center pt-2 sm:pt-4">
                <button className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5">
                  <span>View Live Project</span>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        /* Hide scrollbar but keep functionality */
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
}
