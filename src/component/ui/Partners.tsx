import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { partners } from '../../data/partners';

const marqueeVariants: Variants = {
  animate: {
    x: [0, -1035],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 30,
        ease: "linear",
      },
    },
  },
};

const Partners: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <motion.div className="flex gap-16" variants={marqueeVariants} animate="animate">
        {[...partners, ...partners].map((partner, index) => (
          <div key={index} className="flex-shrink-0 flex items-center gap-3 text-slate-500 hover:text-white transition-colors duration-300" title={partner.name}>
            {partner.icon}
            <span className="text-xl font-semibold tracking-wider">{partner.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Partners;