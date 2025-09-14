import { Client } from '@pusher/push-notifications-web';

// Pusher Beam configuration
const beamConfig = {
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAM_INSTANCE_ID || '631d4a95-00ad-449c-a835-a427ad287195',
};

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
}

class PusherBeamService {
  private beamClient: Client | null = null;
  private isInitialized: boolean = false;
  private isRegistered: boolean = false;
  private userId: string | null = null;

  // Initialize Pusher Beam client
  async init(): Promise<void> {
    if (typeof window !== 'undefined' && !this.beamClient) {
      try {
        this.beamClient = new Client({
          instanceId: beamConfig.instanceId,
        });

        // Register service worker
        await this.registerServiceWorker();
        
        this.isInitialized = true;
        console.log('✅ Pusher Beam initialized successfully');
      } catch (error) {
        console.error('❌ Pusher Beam initialization error:', error);
        throw error;
      }
    }
  }

  // Register service worker for push notifications
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered successfully:', registration);
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
        throw error;
      }
    } else {
      throw new Error('Push notifications not supported in this browser');
    }
  }

  // Set user ID with proper token provider
  async setUserId(userId: string, tokenProviderUrl?: string): Promise<void> {
    if (!this.beamClient || !this.isRegistered) {
      throw new Error('Beam client not started. Call start() first.');
    }

    try {
      if (tokenProviderUrl) {
        // Use custom token provider URL
        await this.beamClient.setUserId(userId, {
          url: tokenProviderUrl,
          headers: {},
        } as any);
      } else {
        // For development/testing, use a simple token provider
        await this.beamClient.setUserId(userId, {
          url: '/api/pusher/beam-auth',
          headers: {},
        } as any);
      }
      
      this.userId = userId;
      console.log(`✅ User ID set for Pusher Beam: ${userId}`);
    } catch (error) {
      console.error('❌ Error setting user ID:', error);
      // Continue without user ID if token provider fails
      console.warn('Continuing without user-specific authentication');
    }
  }

  // Start the Beam client and request permission
  async start(userId?: string, tokenProviderUrl?: string): Promise<void> {
    if (!this.beamClient) {
      await this.init();
    }

    try {
      if (!this.beamClient) {
        throw new Error('Beam client not initialized');
      }

      await this.beamClient.start();
      this.isRegistered = true;
      
      if (userId) {
        await this.setUserId(userId, tokenProviderUrl);
        console.log(`✅ Pusher Beam started for user: ${userId}`);
      } else {
        console.log('✅ Pusher Beam started (anonymous)');
      }
    } catch (error) {
      console.error('❌ Pusher Beam start error:', error);
      throw error;
    }
  }

  // Subscribe to interests (similar to channels in Pusher JS)
  async subscribeToInterest(interest: string): Promise<void> {
    if (!this.beamClient || !this.isRegistered) {
      throw new Error('Beam client not started. Call start() first.');
    }

    try {
      await this.beamClient.addDeviceInterest(interest);
      console.log(`✅ Subscribed to interest: ${interest}`);
    } catch (error) {
      console.error(`❌ Error subscribing to interest ${interest}:`, error);
      throw error;
    }
  }

  // Unsubscribe from interests
  async unsubscribeFromInterest(interest: string): Promise<void> {
    if (!this.beamClient || !this.isRegistered) {
      return; // Gracefully handle if not initialized
    }

    try {
      await this.beamClient.removeDeviceInterest(interest);
      console.log(`✅ Unsubscribed from interest: ${interest}`);
    } catch (error) {
      console.error(`❌ Error unsubscribing from interest ${interest}:`, error);
    }
  }

  // Get all device interests
  async getDeviceInterests(): Promise<string[]> {
    if (!this.beamClient || !this.isRegistered) {
      return [];
    }

    try {
      return await this.beamClient.getDeviceInterests();
    } catch (error) {
      console.error('❌ Error getting device interests:', error);
      return [];
    }
  }

  // Clear all interests
  async clearAllInterests(): Promise<void> {
    if (!this.beamClient || !this.isRegistered) {
      return;
    }

    try {
      await this.beamClient.clearDeviceInterests();
      console.log('✅ Cleared all device interests');
    } catch (error) {
      console.error('❌ Error clearing device interests:', error);
    }
  }

  // Stop the Beam client
  async stop(): Promise<void> {
    if (this.beamClient && this.isRegistered) {
      try {
        await this.beamClient.stop();
        this.isRegistered = false;
        this.userId = null;
        console.log('✅ Pusher Beam stopped');
      } catch (error) {
        console.error('❌ Error stopping Pusher Beam:', error);
      }
    }
  }

  // Get initialization status
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  // Get registration status
  getRegistrationStatus(): boolean {
    return this.isRegistered;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.userId;
  }

  // Check if push notifications are supported
  isPushNotificationSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return Notification.permission;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Get Beam client instance
  getInstance(): Client | null {
    return this.beamClient;
  }
}

// Export singleton instance
export const pusherBeamService = new PusherBeamService();
export default pusherBeamService;