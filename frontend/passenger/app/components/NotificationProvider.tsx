'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationService, Notification } from '@/lib/notification-service';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load existing notifications
    notificationService.loadNotifications();
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Subscribe to updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Initialize Pusher Beams
    initializePusherBeams();

    return () => {
      unsubscribe();
    };
  }, []);

  const initializePusherBeams = async () => {
    try {
      // Request notification permission
      await notificationService.requestPermission();
      
      // Initialize Pusher Beams
      await notificationService.initialize();

      // Subscribe to passenger-specific notifications
      const passengerId = localStorage.getItem('passenger_id');
      if (passengerId) {
        await notificationService.subscribeToInterest(`passenger-${passengerId}`);
      }

      // Subscribe to general notifications
      await notificationService.subscribeToInterest('passenger-general');

      console.log('Pusher Beams initialized and subscribed to interests');
    } catch (error) {
      console.error('Failed to initialize Pusher Beams:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    notificationService.addNotification(notification);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}