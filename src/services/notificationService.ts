import { Activity } from './dashboardService';
import { showInfo, showSuccess, showWarning } from '../components/common/ModernNotification';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  activityId?: number;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Set<() => void> = new Set();
  private unreadCount = 0;

  constructor() {
    // Load notifications from localStorage
    this.loadNotifications();
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.updateUnreadCount();
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      read: false
    };

    // Add to beginning
    this.notifications = [newNotification, ...this.notifications];

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.updateUnreadCount();
    this.saveNotifications();
    this.notifyListeners();

    // Show toast notification
    this.showToast(newNotification);

    return newNotification.id;
  }

  private showToast(notification: Notification) {
    const message = notification.title;
    const description = notification.message;

    switch (notification.type) {
      case 'success':
        showSuccess(message, description);
        break;
      case 'warning':
        showWarning(message, description);
        break;
      case 'info':
      default:
        showInfo(message, description);
        break;
    }
  }

  handleNewActivity(activity: Activity) {
    const notificationMap: Record<Activity['type'], { title: string; type: Notification['type'] }> = {
      contact: {
        title: '📬 New Contact',
        type: 'info'
      },
      enrollment: {
        title: '📚 New Enrollment',
        type: 'success'
      },
      consultation: {
        title: '📅 Consultation',
        type: 'info'
      },
      newsletter: {
        title: '📰 Newsletter',
        type: 'info'
      }
    };

    const notifConfig = notificationMap[activity.type];

    this.addNotification({
      title: notifConfig.title,
      message: activity.description,
      type: notifConfig.type,
      activityId: activity.id
    });
  }

  getNotifications(limit?: number): Notification[] {
    return limit ? this.notifications.slice(0, limit) : this.notifications;
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.updateUnreadCount();
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
    this.saveNotifications();
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.updateUnreadCount();
    this.saveNotifications();
    this.notifyListeners();
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateUnreadCount();
    this.saveNotifications();
    this.notifyListeners();
  }
}

// Singleton instance
export const notificationService = new NotificationService();

export default notificationService;
