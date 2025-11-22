import React, { useState, useCallback, useEffect } from 'react';
import { useNotification } from './useNotification';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import type { Notification, NotificationType } from './NotificationProvider';

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

const colors: Record<NotificationType, string> = {
  success: 'bg-green-500/20 border-green-500/30 text-green-300',
  error: 'bg-red-500/20 border-red-500/30 text-red-300',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
};

const SingleNotification: React.FC<{ notification: Notification; onRemove: (id: number) => void }> = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    // Tunggu animasi selesai sebelum benar-benar menghapus notifikasi dari state global
    setTimeout(() => onRemove(notification.id), 300); // Durasi harus cocok dengan transisi
  }, [notification.id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove();
    }, 5000); // Notifikasi hilang setelah 5 detik

    return () => clearTimeout(timer);
  }, [notification.id, handleRemove]);

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg shadow-lg border w-full max-w-sm backdrop-blur-sm transition-all duration-300 ease-in-out transform
        ${colors[notification.type]}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <div className="flex-grow">
        <p className="font-bold text-white">{notification.title}</p>
        <p className="text-sm text-slate-300">{notification.message}</p>
      </div>
      <button onClick={handleRemove} className="flex-shrink-0 text-slate-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm">
      {notifications.map(notification => (
        <SingleNotification key={notification.id} notification={notification} onRemove={removeNotification} />
      ))}
    </div>
  );
};

export default NotificationContainer;