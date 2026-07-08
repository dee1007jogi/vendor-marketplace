import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Need to load from the root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
    whatsappSandbox: process.env.TWILIO_WHATSAPP_SANDBOX!,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
  },
  otp: {
    ttlSeconds: parseInt(process.env.OTP_TTL_SECONDS || '300'),
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY!,
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
  },
};

// Optional: throw early if critical vars are missing
if (!config.twilio.accountSid || !config.twilio.authToken) {
  console.warn('Missing Twilio credentials in .env. Twilio services will fail.');
}
