// Service Worker for Pusher Beam push notifications
// TypeScript version with proper type definitions
// This file is compiled to sw.js during the build process
// Run: npm run build:sw to compile manually
// Or: npm run dev/build will compile automatically
/// <reference lib="webworker" />
// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing');
    self.skipWaiting();
});
// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating');
    event.waitUntil(self.clients.claim());
});
// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);
    if (!event.data) {
        console.log('Push event but no data');
        return;
    }
    try {
        const data = event.data.json();
        console.log('Push notification data:', data);
        const options = {
            body: data.body || 'You have a new notification',
            icon: data.icon || '/favicon.ico',
            badge: data.badge || '/favicon.ico',
            data: data.data || {},
            tag: data.tag || 'general',
            requireInteraction: data.requireInteraction || false,
            actions: data.actions || [],
            timestamp: Date.now(),
            silent: data.silent || false,
            vibrate: data.vibrate || [200, 100, 200],
        };
        const title = data.title || 'Smart Bus Portal';
        event.waitUntil(self.registration.showNotification(title, options));
    }
    catch (error) {
        console.error('Error parsing push notification data:', error);
        // Show default notification if parsing fails
        event.waitUntil(self.registration.showNotification('Smart Bus Portal', {
            body: 'You have a new notification',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'default',
        }));
    }
});
// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    event.notification.close();
    const notificationData = event.notification.data || {};
    const action = event.action;
    // Handle notification actions
    if (action) {
        console.log('Notification action clicked:', action);
        // Handle specific actions here
    }
    // Determine URL to open
    let urlToOpen = '/';
    if (notificationData.url) {
        urlToOpen = notificationData.url;
    }
    else if (notificationData.type) {
        // Route based on notification type
        switch (notificationData.type) {
            case 'bus_created':
            case 'bus_updated':
            case 'bus_deleted':
                urlToOpen = '/admin/buses';
                break;
            case 'profile_updated':
                urlToOpen = `/admin/${notificationData.adminId || ''}`;
                break;
            case 'admin_login':
                urlToOpen = '/admin/dashboard';
                break;
            default:
                urlToOpen = '/admin/dashboard';
        }
    }
    // Open or focus the app
    event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
                // If app is open, focus it and navigate
                return client.focus().then(() => {
                    return client.navigate(urlToOpen);
                });
            }
        }
        // If app is not open, open new window
        if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
        }
    }));
});
// Notification close event
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);
    // Track notification close if needed
    const notificationData = event.notification.data || {};
    if (notificationData.trackClose) {
        // Send analytics or tracking data
        console.log('Tracking notification close for:', notificationData);
    }
});
// Background sync event (for offline functionality)
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    if (event.tag === 'notification-sync') {
        event.waitUntil(
        // Sync any pending notifications or data
        Promise.resolve(console.log('Syncing notifications...')));
    }
});
// Message event (for communication with main thread)
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);
    const messageData = event.data;
    if (messageData && messageData.type) {
        switch (messageData.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'GET_VERSION':
                if (event.ports && event.ports[0]) {
                    event.ports[0].postMessage({ version: '1.0.0' });
                }
                break;
            default:
                console.log('Unknown message type:', messageData.type);
        }
    }
});
// Error event
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event);
});
// Unhandled rejection event
self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event);
});
console.log('Service Worker loaded successfully');
export {};
