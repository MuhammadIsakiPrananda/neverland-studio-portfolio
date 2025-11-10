import React, { useState, createContext, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification from './Notification';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (title: string, message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] w-full max-w-sm">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <Notification
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;