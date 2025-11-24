import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ChartCard = ({ title, children, className = '' }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-slate-800/50 border border-slate-700 p-4 sm:p-6 rounded-xl ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-64 sm:h-72">{children}</div>
    </motion.div>
  );
};

export default ChartCard;