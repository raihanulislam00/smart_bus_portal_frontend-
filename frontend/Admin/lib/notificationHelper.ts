// Notification helper to trigger local notifications
// This simulates backend Pusher events for demonstration

export const triggerNotification = (event: string, data: any) => {
  // Simulate Pusher event by dispatching custom event
  if (typeof window !== 'undefined') {
    const customEvent = new CustomEvent('pusher-notification', {
      detail: { event, data }
    });
    window.dispatchEvent(customEvent);
  }
};

// Notification event types
export const NOTIFICATION_EVENTS = {
  ADMIN_REGISTERED: 'admin.registered',
  ADMIN_LOGIN: 'admin.login',
  ADMIN_LOGOUT: 'admin.logout',
  BUS_CREATED: 'bus.created',
  BUS_UPDATED: 'bus.updated',
  BUS_DELETED: 'bus.deleted',
  PROFILE_UPDATED: 'profile.updated',
  SYSTEM_INFO: 'system.info',
} as const;

export type NotificationEventType = typeof NOTIFICATION_EVENTS[keyof typeof NOTIFICATION_EVENTS];