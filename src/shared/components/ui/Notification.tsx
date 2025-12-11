import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import type { Notification as NotificationType } from "./NotificationProvider";

interface NotificationProps {
  notification: NotificationType;
  onRemove: (id: number) => void;
  index: number;
}

const icons = {
  success: <CheckCircle className="w-6 h-6 text-premium-champagne-gold-400" />,
  error: <XCircle className="w-6 h-6 text-red-400" />,
  info: <Info className="w-6 h-6 text-sky-400" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
};

const borderColors = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
};

const NotificationComponent: React.FC<NotificationProps> = ({
  notification,
  onRemove,
  index,
}) => {
  const { id, message, type, title } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.5, x: 100 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{
        opacity: 0,
        scale: 0.5,
        x: 200,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      custom={index}
      className="relative w-full max-w-sm bg-slate-800/80 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
    >
      <div className="flex items-start p-4 gap-4">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="w-0 flex-1">
          <p className="text-base font-bold text-slate-100">{title}</p>
          <p className="mt-1 text-sm text-slate-300">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onRemove(id)}
            className="inline-flex text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${borderColors[type]}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
};

export default NotificationComponent;
