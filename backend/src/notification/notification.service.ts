import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

@Injectable()
export class NotificationService implements OnModuleInit {
  private messaging: admin.messaging.Messaging;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const firebaseConfig = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
      
      if (!firebaseConfig) {
        console.warn('⚠️  Firebase not configured - push notifications disabled');
        return;
      }

      // Parse service account JSON
      const serviceAccount = JSON.parse(firebaseConfig);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.messaging = admin.messaging();
      this.isInitialized = true;
      console.log('✅ Firebase Cloud Messaging initialized');
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error.message);
    }
  }

  async sendToDevice(
    token: string,
    payload: NotificationPayload,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('Firebase not initialized - skipping notification');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        webpush: {
          headers: {
            Urgency: 'high',
          },
          notification: {
            title: payload.title,
            body: payload.body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            requireInteraction: true,
          },
        },
      };

      const response = await this.messaging.send(message);
      console.log('✅ Notification sent successfully:', response);
      return true;
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      return false;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<{ success: number; failure: number }> {
    if (!this.isInitialized) {
      console.warn('Firebase not initialized - skipping notifications');
      return { success: 0, failure: tokens.length };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        webpush: {
          headers: {
            Urgency: 'high',
          },
          notification: {
            title: payload.title,
            body: payload.body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
          },
        },
      };

      const response = await this.messaging.sendEachForMulticast(message);
      console.log(
        `✅ Sent ${response.successCount}/${tokens.length} notifications`,
      );

      return {
        success: response.successCount,
        failure: response.failureCount,
      };
    } catch (error) {
      console.error('❌ Error sending multicast notification:', error);
      return { success: 0, failure: tokens.length };
    }
  }

  async sendToTopic(
    topic: string,
    payload: NotificationPayload,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('Firebase not initialized - skipping notification');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
      };

      const response = await this.messaging.send(message);
      console.log(`✅ Notification sent to topic ${topic}:`, response);
      return true;
    } catch (error) {
      console.error(`❌ Error sending notification to topic ${topic}:`, error);
      return false;
    }
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    if (!this.isInitialized) return false;

    try {
      await this.messaging.subscribeToTopic(tokens, topic);
      console.log(`✅ Subscribed ${tokens.length} devices to topic ${topic}`);
      return true;
    } catch (error) {
      console.error(`❌ Error subscribing to topic ${topic}:`, error);
      return false;
    }
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    if (!this.isInitialized) return false;

    try {
      await this.messaging.unsubscribeFromTopic(tokens, topic);
      console.log(`✅ Unsubscribed ${tokens.length} devices from topic ${topic}`);
      return true;
    } catch (error) {
      console.error(`❌ Error unsubscribing from topic ${topic}:`, error);
      return false;
    }
  }
}
