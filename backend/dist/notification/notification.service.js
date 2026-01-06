"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = __importStar(require("firebase-admin"));
let NotificationService = class NotificationService {
    constructor(configService) {
        this.configService = configService;
        this.isInitialized = false;
    }
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
        }
        catch (error) {
            console.error('❌ Error initializing Firebase:', error.message);
        }
    }
    async sendToDevice(token, payload) {
        if (!this.isInitialized) {
            console.warn('Firebase not initialized - skipping notification');
            return false;
        }
        try {
            const message = {
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
        }
        catch (error) {
            console.error('❌ Error sending notification:', error);
            return false;
        }
    }
    async sendToMultipleDevices(tokens, payload) {
        if (!this.isInitialized) {
            console.warn('Firebase not initialized - skipping notifications');
            return { success: 0, failure: tokens.length };
        }
        try {
            const message = {
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
            console.log(`✅ Sent ${response.successCount}/${tokens.length} notifications`);
            return {
                success: response.successCount,
                failure: response.failureCount,
            };
        }
        catch (error) {
            console.error('❌ Error sending multicast notification:', error);
            return { success: 0, failure: tokens.length };
        }
    }
    async sendToTopic(topic, payload) {
        if (!this.isInitialized) {
            console.warn('Firebase not initialized - skipping notification');
            return false;
        }
        try {
            const message = {
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
        }
        catch (error) {
            console.error(`❌ Error sending notification to topic ${topic}:`, error);
            return false;
        }
    }
    async subscribeToTopic(tokens, topic) {
        if (!this.isInitialized)
            return false;
        try {
            await this.messaging.subscribeToTopic(tokens, topic);
            console.log(`✅ Subscribed ${tokens.length} devices to topic ${topic}`);
            return true;
        }
        catch (error) {
            console.error(`❌ Error subscribing to topic ${topic}:`, error);
            return false;
        }
    }
    async unsubscribeFromTopic(tokens, topic) {
        if (!this.isInitialized)
            return false;
        try {
            await this.messaging.unsubscribeFromTopic(tokens, topic);
            console.log(`✅ Unsubscribed ${tokens.length} devices from topic ${topic}`);
            return true;
        }
        catch (error) {
            console.error(`❌ Error unsubscribing from topic ${topic}:`, error);
            return false;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationService);
