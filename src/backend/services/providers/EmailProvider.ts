import sgMail from '@sendgrid/mail';
import { INotificationProvider } from './IProvider';

// Load API key from env
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.FROM_EMAIL!;

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;        // HTML body
  text?: string;       // plain text fallback
  templateId?: string; // optional SendGrid template ID
  dynamicTemplateData?: Record<string, any>;
}

export class EmailProvider implements INotificationProvider {
  async send(payload: EmailPayload): Promise<void> {
    try {
      const msg = {
        to: payload.to,
        from: FROM_EMAIL,
        subject: payload.subject,
        text: payload.text || payload.html.replace(/<[^>]+>/g, ''), // Strip tags for plain text
        html: payload.html,
        ...(payload.templateId && { templateId: payload.templateId }),
        ...(payload.dynamicTemplateData && { dynamicTemplateData: payload.dynamicTemplateData }),
      };

      await sgMail.send(msg);
      console.log(`[Email] Sent to ${payload.to}`);
    } catch (error: any) {
      console.error('[Email Error]', error.response?.body || error.message);
      throw new Error('Failed to send email');
    }
  }
}
