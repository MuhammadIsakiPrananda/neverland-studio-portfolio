
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import { ArrowRight, X, ExternalLink } from 'lucide-react';
import { portfolio } from '../../data/portfolio';
import { categories } from '../../data/categories';

type Project = typeof portfolio[0] & {
  videoUrl?: string;
};

interface PortfolioSectionProps {
  isLoading: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  setShowVideo: (show: boolean) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  isLoading,
  setSectionRef, 
  activeFilter, 
  setActiveFilter,
  setShowVideo
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Cleanup function to ensure scroll is restored on component unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedProject]);
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const filteredPortfolio = activeFilter === 'All' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter);

  return (
    <motion.section
      ref={(el) => {
        setSectionRef('Portfolio')(el);
        sectionRef.current = el;
      }}
      id="Portfolio"
      className="py-20 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" >
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Our Work</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Featured Projects</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore a selection of our finest work, showcasing our expertise across various industries.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category} // Using category directly as key, assuming it's unique and stable
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            > 
              {category}
            </button>
          ))}
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          <AnimatePresence>
            {filteredPortfolio.slice(0, visibleCount).map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => (project as Project).videoUrl ? setShowVideo(true) : setSelectedProject(project)}
              className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800/50 hover:border-amber-500/50 transition-all cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <span className="text-amber-400 text-sm font-semibold">{project.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-xs bg-slate-800/50 px-3 py-1 rounded-full text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent video modal from opening
                    setSelectedProject(project);
                  }}
                  className="text-amber-400 font-semibold flex items-center justify-center gap-2 group-hover:gap-3 transition-all z-20 relative"
                >
                  View Case Study
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12 flex gap-4 justify-center">
          {visibleCount < filteredPortfolio.length && (
            <button 
              onClick={() => setVisibleCount(filteredPortfolio.length)}
              className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105"
            >
              View More
            </button>
          )}
          {visibleCount > 6 && (
            <button 
              onClick={() => setVisibleCount(6)}
              className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105"
            >
              Show Less
            </button>
          )}
          <button onClick={() => document.getElementById('Contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-105">
            Start Your Project
          </button>
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
              className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header Modal */}
              <div className="flex-shrink-0 p-4 sm:p-6 flex justify-between items-center border-b border-slate-800">
                <div>
                  <span className="text-amber-400 font-semibold text-sm">{selectedProject.category}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedProject.title}</h2>
                </div>
                <button onClick={() => setSelectedProject(null)} className="w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <X className="w-5 h-5 text-slate-300" />
                </button>
              </div>

              {/* Konten Modal dengan Scroll */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Kolom Gambar */}
                  <div className="lg:col-span-2">
                    <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden mb-6 shadow-lg shadow-black/30">
                      <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Client</h4>
                        <p className="text-white font-medium text-sm">Innovate Corp</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Date</h4>
                        <p className="text-white font-medium text-sm">May 2024</p>
                      </div>
                    </div>
                  </div>

                  {/* Kolom Deskripsi */}
                  <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Project Overview</h3>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {selectedProject.desc} This is a more detailed description for the case study. We can elaborate on the challenges, our approach, the technologies used, and the final outcome of the project. For this example, we're just using placeholder text to demonstrate a more complete layout.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-slate-700/80 px-3 py-1.5 rounded-full text-slate-300 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 group transform hover:scale-105">
                      Visit Live Site
                      <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default PortfolioSection;