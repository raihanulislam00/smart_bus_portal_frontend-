// Pusher Beams Service Worker
// This file is required for Pusher Beams web push notifications

importScripts('https://js.pusher.com/beams/service-worker.js');

// Optional: Add custom service worker functionality
self.addEventListener('install', function(event) {
  console.log('Pusher Beams service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Pusher Beams service worker activated');
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Handle the click action
  if (event.action === 'view') {
    // Open the app or specific page
    event.waitUntil(
      clients.openWindow('/passenger/dashboard')
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Optional: Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
});