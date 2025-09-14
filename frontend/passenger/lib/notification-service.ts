import * as PusherPushNotifications from '@pusher/push-notifications-web';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'ticket_created' | 'booking_confirmed' | 'general';
  data?: any;
}

class NotificationService {
  private beamsClient: any = null;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  // Initialize Pusher Beams
  async initialize() {
    try {
      if (typeof window === 'undefined') return;

      // Replace with your actual Pusher Beams instance ID
      const INSTANCE_ID = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID || '5ce39d09-1471-4f0d-9357-a7444779801c';
      
      this.beamsClient = new PusherPushNotifications.Client({
        instanceId: INSTANCE_ID,
      });

      await this.beamsClient.start();
      
      // Set user ID for authenticated notifications
      const userId = this.getUserId();
      if (userId) {
        await this.setUserId(userId);
      }

      console.log('Pusher Beams initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pusher Beams:', error);
    }
  }

  // Set user ID for targeted notifications
  async setUserId(userId: string) {
    try {
      if (!this.beamsClient) return;

      await this.beamsClient.setUserId(userId, {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/pusher/beams-auth`,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      console.log('User ID set for Pusher Beams:', userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  // Subscribe to interest (topic)
  async subscribeToInterest(interest: string) {
    try {
      if (!this.beamsClient) return;
      
      await this.beamsClient.addDeviceInterest(interest);
      console.log('Subscribed to interest:', interest);
    } catch (error) {
      console.error('Failed to subscribe to interest:', error);
    }
  }

  // Unsubscribe from interest
  async unsubscribeFromInterest(interest: string) {
    try {
      if (!this.beamsClient) return;
      
      await this.beamsClient.removeDeviceInterest(interest);
      console.log('Unsubscribed from interest:', interest);
    } catch (error) {
      console.error('Failed to unsubscribe from interest:', error);
    }
  }

  // Add notification to local storage
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification);
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Delete specific notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
      });
    }
  }

  // Get user ID from storage
  private getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('passenger_id');
  }

  // Get auth token
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Save notifications to localStorage
  private saveNotifications() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  // Load notifications from localStorage
  loadNotifications() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      this.notifications = [];
    }
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.notifications]));
  }

  // Clean up
  cleanup() {
    if (this.beamsClient) {
      this.beamsClient.stop();
    }
    this.listeners = [];
  }
}

export const notificationService = new NotificationService();