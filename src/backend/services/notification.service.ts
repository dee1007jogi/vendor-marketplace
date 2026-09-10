import twilio from 'twilio';
import { config } from '../config';

function getTwilioClient() {
  if (config.twilio.accountSid && config.twilio.authToken) {
    return twilio(config.twilio.accountSid, config.twilio.authToken);
  }
  return null;
}

export function formatToE164(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return `+${cleaned}`;
}

export async function sendSms(to: string, message: string): Promise<void> {
  const client = getTwilioClient();
  if (!client || !config.twilio.phoneNumber) {
    throw new Error('Twilio SMS not configured');
  }

  const formattedTo = formatToE164(to);
  try {
    await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to: formattedTo,
    });
    console.log(`[Twilio] SMS sent to ${formattedTo}`);
  } catch (error: any) {
    console.error('[Twilio SMS Error]', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
}

export async function sendWhatsApp(to: string, message: string): Promise<void> {
  const client = getTwilioClient();
  if (!client) {
    throw new Error('Twilio not configured');
  }

  const formattedTo = formatToE164(to);
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${config.twilio.whatsappSandbox}`, // sandbox number
      to: `whatsapp:${formattedTo}`,
    });
    console.log(`[Twilio] WhatsApp sent to ${formattedTo}`);
  } catch (error: any) {
    console.error('[Twilio WhatsApp Error]', error.message);
    throw new Error(`Failed to send WhatsApp: ${error.message}`);
  }
}

export async function sendOtpViaTwilioVerify(phone: string, channel: 'sms' | 'whatsapp' = 'sms'): Promise<boolean> {
  const client = getTwilioClient();
  if (client && config.twilio.verifyServiceSid) {
    const formatted = formatToE164(phone);
    try {
      await client.verify.v2.services(config.twilio.verifyServiceSid).verifications.create({
        to: formatted,
        channel: channel === 'whatsapp' ? 'whatsapp' : 'sms',
      });
      console.log(`[Twilio Verify] Verification initiated for ${formatted} via ${channel}`);
      return true;
    } catch (err: any) {
      console.error('[Twilio Verify Error]', err.message);
      throw new Error(`Twilio Verify Error: ${err.message}`);
    }
  }
  return false;
}

export async function checkOtpViaTwilioVerify(phone: string, code: string): Promise<boolean> {
  const client = getTwilioClient();
  if (client && config.twilio.verifyServiceSid) {
    const formatted = formatToE164(phone);
    try {
      const check = await client.verify.v2.services(config.twilio.verifyServiceSid).verificationChecks.create({
        to: formatted,
        code,
      });
      console.log(`[Twilio Verify] Check status for ${formatted}: ${check.status}`);
      return check.status === 'approved';
    } catch (err: any) {
      console.error('[Twilio Verify Check Error]', err.message);
      return false;
    }
  }
  return false;
}

// Unified sender with fallback
export async function sendOtpViaChannel(
  phone: string,
  otp: string,
  channel: 'sms' | 'whatsapp'
): Promise<void> {
  // If Twilio Verify service is present, dispatch via official Twilio Verify
  if (config.twilio.verifyServiceSid) {
    await sendOtpViaTwilioVerify(phone, channel);
    return;
  }

  // Fallback to direct SMS or WhatsApp if phone number is provided
  const message = `Your verification code is: ${otp}`;
  if (channel === 'whatsapp') {
    await sendWhatsApp(phone, message);
  } else if (config.twilio.phoneNumber) {
    await sendSms(phone, message);
  }
}
