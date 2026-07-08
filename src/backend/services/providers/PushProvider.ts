import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { INotificationProvider } from './IProvider';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FCM_SERVICE_ACCOUNT_PATH!;
if (getApps().length === 0 && serviceAccountPath) {
  try {
      const fullPath = path.resolve(process.cwd(), serviceAccountPath);
      if (fs.existsSync(fullPath)) {
        const serviceAccount = require(fullPath);
        initializeApp({
            credential: cert(serviceAccount),
        });
      } else {
        console.warn(`[FCM] Service account file not found at ${fullPath}. Push notifications will not work.`);
      }
  } catch (err) {
      console.warn('[FCM] Error loading service account. Push notifications will not work.', err);
  }
}

export interface PushPayload {
  deviceTokens: string[];          // FCM registration tokens
  title: string;
  body: string;
  data?: Record<string, string>;   // Custom key-value payload
  imageUrl?: string;
  priority?: 'normal' | 'high';
}

export class PushProvider implements INotificationProvider {
  async send(payload: PushPayload): Promise<void> {
    if (getApps().length === 0) {
      console.warn('[Push Warning] Firebase not initialized. Skipping push notification.');
      return;
    }
    
    try {
      const message: MulticastMessage = {
        tokens: payload.deviceTokens,
        notification: {
          title: payload.title,
          body: payload.body,
          ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
        },
        data: payload.data,
        android: {
          priority: payload.priority || 'normal',
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              ...(payload.priority === 'high' && { 'content-available': 1 }),
            },
          },
        },
        webpush: {
          headers: {
            Urgency: payload.priority === 'high' ? 'high' : 'normal',
          },
        },
      };

      const response = await getMessaging().sendEachForMulticast(message);

      console.log(`[Push] ${response.successCount} succeeded, ${response.failureCount} failed`);

      // Optional: handle failed tokens (e.g., remove expired ones from DB)
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.warn(`[Push] Token ${payload.deviceTokens[idx]} failed: ${resp.error?.message}`);
        }
      });
    } catch (error: any) {
      console.error('[Push Error]', error.message);
      throw new Error('Failed to send push notification');
    }
  }
}
