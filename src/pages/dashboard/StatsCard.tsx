import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color: 'cyan' | 'teal' | 'purple' | 'orange';
  delay?: number;
}

const StatsCard = ({ title, value, icon: Icon, trend, color, delay = 0 }: StatsCardProps) => {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500',
    teal: 'from-teal-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group"
      data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-1" data-testid={`stats-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</h3>
          {trend !== undefined && (
            <p className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;