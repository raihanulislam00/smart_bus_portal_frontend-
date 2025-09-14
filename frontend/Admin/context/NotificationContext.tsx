'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pusherBeamService from '../lib/services/pusherService';

// Notification types
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  autoHide?: boolean;
  duration?: number; // in milliseconds
}

// Notification events
export type NotificationEvent = 
  | 'admin.registered'
  | 'admin.login'
  | 'admin.logout'
  | 'bus.created'
  | 'bus.updated'
  | 'bus.deleted'
  | 'profile.updated'
  | 'system.info';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Generate unique ID for notifications
  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Show notification function
  const showNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      id: generateId(),
      timestamp: new Date(),
      isRead: false,
      autoHide: true,
      duration: 5000, // 5 seconds default
      ...notificationData,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-hide notification if specified
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  }, [removeNotification]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Initialize Pusher Beam and set up push notifications
  useEffect(() => {
    const initializePusherBeam = async () => {
      try {
        // Check if push notifications are supported
        if (!pusherBeamService.isPushNotificationSupported()) {
          console.warn('Push notifications not supported in this browser');
          return;
        }

        // Request notification permission
        const permission = await pusherBeamService.requestNotificationPermission();
        if (permission === 'granted') {
          // Initialize Pusher Beam
          await pusherBeamService.init();
          
          // Start Pusher Beam (you can pass userId if needed)
          await pusherBeamService.start();
          
          // Subscribe to interests (equivalent to channels in Pusher JS)
          await pusherBeamService.subscribeToInterest('admin-notifications');
          await pusherBeamService.subscribeToInterest('bus-notifications');
          await pusherBeamService.subscribeToInterest('system-notifications');
          
          setIsConnected(pusherBeamService.getRegistrationStatus());
          console.log('✅ Pusher Beam initialized and subscribed to interests');
        } else {
          console.warn('Notification permission denied');
        }
      } catch (error) {
        console.error('❌ Error initializing Pusher Beam:', error);
        setIsConnected(false);
      }
    };

    initializePusherBeam();

    // Monitor connection status
    const checkConnection = () => {
      setIsConnected(pusherBeamService.getRegistrationStatus());
    };

    const interval = setInterval(checkConnection, 5000);

    // Listen for custom notification events (for local testing)
    const handleCustomNotification = (event: any) => {
      const { event: eventType, data } = event.detail;
      
      switch (eventType) {
        case 'admin.registered':
          showNotification({
            type: 'success',
            title: '🎉 New Admin Registered',
            message: `Welcome ${data.adminName}! Registration successful.`,
            autoHide: true,
            duration: 6000,
          });
          break;
        case 'admin.login':
          showNotification({
            type: 'info',
            title: '👋 Welcome Back',
            message: `${data.adminName} logged in successfully.`,
            autoHide: true,
            duration: 4000,
          });
          break;
        case 'admin.logout':
          showNotification({
            type: 'info',
            title: '👋 Goodbye',
            message: `${data.adminName || 'Admin'} logged out successfully.`,
            autoHide: true,
            duration: 4000,
          });
          break;
        case 'bus.created':
          showNotification({
            type: 'success',
            title: '🚌 Bus Added',
            message: `New bus "${data.busName}" has been added to the fleet.`,
            autoHide: true,
            duration: 8000, // Increased to 8 seconds
          });
          break;
        case 'bus.updated':
          showNotification({
            type: 'info',
            title: '✏️ Bus Updated',
            message: `Bus "${data.busName}" details have been updated.`,
            autoHide: true,
            duration: 8000, // Increased to 8 seconds
          });
          break;
        case 'bus.deleted':
          showNotification({
            type: 'warning',
            title: '🗑️ Bus Removed',
            message: `Bus "${data.busName}" has been removed from the fleet.`,
            autoHide: true,
            duration: 8000, // Increased to 8 seconds
          });
          break;
        case 'profile.updated':
          showNotification({
            type: 'success',
            title: '👤 Profile Updated',
            message: 'Your profile information has been successfully updated.',
            autoHide: true,
            duration: 6000, // Increased to 6 seconds
          });
          break;
      }
    };

    window.addEventListener('pusher-notification', handleCustomNotification);

    // Set up message listener for service worker communications
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION_RECEIVED') {
        const notificationData = event.data.data;
        
        // Convert push notification to local notification
        showNotification({
          type: notificationData.notificationType || 'info',
          title: notificationData.title,
          message: notificationData.body,
          autoHide: true,
          duration: 5000,
        });
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('pusher-notification', handleCustomNotification);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
      
      // Cleanup Pusher Beam interests
      const cleanup = async () => {
        try {
          await pusherBeamService.unsubscribeFromInterest('admin-notifications');
          await pusherBeamService.unsubscribeFromInterest('bus-notifications');
          await pusherBeamService.unsubscribeFromInterest('system-notifications');
          await pusherBeamService.stop();
        } catch (error) {
          console.error('Error cleaning up Pusher Beam:', error);
        }
      };
      
      cleanup();
    };
  }, [showNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    showNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    isConnected,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}