import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name);
  private fcmInitialized = false;

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Verifica se já foi inicializado
      if (admin.apps.length > 0) {
        this.fcmInitialized = true;
        this.logger.log('Firebase Admin already initialized');
        return;
      }

      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      
      if (!serviceAccountPath) {
        this.logger.warn(
          'FIREBASE_SERVICE_ACCOUNT_PATH not configured. Push notifications will be disabled.'
        );
        return;
      }

      const serviceAccount = require(serviceAccountPath);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.fcmInitialized = true;
      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error);
    }
  }

  /**
   * Envia notificação push para um único dispositivo
   */
  async sendToDevice(
    fcmToken: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    if (!this.fcmInitialized) {
      this.logger.warn('FCM not initialized. Skipping notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
        webpush: {
          notification: {
            icon: '/logo-192.png',
            badge: '/logo-192.png',
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send notification to ${fcmToken}:`, error);
      return false;
    }
  }

  /**
   * Envia notificação push para múltiplos dispositivos
   */
  async sendToMultipleDevices(
    fcmTokens: string[],
    payload: PushNotificationPayload
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!this.fcmInitialized) {
      this.logger.warn('FCM not initialized. Skipping notifications.');
      return { successCount: 0, failureCount: fcmTokens.length };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens: fcmTokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      this.logger.log(
        `Batch notification sent: ${response.successCount} success, ${response.failureCount} failures`
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      this.logger.error('Failed to send batch notifications:', error);
      return { successCount: 0, failureCount: fcmTokens.length };
    }
  }

  /**
   * Envia notificação para tópico (broadcast)
   */
  async sendToTopic(
    topic: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    if (!this.fcmInitialized) {
      this.logger.warn('FCM not initialized. Skipping notification.');
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

      const response = await admin.messaging().send(message);
      this.logger.log(`Topic notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send topic notification to ${topic}:`, error);
      return false;
    }
  }

  /**
   * Subscreve dispositivo a um tópico
   */
  async subscribeToTopic(
    fcmToken: string,
    topic: string
  ): Promise<boolean> {
    if (!this.fcmInitialized) {
      return false;
    }

    try {
      await admin.messaging().subscribeToTopic([fcmToken], topic);
      this.logger.log(`Device subscribed to topic: ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${topic}:`, error);
      return false;
    }
  }

  /**
   * Remove subscrição de tópico
   */
  async unsubscribeFromTopic(
    fcmToken: string,
    topic: string
  ): Promise<boolean> {
    if (!this.fcmInitialized) {
      return false;
    }

    try {
      await admin.messaging().unsubscribeFromTopic([fcmToken], topic);
      this.logger.log(`Device unsubscribed from topic: ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to unsubscribe from topic ${topic}:`, error);
      return false;
    }
  }
}
