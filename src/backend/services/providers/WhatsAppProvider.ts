import axios from 'axios';
import { INotificationProvider } from './IProvider';

const META_API_VERSION = process.env.META_WHATSAPP_API_VERSION || 'v18.0';
const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;
const PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.META_WHATSAPP_ACCESS_TOKEN!;

export interface WhatsAppPayload {
  to: string;                  // Recipient phone in E.164 format
  templateName?: string;        // Pre-approved template name (e.g., "otp_verification")
  languageCode?: string;       // e.g., "en_US"
  templateComponents?: Array<{ type: string; parameters: Array<{ type: string; text: string }> }>;
  // OR for plain text (only allowed in 24-hour customer service window):
  text?: string;
}

export class WhatsAppProvider implements INotificationProvider {
  async send(payload: WhatsAppPayload): Promise<void> {
    try {
      let data: any = {
        messaging_product: 'whatsapp',
        to: payload.to,
        type: 'template', // default to template
      };

      // If using a template (MUST for first-time customer outreach)
      if (payload.templateName) {
        data.template = {
          name: payload.templateName,
          language: { code: payload.languageCode || 'en_US' },
          components: payload.templateComponents || [],
        };
      } 
      // Fallback to text (only if user texted you first in the last 24h)
      else if (payload.text) {
        data.type = 'text';
        data.text = { body: payload.text };
      } else {
        throw new Error('Either templateName or text must be provided');
      }

      const response = await axios.post(
        `${META_GRAPH_URL}/${PHONE_NUMBER_ID}/messages`,
        data,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`[WhatsApp] Sent to ${payload.to}`, response.data.messages[0].id);
    } catch (error: any) {
      console.error('[WhatsApp Error]', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }
}
