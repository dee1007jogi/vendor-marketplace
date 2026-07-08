import { EmailProvider, EmailPayload } from './providers/EmailProvider';
import { SMSProvider, SMSPayload } from './providers/SMSProvider';
import { PushProvider, PushPayload } from './providers/PushProvider';
import { WhatsAppProvider, WhatsAppPayload } from './providers/WhatsAppProvider';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function sendWithRetry(fn: () => Promise<void>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await fn();
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
}

export class NotificationService {
  private email = new EmailProvider();
  private sms = new SMSProvider();
  private push = new PushProvider();
  private whatsapp = new WhatsAppProvider();

  async sendEmail(payload: EmailPayload) {
    return sendWithRetry(() => this.email.send(payload));
  }

  async sendSms(payload: SMSPayload) {
    return sendWithRetry(() => this.sms.send(payload));
  }

  async sendPush(payload: PushPayload) {
    return sendWithRetry(() => this.push.send(payload));
  }

  async sendWhatsApp(payload: WhatsAppPayload) {
    return sendWithRetry(() => this.whatsapp.send(payload));
  }

  /**
   * Dispatch a notification across all applicable channels
   */
  async dispatch(event: string, recipientId: string, payload: any) {
    const user = await prisma.user.findUnique({ where: { id: recipientId } });
    if (!user) return;

    const { title, body, metadata } = this.getTemplate(event, payload);

    // 1. In-App Notification (Always)
    await prisma.notification.create({
      data: {
        userId: recipientId,
        title,
        message: body,
        type: "in-app",
        metadataJson: JSON.stringify(metadata)
      }
    });

    // 2. Email
    if (user.email) {
      await this.sendEmail({
        to: user.email,
        subject: title,
        html: `<h1>${title}</h1><p>${body}</p>`
      }).catch(err => console.error("Email failed:", err.message));
    }

    // 3. WhatsApp / SMS (if phone exists)
    if (user.phone) {
      if (event === "otp" || event === "urgent_lead") {
        await this.sendSms({ to: user.phone, message: body })
          .catch(err => console.error("SMS failed:", err.message));
      } else {
        // Fallback for demo: use text type for WhatsApp if no template is strictly needed,
        // but note the guide says text is only for 24h window. We'll try to send template if mapped,
        // else fallback to SMS if not a known template.
        await this.sendSms({ to: user.phone, message: body })
          .catch(err => console.error("Fallback SMS failed:", err.message));
      }
    }

    // 4. Push Notification
    let pushTokens: string[] = [];
    if (user.deviceTokens) {
      try {
        pushTokens = JSON.parse(user.deviceTokens);
      } catch (e) {}
    }

    if (pushTokens.length > 0) {
      await this.sendPush({
        deviceTokens: pushTokens,
        title,
        body,
        data: metadata as any
      }).catch(err => console.error("Push failed:", err.message));
    }
  }

  private getTemplate(event: string, payload: any) {
    switch (event) {
      case 'lead_new':
        return {
          title: "New Lead Matched",
          body: `You have a new lead from ${payload.buyerName} - match score ${payload.matchScore}%`,
          metadata: { leadId: payload.leadId, type: "lead" }
        };
      case 'quote_accepted':
        return {
          title: "Quote Accepted!",
          body: `Great news! Buyer ${payload.buyerName} has accepted your quote of ₹${payload.amount}.`,
          metadata: { requirementId: payload.requirementId, type: "project" }
        };
      case 'message_new':
        return {
          title: `New message from ${payload.senderName}`,
          body: payload.textPreview,
          metadata: { conversationId: payload.conversationId, type: "chat" }
        };
      case 'admin_new_registration':
        return {
          title: `New ${String(payload.role).toUpperCase()} Registration`,
          body: `A new ${String(payload.role).toUpperCase()} (${payload.name} - ${payload.email}) just registered.`,
          metadata: { userId: payload.userId, type: "registration" }
        };
      default:
        return {
          title: "System Update",
          body: "You have a new notification.",
          metadata: {}
        };
    }
  }
}

export const notificationService = new NotificationService();
