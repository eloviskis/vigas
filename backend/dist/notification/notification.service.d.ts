import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}
export declare class NotificationService implements OnModuleInit {
    private configService;
    private messaging;
    private isInitialized;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendToDevice(token: string, payload: NotificationPayload): Promise<boolean>;
    sendToMultipleDevices(tokens: string[], payload: NotificationPayload): Promise<{
        success: number;
        failure: number;
    }>;
    sendToTopic(topic: string, payload: NotificationPayload): Promise<boolean>;
    subscribeToTopic(tokens: string[], topic: string): Promise<boolean>;
    unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean>;
}
