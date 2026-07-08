import redis from '../lib/redis';
import { config } from '../config';
import crypto from 'crypto';

const OTP_PREFIX = 'otp:';

// Generate a 6-digit numeric OTP
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function storeOtp(phone: string, otp: string): Promise<void> {
  const key = `${OTP_PREFIX}${phone}`;
  await redis.set(key, otp, 'EX', config.otp.ttlSeconds);
}

export async function getOtp(phone: string): Promise<string | null> {
  const key = `${OTP_PREFIX}${phone}`;
  return await redis.get(key);
}

export async function deleteOtp(phone: string): Promise<void> {
  const key = `${OTP_PREFIX}${phone}`;
  await redis.del(key);
}
