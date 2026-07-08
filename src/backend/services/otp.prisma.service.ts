import { prisma } from '../prisma';
import * as crypto from 'crypto';

const OTP_TTL_SECONDS = 300; // 5 minutes

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// SAFER APPROACH (Delete old ones first):
export async function storeOtpSafe(identifier: string, code: string): Promise<void> {
  // 1. Delete any previous unverified OTPs for this identifier
  await prisma.otpAttempt.deleteMany({
    where: {
      identifier,
      verifiedAt: null,
    },
  });

  // 2. Create the new one
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);
  await prisma.otpAttempt.create({
    data: { identifier, code, expiresAt },
  });
}

export async function verifyOtp(identifier: string, code: string): Promise<{ valid: boolean; userId?: string }> {
  const now = new Date();

  // Find the latest, unverified, non-expired OTP
  const otpRecord = await prisma.otpAttempt.findFirst({
    where: {
      identifier,
      code: code,
      verifiedAt: null,
      expiresAt: { gt: now }, // Expiration check handled natively by Prisma!
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    return { valid: false };
  }

  // Mark as verified
  await prisma.otpAttempt.update({
    where: { id: otpRecord.id },
    data: { verifiedAt: now },
  });

  return { valid: true };
}

// Create session after login
export async function createSession(userId: string, ip?: string, agent?: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const refreshToken = crypto.randomBytes(64).toString('hex');

  return prisma.userSession.create({
    data: {
      userId,
      refreshToken,
      ipAddress: ip,
      userAgent: agent,
      expiresAt,
    },
  });
}

// Validate session
export async function validateRefreshToken(token: string) {
  return prisma.userSession.findFirst({
    where: { refreshToken: token, isRevoked: false },
    include: { user: true },
  });
}
