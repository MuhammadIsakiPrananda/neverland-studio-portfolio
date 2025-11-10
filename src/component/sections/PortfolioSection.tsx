import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { portfolio } from '../../data/portfolio';
import { categories } from '../../data/categories';

interface PortfolioSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  setSectionRef, 
  activeFilter, 
  setActiveFilter 
}) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  const filteredPortfolio = activeFilter === 'All' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter);

  return (
    <motion.section ref={setSectionRef('Portfolio')} id="Portfolio" className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" >
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Our Work</span>
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
                  ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            > 
              {category}
            </button>
          ))}
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          <AnimatePresence>
            {filteredPortfolio.map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800/50 hover:border-sky-500/50 transition-all"
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
                <span className="text-sky-400 text-sm font-semibold">{project.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-slate-800/50 px-3 py-1 rounded-full text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="text-sky-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  View Case Study
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12 flex gap-4 justify-center">
          <button className="border border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-800/50 transition-all transform hover:scale-105">
            View All Projects
          </button>
          <button onClick={() => document.getElementById('Contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-sky-500 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-violet-500/30 transition-all transform hover:scale-105">
            Start Your Project
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default PortfolioSection;