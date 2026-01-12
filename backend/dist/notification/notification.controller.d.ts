import { NotificationService } from './notification.service';
declare class SendNotificationDto {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}
declare class SendMultipleDto {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}
declare class SendToTopicDto {
    topic: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(dto: SendNotificationDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendMultiple(dto: SendMultipleDto): Promise<{
        success: boolean;
        successCount: number;
        failureCount: number;
        total: number;
    }>;
    sendToTopic(dto: SendToTopicDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
