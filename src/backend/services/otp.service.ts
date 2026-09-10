import redis from '../lib/redis';
import { config } from '../config';
import crypto from 'crypto';

const OTP_PREFIX = 'otp:';
const memoryStore = new Map<string, { otp: string; expiresAt: number }>();

// Generate a 6-digit numeric OTP
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function storeOtp(phone: string, otp: string): Promise<void> {
  const ttl = config.otp.ttlSeconds || 300;
  memoryStore.set(phone, { otp, expiresAt: Date.now() + ttl * 1000 });

  try {
    if (redis && redis.status === 'ready') {
      const key = `${OTP_PREFIX}${phone}`;
      await redis.set(key, otp, 'EX', ttl);
    }
  } catch (err) {
    // Fallback in-memory active
  }
}

export async function getOtp(phone: string): Promise<string | null> {
  try {
    if (redis && redis.status === 'ready') {
      const key = `${OTP_PREFIX}${phone}`;
      const val = await redis.get(key);
      if (val) return val;
    }
  } catch (err) {
    // Fallback in-memory active
  }

  const mem = memoryStore.get(phone);
  if (mem) {
    if (Date.now() <= mem.expiresAt) {
      return mem.otp;
    } else {
      memoryStore.delete(phone);
    }
  }
  return null;
}

export async function deleteOtp(phone: string): Promise<void> {
  memoryStore.delete(phone);
  try {
    if (redis && redis.status === 'ready') {
      const key = `${OTP_PREFIX}${phone}`;
      await redis.del(key);
    }
  } catch (err) {
    // Ignore
  }
}
