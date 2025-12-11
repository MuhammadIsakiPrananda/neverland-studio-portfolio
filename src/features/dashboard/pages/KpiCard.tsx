import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend: string;
  isPositive: boolean;
  color: string;
}

const KpiCard = ({
  title,
  value,
  icon,
  trend,
  isPositive,
  color,
}: KpiCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex gap-5 items-center transition-shadow hover:shadow-lg hover:shadow-violet-600/20"
    >
      <div className={`p-3 rounded-lg bg-slate-800 ${color}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <div
          className={`flex items-center gap-1 text-xs ${
            isPositive ? "text-premium-champagne-gold-400" : "text-red-400"
          }`}
        >
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          <span>{trend}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;
