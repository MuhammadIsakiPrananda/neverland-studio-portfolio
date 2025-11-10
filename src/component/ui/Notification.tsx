import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { NotificationItem } from './NotificationProvider';

interface NotificationProps {
  notification: NotificationItem;
  onRemove: (id: number) => void;
  index: number;
}

const icons = {
  success: <CheckCircle className="w-6 h-6 text-green-400" />,
  error: <XCircle className="w-6 h-6 text-red-400" />,
  info: <Info className="w-6 h-6 text-blue-400" />,
  warning: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
};

const borderColors = {
  success: 'border-green-500',
  error: 'border-red-500',
  info: 'border-blue-500',
  warning: 'border-yellow-500',
};

const Notification: React.FC<NotificationProps> = ({ notification, onRemove, index }) => {
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
      exit={{ opacity: 0, scale: 0.5, x: 200, transition: { duration: 0.4, ease: 'easeOut' } }}
      custom={index}
      className={`relative w-full bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden mb-4 border-l-4 ${borderColors[type]}`}
    >
      <div className="flex items-start p-5 gap-4">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="w-0 flex-1">
          <p className="text-base font-bold text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-300">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onRemove(id)}
            className="inline-flex text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
};

export default Notification;