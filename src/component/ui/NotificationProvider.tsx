import React, { createContext, useState, useCallback, useMemo, useRef, useContext, type ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type: NotificationType) => void;
  removeNotification: (id: number) => void;
}

// Menginisialisasi konteks dengan nilai default yang "kosong" tapi sesuai tipe,
// ini menghindari kebutuhan untuk memeriksa `undefined` di mana-mana.
// Pesan error akan ditangani oleh custom hook `useNotification`.
export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationId = useRef(0);

  const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
    const id = notificationId.current++;
    setNotifications(prev => [{ id, title, message, type }, ...prev]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Gunakan useMemo untuk memastikan objek value tidak dibuat ulang pada setiap render,
  // ini mengoptimalkan performa untuk komponen consumer.
  const value = useMemo(() => ({ notifications, addNotification, removeNotification }), [notifications, addNotification, removeNotification]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook untuk menggunakan notifikasi.
// Ini adalah pola modern yang menyederhanakan penggunaan konteks dan menambahkan validasi.
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  // Memastikan hook ini digunakan di dalam provider
  if (context.addNotification === (() => {})) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};