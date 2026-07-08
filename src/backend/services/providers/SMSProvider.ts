import twilio from 'twilio';
import { INotificationProvider } from './IProvider';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export interface SMSPayload {
  to: string;          // E.164 format: +1234567890
  message: string;
}

export class SMSProvider implements INotificationProvider {
  async send(payload: SMSPayload): Promise<void> {
    try {
      await client.messages.create({
        body: payload.message,
        from: FROM_NUMBER,
        to: payload.to,
      });
      console.log(`[SMS] Sent to ${payload.to}`);
    } catch (error: any) {
      console.error('[SMS Error]', error.message);
      throw new Error('Failed to send SMS');
    }
  }
}
