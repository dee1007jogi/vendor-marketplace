import twilio from 'twilio';
import { config } from '../config';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export async function sendSms(to: string, message: string): Promise<void> {
  try {
    await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to,
    });
    console.log(`[Twilio] SMS sent to ${to}`);
  } catch (error: any) {
    console.error('[Twilio SMS Error]', error.message);
    throw new Error('Failed to send SMS. Please try again.');
  }
}

export async function sendWhatsApp(to: string, message: string): Promise<void> {
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${config.twilio.whatsappSandbox}`, // sandbox number
      to: `whatsapp:${to}`,
    });
    console.log(`[Twilio] WhatsApp sent to ${to}`);
  } catch (error: any) {
    console.error('[Twilio WhatsApp Error]', error.message);
    throw new Error('Failed to send WhatsApp. Please try again.');
  }
}

// Unified sender
export async function sendOtpViaChannel(
  phone: string,
  otp: string,
  channel: 'sms' | 'whatsapp'
): Promise<void> {
  const message = `Your verification code is: ${otp}`;
  if (channel === 'whatsapp') {
    await sendWhatsApp(phone, message);
  } else {
    await sendSms(phone, message);
  }
}
